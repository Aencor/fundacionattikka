import { useEffect, useState } from 'react'
import { CheckCircle, Heart, Share2, Home } from 'lucide-react'

interface DonationData {
  amount: number
  donorName: string
  donorEmail: string
}

interface Props {
  onHome: () => void
}

export default function ThankYouPage({ onHome }: Props) {
  const [donation, setDonation] = useState<DonationData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Read donation data stored before Stripe redirect
    const raw = sessionStorage.getItem('atikka_donation')
    if (raw) {
      try {
        setDonation(JSON.parse(raw))
        sessionStorage.removeItem('atikka_donation') // clean up
      } catch { /* ignore */ }
    }
    // Trigger confetti animation
    setTimeout(() => setShowConfetti(true), 100)
  }, [])

  const babiesFed = donation ? Math.max(1, Math.floor(donation.amount / 250)) : 1

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Doné a Fundación Atikka',
        text: `Acabo de donar $${donation?.amount?.toLocaleString() ?? ''} MXN a Fundación Atikka para alimentar bebés en México. ¡Tú también puedes ayudar!`,
        url: window.location.origin,
      })
    } else {
      navigator.clipboard.writeText(window.location.origin)
      alert('¡Link copiado! Compártelo con tus amigos.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center px-4 relative overflow-hidden">

      {/* Confetti circles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-bounce"
              style={{
                width: `${Math.random() * 14 + 6}px`,
                height: `${Math.random() * 14 + 6}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#f97316', '#ea580c', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 6)],
                opacity: 0.6,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2 + 1.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-xl w-full">
        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Orange header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-400 px-8 py-10 text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center ring-4 ring-white/30">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold mb-1">¡Muchas gracias!</h1>
            {donation?.donorName && (
              <p className="text-white/90 text-lg">{donation.donorName}, eres increíble ❤️</p>
            )}
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-6">

            {/* Amount highlight */}
            {donation?.amount && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 text-center">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-widest mb-1">Tu donación</p>
                <p className="text-5xl font-extrabold text-orange-600 mb-1">
                  ${donation.amount.toLocaleString()}
                  <span className="text-2xl text-orange-400 ml-2">MXN</span>
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  fue procesada exitosamente
                </p>
              </div>
            )}

            {/* Impact message */}
            <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-2xl p-5">
              <span className="text-3xl">🍼</span>
              <div>
                <p className="font-semibold text-gray-900">
                  Tu donación alimenta a{' '}
                  <span className="text-green-600">{babiesFed} bebé{babiesFed > 1 ? 's' : ''}</span> por un mes
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Con tu apoyo, familias vulnerables de México pueden darle a sus hijos la nutrición que merecen.
                </p>
              </div>
            </div>

            {/* Email note */}
            {donation?.donorEmail && (
              <div className="flex items-start gap-3 text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
                <span className="text-xl">📧</span>
                <p>
                  Recibirás una confirmación de pago en{' '}
                  <span className="font-semibold text-gray-700">{donation.donorEmail}</span>
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Actions */}
            <div className="space-y-3">
              <button
                id="share-donation-btn"
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-3 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 font-semibold py-3 rounded-xl transition-all"
              >
                <Share2 className="w-5 h-5" />
                Compartir con mis amigos
              </button>

              <button
                id="back-home-btn"
                onClick={onHome}
                className="w-full flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all"
              >
                <Home className="w-5 h-5" />
                Volver al inicio
              </button>
            </div>
          </div>

          {/* Footer strip */}
          <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Heart className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span>Fundación Atikka · Organización sin fines de lucro · México</span>
          </div>
        </div>

        {/* Under card note */}
        <p className="text-center text-gray-400 text-sm mt-6">
          ¿Quieres donar de nuevo?{' '}
          <button onClick={onHome} className="text-orange-600 hover:underline font-medium">
            Regresar al sitio
          </button>
        </p>
      </div>
    </div>
  )
}
