import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Dev-only API middleware for Stripe checkout session
      {
        name: 'stripe-donation-api',
        configureServer(server) {
          server.middlewares.use('/api/create-donation-session', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            try {
              // Read request body
              const body: Buffer[] = []
              for await (const chunk of req) body.push(chunk)
              const data = JSON.parse(Buffer.concat(body).toString())

              const { amount, currency = 'mxn', donorEmail, donorName, successUrl, cancelUrl } = data

              if (!amount || amount < 10) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'El monto mínimo es $10 MXN' }))
                return
              }

              const stripeKey = env.STRIPE_SECRET_KEY
              if (!stripeKey) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'STRIPE_SECRET_KEY no configurado' }))
                return
              }

              // Dynamic import stripe only in Node context
              const { default: Stripe } = await import('stripe')
              const stripe = new Stripe(stripeKey, { apiVersion: '2026-05-27.dahlia' })

              const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                customer_email: donorEmail || undefined,
                line_items: [
                  {
                    price_data: {
                      currency,
                      unit_amount: Math.round(amount * 100), // Stripe uses cents
                      product_data: {
                        name: 'Donación a Fundación Atikka',
                        description: `Donación de $${amount} MXN para alimentar bebés en situación vulnerable`,
                        images: ['https://fundacionatika.com.mx/assets/logo.png'],
                      },
                    },
                    quantity: 1,
                  },
                ],
                success_url: successUrl || `${req.headers.origin}/?donacion=exitosa`,
                cancel_url: cancelUrl || `${req.headers.origin}/?donacion=cancelada`,
                metadata: {
                  donorName: donorName || '',
                  donorEmail: donorEmail || '',
                  source: 'fundacion-atikka-web',
                },
              })

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ sessionId: session.id, url: session.url }))
            } catch (err: unknown) {
              console.error('[Stripe] Error creating session:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Error interno' }))
            }
          })
        },
      },
    ],
  }
})
