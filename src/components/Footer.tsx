import { Heart, Mail, Phone, MapPin } from 'lucide-react'

interface Props {
  onDonate: () => void
}

export default function Footer({ onDonate }: Props) {
  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-4">¿Listo para hacer la diferencia?</h2>
          <p className="text-white/90 text-lg mb-8">
            Una donación, sin importar el monto, puede cambiar la vida de un bebé.
          </p>
          <button
            id="footer-donate-btn"
            onClick={onDonate}
            className="bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-full hover:bg-orange-50 transition-all hover:scale-105 shadow-2xl"
          >
            ❤️ Donar Ahora
          </button>
        </div>
      </div>

      {/* Footer content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">Fundación <span className="text-orange-400">Atikka</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Organización sin fines de lucro comprometida con el bienestar nutricional de los bebés más vulnerables de México.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['#inicio', '#mision', '#impacto', '#como-funciona', '#testimonios'].map((href, i) => (
                <li key={i}>
                  <a href={href} className="hover:text-orange-400 transition-colors capitalize">
                    {href.replace('#', '').replace('-', ' ')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>contacto@fundacionatika.com.mx</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>+52 (55) 1234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>Ciudad de México, México</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Fundación Atikka. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Transparencia</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
