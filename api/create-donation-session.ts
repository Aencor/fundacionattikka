import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY no está configurado en Vercel' })
  }

  try {
    const {
      amount,
      currency = 'mxn',
      donorEmail,
      donorName,
      donorRfc,
      successUrl,
      cancelUrl,
    } = req.body

    if (!amount || Number(amount) < 10) {
      return res.status(400).json({ error: 'El monto mínimo de donación es $10 MXN.' })
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2026-05-27.dahlia' })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: donorEmail || undefined,
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(Number(amount) * 100), // Stripe uses cents
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
        donorRfc: donorRfc || '',
        source: 'fundacion-atikka-web',
      },
    })

    return res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (err: unknown) {
    console.error('[Stripe] Error creating session:', err)
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Error interno del servidor',
    })
  }
}
