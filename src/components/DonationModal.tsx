import { useState } from 'react'
import { X, ArrowLeft, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

// ─── Stripe public key ───────────────────────────────────────────────────────
// Replace with your actual Stripe publishable key (starts with pk_live_ or pk_test_)
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? ''

// Pre-set donation amounts in MXN
const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500]

interface Props {
  onClose: () => void
}

type Step = 1 | 2 | 3

interface DonorInfo {
  name: string
  email: string
  rfc: string
  wantsReceipt: boolean
}

export default function DonationModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [amount, setAmount] = useState<number>(250)
  const [customAmount, setCustomAmount] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [donor, setDonor] = useState<DonorInfo>({ name: '', email: '', rfc: '', wantsReceipt: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success] = useState(false)

  const finalAmount = useCustom ? parseFloat(customAmount) || 0 : amount

  // ─── Proceed to Stripe Checkout ─────────────────────────────────────────────
  async function handlePay() {
    if (!STRIPE_PUBLIC_KEY) {
      setError('Stripe no está configurado. Agrega VITE_STRIPE_PUBLISHABLE_KEY en tu .env')
      return
    }
    if (finalAmount < 10) {
      setError('El monto mínimo de donación es $10 MXN.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const stripe = await loadStripe(STRIPE_PUBLIC_KEY)
      if (!stripe) throw new Error('No se pudo cargar Stripe.')

      // Auto-detect endpoint: Vite dev proxy vs Netlify production function
      const apiUrl = import.meta.env.DEV
        ? '/api/create-donation-session'
        : '/.netlify/functions/create-donation-session'

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,          // amount in MXN
          currency: 'mxn',
          donorName: donor.name,
          donorEmail: donor.email,
          donorRfc: donor.wantsReceipt ? donor.rfc : undefined,
          successUrl: `${window.location.origin}/?donacion=exitosa`,
          cancelUrl: `${window.location.origin}/?donacion=cancelada`,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || `Error del servidor (${res.status})`)
      }

      const { sessionId, url } = await res.json()

      // Save donation data so ThankYouPage can display it after redirect
      sessionStorage.setItem('atikka_donation', JSON.stringify({
        amount: finalAmount,
        donorName: donor.name,
        donorEmail: donor.email,
      }))

      // Redirect to Stripe hosted checkout
      if (url) {
        window.location.href = url
        return
      }

      // Fallback: use sessionId if no URL returned
      if (sessionId) {
        throw new Error('No se recibió URL de checkout. Verifica la configuración de Stripe.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al procesar el pago.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Step 1: Amount ──────────────────────────────────────────────────────────
  function renderStep1() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">¿Cuánto deseas donar?</h3>
          <p className="text-sm text-gray-500">Selecciona un monto en pesos mexicanos (MXN)</p>
        </div>

        {/* Preset amounts */}
        <div className="grid grid-cols-3 gap-3">
          {PRESET_AMOUNTS.map(amt => (
            <button
              key={amt}
              id={`amount-${amt}`}
              onClick={() => { setAmount(amt); setUseCustom(false) }}
              className={`py-3 rounded-xl font-semibold text-base border-2 transition-all
                ${!useCustom && amount === amt
                  ? 'border-orange-600 bg-orange-50 text-orange-700 scale-105 shadow'
                  : 'border-gray-200 text-gray-700 hover:border-orange-300'
                }`}
            >
              ${amt.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">O ingresa un monto personalizado</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
            <input
              id="custom-amount-input"
              type="number"
              min="10"
              placeholder="0.00"
              value={customAmount}
              onChange={e => { setCustomAmount(e.target.value); setUseCustom(true) }}
              onFocus={() => setUseCustom(true)}
              className={`w-full pl-8 pr-12 py-3 rounded-xl border-2 focus:outline-none transition-all
                ${useCustom ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">MXN</span>
          </div>
        </div>

        {/* What your donation buys */}
        <div className="bg-orange-50 rounded-xl p-4 text-sm text-orange-800">
          <span className="font-semibold">Con ${finalAmount.toLocaleString()} MXN</span> puedes alimentar{' '}
          {Math.max(1, Math.floor(finalAmount / 250))} bebé(s) por un mes. ¡Gracias!
        </div>

        <button
          id="step1-continue-btn"
          onClick={() => { if (finalAmount >= 10) setStep(2) }}
          disabled={finalAmount < 10}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all disabled:cursor-not-allowed"
        >
          Continuar →
        </button>
      </div>
    )
  }

  // ─── Step 2: Donor Info ──────────────────────────────────────────────────────
  function renderStep2() {
    const valid = donor.name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor.email)

    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Tus datos</h3>
          <p className="text-sm text-gray-500">Esta información aparecerá en tu recibo de donación.</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Nombre completo *</label>
          <input
            id="donor-name-input"
            type="text"
            placeholder="Tu nombre"
            value={donor.name}
            onChange={e => setDonor({ ...donor, name: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Correo electrónico *</label>
          <input
            id="donor-email-input"
            type="email"
            placeholder="tu@correo.com"
            value={donor.email}
            onChange={e => setDonor({ ...donor, email: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Fiscal receipt toggle */}
        <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 transition">
          <input
            id="fiscal-receipt-toggle"
            type="checkbox"
            checked={donor.wantsReceipt}
            onChange={e => setDonor({ ...donor, wantsReceipt: e.target.checked })}
            className="mt-0.5 accent-orange-600"
          />
          <span className="text-sm text-gray-700">
            <span className="font-medium">Quiero recibo fiscal (CFDI)</span>
            <span className="block text-gray-500 mt-0.5">Deducible de impuestos. Necesitas proporcionar tu RFC.</span>
          </span>
        </label>

        {donor.wantsReceipt && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">RFC *</label>
            <input
              id="donor-rfc-input"
              type="text"
              placeholder="XXXX000000XXX"
              value={donor.rfc}
              onChange={e => setDonor({ ...donor, rfc: e.target.value.toUpperCase() })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition uppercase"
              maxLength={13}
            />
          </div>
        )}

        <button
          id="step2-continue-btn"
          onClick={() => { if (valid) setStep(3) }}
          disabled={!valid}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all disabled:cursor-not-allowed"
        >
          Continuar al Pago →
        </button>
      </div>
    )
  }

  // ─── Step 3: Confirmation + Pay ─────────────────────────────────────────────
  function renderStep3() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Confirma tu donación</h3>
          <p className="text-sm text-gray-500">Revisa los detalles antes de continuar.</p>
        </div>

        {/* Summary card */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Monto de donación</span>
            <span className="font-bold text-orange-700 text-lg">${finalAmount.toLocaleString()} MXN</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Donador</span>
            <span className="font-medium text-gray-900">{donor.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Correo</span>
            <span className="font-medium text-gray-900 text-sm">{donor.email}</span>
          </div>
          {donor.wantsReceipt && donor.rfc && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">RFC</span>
              <span className="font-medium text-gray-900">{donor.rfc}</span>
            </div>
          )}
          <div className="border-t border-orange-200 pt-3 flex justify-between items-center">
            <span className="text-gray-600 text-sm font-medium">Recibo fiscal</span>
            <span className={`text-sm font-semibold ${donor.wantsReceipt ? 'text-green-600' : 'text-gray-400'}`}>
              {donor.wantsReceipt ? '✓ Sí' : 'No'}
            </span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>🔒 Pago seguro con SSL</span>
          <span>·</span>
          <span>💳 Procesado por Stripe</span>
          <span>·</span>
          <span>🛡️ Datos protegidos</span>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Pay button */}
        <button
          id="stripe-pay-btn"
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando…
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pagar con Stripe — ${finalAmount.toLocaleString()} MXN
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-400">
          Al continuar aceptas nuestros{' '}
          <a href="#" className="underline">términos y condiciones</a>. Tu donación es voluntaria y no reembolsable.
        </p>
      </div>
    )
  }

  // ─── Success view ────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">¡Gracias por tu donación!</h2>
          <p className="text-gray-500 mb-6">Recibirás una confirmación en <strong>{donor.email}</strong>. Tu apoyo transforma vidas. ❤️</p>
          <button onClick={onClose} className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700">
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  // ─── Main modal ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button id="modal-back-btn" onClick={() => setStep((step - 1) as Step)} className="p-1 text-gray-500 hover:text-gray-800">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="font-bold text-gray-900 text-base">
                {step === 1 && 'Hacer una donación'}
                {step === 2 && 'Tus datos'}
                {step === 3 && 'Confirmar y pagar'}
              </h2>
              <p className="text-xs text-gray-400">Paso {step} de 3</p>
            </div>
          </div>
          <button id="modal-close-btn" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  )
}
