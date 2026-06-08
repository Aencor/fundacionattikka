import { useState, useEffect } from 'react'
import { Menu, X, Heart } from 'lucide-react'

interface Props {
  onDonate: () => void
}

export default function Navbar({ onDonate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Misión', href: '#mision' },
    { label: 'Impacto', href: '#impacto' },
    { label: 'Cómo Funciona', href: '#como-funciona' },
    { label: 'Testimonios', href: '#testimonios' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className={`text-xl font-bold transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Fundación <span className="text-orange-500">Atikka</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${scrolled ? 'text-gray-700' : 'text-white/90'}`}
              >
                {l.label}
              </a>
            ))}
            <button
              id="nav-donate-btn"
              onClick={onDonate}
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105 shadow"
            >
              Donar Ahora
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 space-y-2">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="block px-4 py-2 text-gray-700 hover:text-orange-500 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="px-4 pt-2">
              <button
                onClick={() => { onDonate(); setMenuOpen(false) }}
                className="w-full bg-orange-600 text-white font-semibold py-3 rounded-full hover:bg-orange-700 transition"
              >
                Donar Ahora
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
