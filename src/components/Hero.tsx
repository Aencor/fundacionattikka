import { Heart, ArrowDown } from 'lucide-react'

interface Props {
  onDonate: () => void
}

export default function Hero({ onDonate }: Props) {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating blobs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8 text-sm font-medium">
          <Heart className="w-4 h-4 fill-white" />
          <span>Organización sin fines de lucro • México</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          Cada bebé merece<br />
          <span className="text-amber-200">crecer con amor</span>
        </h1>

        <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
          Tu donación proporciona alimentos nutritivos a bebés en situación de vulnerabilidad.
          Juntos construimos un México donde ningún niño pase hambre.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            id="hero-donate-btn"
            onClick={onDonate}
            className="bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-full hover:bg-orange-50 transition-all hover:scale-105 shadow-2xl"
          >
            ❤️ Donar Ahora
          </button>
          <a
            href="#mision"
            className="border-2 border-white/70 text-white font-semibold text-lg px-10 py-4 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            Conocer más
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-white/70" />
        </div>
      </div>
    </section>
  )
}
