import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'María González',
    role: 'Mamá beneficiada – Oaxaca',
    text: 'Gracias a Fundación Atikka, mi bebé pudo recibir la fórmula que necesitaba durante su primer año. Hoy tiene dos años y está sano y fuerte. Son personas increíbles.',
    stars: 5,
    avatar: 'MG',
    color: 'bg-orange-500',
  },
  {
    name: 'Carlos Mendoza',
    role: 'Donador desde 2022',
    text: 'Comencé a donar $250 mensuales y la transparencia de la fundación me convenció de duplicar mi aportación. Publican fotos y reportes reales. Confío plenamente en ellos.',
    stars: 5,
    avatar: 'CM',
    color: 'bg-blue-500',
  },
  {
    name: 'Ana Ramírez',
    role: 'Voluntaria y donadora',
    text: 'Ser voluntaria me permitió ver de cerca cómo cada donación se transforma en sonrisas. El equipo es apasionado, dedicado y totalmente transparente. Los recomiendo al 100%.',
    stars: 5,
    avatar: 'AR',
    color: 'bg-green-500',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-widest">Testimonios</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            Voces que nos inspiran
          </h2>
          <p className="text-gray-500 text-lg">Historias reales de quienes han sido parte de este cambio.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 ${t.color} rounded-full flex items-center justify-center text-white font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
