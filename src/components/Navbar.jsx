import { useEffect, useState } from 'react'

const links = [
  { href: '#home', label: 'Home' },
  { href: '/generate', label: 'Generator' },
  { href: '#showcase', label: 'Presets' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#community', label: 'Community' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSmooth = (e) => {
    const href = e.currentTarget.getAttribute('href') || ''
    if (!href.startsWith('#')) return
    const targetId = href.replace('#', '')
    if (!targetId) return
    e.preventDefault()
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'backdrop-blur bg-white/80 shadow' : 'bg-transparent'}`}>
      <div className="ornament-divider w-full"></div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <a href="#home" className="text-2xl sm:text-3xl heading-calligraphy text-maroon">Kolam AI</a>
        <ul className="hidden md:flex gap-6 text-gray-800">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={handleSmooth}
                className="hover:text-saffron transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/generate"
          className="md:inline-block hidden btn-gold font-medium px-4 py-2 rounded hover:scale-[1.02] transition-transform"
        >
          Generate Kolam
        </a>
      </nav>
    </header>
  )
}
