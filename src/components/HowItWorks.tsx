const steps = [
  {
    num: '01',
    title: 'Elige tu monto',
    desc: 'Selecciona cuánto deseas donar. Puedes elegir entre montos preestablecidos o ingresar el que prefieras.',
    color: 'bg-orange-600',
  },
  {
    num: '02',
    title: 'Tus datos',
    desc: 'Ingresa tu nombre y correo electrónico. Si deseas comprobante fiscal, también puedes proporcionar tu RFC.',
    color: 'bg-orange-500',
  },
  {
    num: '03',
    title: 'Pago seguro',
    desc: 'Confirma tu donación y paga de forma segura con tarjeta a través de Stripe. Tu información está 100% protegida.',
    color: 'bg-orange-400',
  },
  {
    num: '04',
    title: 'Impacto real',
    desc: 'Recibirás un recibo por correo y actualizaciones periódicas sobre el impacto de tu donación.',
    color: 'bg-amber-400',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-widest">Proceso</span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            Donar es muy fácil
          </h2>
          <p className="text-gray-500 text-lg">En menos de 2 minutos puedes impactar la vida de un bebé.</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-400 mx-20 z-0" />

          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.color} text-white font-extrabold text-xl mb-4 shadow-lg`}>
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
