import { Leaf, Shield, Users } from 'lucide-react'

const pillars = [
  {
    icon: Leaf,
    title: 'Nutrición de calidad',
    text: 'Proporcionamos alimentos certificados y nutricionalmente completos para el desarrollo sano de los bebés en sus primeros años de vida.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Shield,
    title: 'Transparencia total',
    text: 'El 98% de cada donación se destina directamente al programa. Publicamos informes trimestrales y rendición de cuentas certificada.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Users,
    title: 'Comunidades fortalecidas',
    text: 'Trabajamos con madres y familias vulnerables, proporcionando capacitación nutricional además de los alimentos.',
    color: 'bg-blue-100 text-blue-600',
  },
]

export default function Mission() {
  return (
    <section id="mision" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-widest">Nuestra misión</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            Alimentando el futuro de México
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Fundación Atikka nació con una convicción simple: todo bebé merece los nutrientes necesarios para crecer sano, sin importar la situación económica de su familia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <div key={i} className="group p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${p.color} mb-5`}>
                <p.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{p.title}</h3>
              <p className="text-gray-500 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
