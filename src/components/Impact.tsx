const items = [
  {
    emoji: '🍼',
    title: 'Fórmula Infantil',
    desc: 'Proporcionamos fórmula especializada para bebés de 0 a 12 meses que no pueden acceder a lactancia materna.',
    bg: 'from-orange-50 to-orange-100',
    border: 'border-orange-200',
  },
  {
    emoji: '🥣',
    title: 'Papillas Nutritivas',
    desc: 'Alimentos de transición para bebés de 6 a 24 meses, ricos en hierro, zinc y vitaminas esenciales.',
    bg: 'from-green-50 to-green-100',
    border: 'border-green-200',
  },
  {
    emoji: '📦',
    title: 'Despensas Familiares',
    desc: 'Paquetes mensuales de alimentos básicos para familias con bebés en situación de desnutrición.',
    bg: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
  },
  {
    emoji: '📚',
    title: 'Capacitación Materna',
    desc: 'Talleres de nutrición infantil, lactancia materna y desarrollo temprano para madres y cuidadores.',
    bg: 'from-purple-50 to-purple-100',
    border: 'border-purple-200',
  },
  {
    emoji: '🏥',
    title: 'Monitoreo de Salud',
    desc: 'Seguimiento periódico del desarrollo de los bebés beneficiados con apoyo de médicos voluntarios.',
    bg: 'from-red-50 to-red-100',
    border: 'border-red-200',
  },
  {
    emoji: '🌱',
    title: 'Huertos Comunitarios',
    desc: 'Impulsamos huertos en comunidades para que las familias produzcan sus propios alimentos frescos.',
    bg: 'from-amber-50 to-amber-100',
    border: 'border-amber-200',
  },
]

export default function Impact() {
  return (
    <section id="impacto" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-widest">Nuestro impacto</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            ¿Qué hacemos con tu donación?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Cada peso que donas se convierte en nutrición, salud y esperanza para bebés y familias vulnerables de México.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${item.bg} border ${item.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
