import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'

/**
 * Netlify Serverless Function: Create Stripe Checkout Session
 * 
 * Endpoint: /.netlify/functions/create-donation-session
 * 
 * Para Vercel: copia este mismo código en /api/create-donation-session.ts
 */
const handler: Handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'STRIPE_SECRET_KEY no configurado' }) }
    }

    const { amount, currency = 'mxn', donorEmail, donorName, donorRfc, successUrl, cancelUrl } = JSON.parse(event.body ?? '{}')

    if (!amount || amount < 10) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'El monto mínimo es $10 MXN' }) }
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2025-04-30.basil' })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: donorEmail || undefined,
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: 'Donación a Fundación Atikka',
              description: `Donación de $${amount} MXN para alimentar bebés en situación vulnerable`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || 'https://fundacionatika.com.mx/?donacion=exitosa',
      cancel_url: cancelUrl || 'https://fundacionatika.com.mx/?donacion=cancelada',
      metadata: {
        donorName: donorName ?? '',
        donorEmail: donorEmail ?? '',
        donorRfc: donorRfc ?? '',
        source: 'fundacion-atikka-web',
      },
    })

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ sessionId: session.id, url: session.url }),
    }
  } catch (err: unknown) {
    console.error('[Stripe] Error:', err)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err instanceof Error ? err.message : 'Error interno del servidor' }),
    }
  }
}

export { handler }
