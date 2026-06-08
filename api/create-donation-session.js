// @ts-check
import Stripe from 'stripe'

/**
 * Vercel Serverless Function — POST /api/create-donation-session
 * Creates a Stripe Checkout session for a donation.
 *
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
export default async function handler(req, res) {
  // CORS headers for safety
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    console.error('[Stripe] STRIPE_SECRET_KEY is not set')
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
    } = req.body ?? {}

    if (!amount || Number(amount) < 10) {
      return res.status(400).json({ error: 'El monto mínimo de donación es $10 MXN.' })
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2026-05-27.dahlia' })

    const origin =
      req.headers.origin ||
      req.headers.referer?.replace(/\/$/, '') ||
      'https://fundacionattikka.vercel.app'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: donorEmail || undefined,
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(Number(amount) * 100),
            product_data: {
              name: 'Donación a Fundación Atikka',
              description: `Donación de $${amount} MXN para alimentar bebés en situación vulnerable`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${origin}/?donacion=exitosa`,
      cancel_url: cancelUrl || `${origin}/?donacion=cancelada`,
      metadata: {
        donorName: donorName || '',
        donorEmail: donorEmail || '',
        donorRfc: donorRfc || '',
        source: 'fundacion-atikka-web',
      },
    })

    return res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (err) {
    console.error('[Stripe] Error creating session:', err)
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Error interno del servidor',
    })
  }
}
