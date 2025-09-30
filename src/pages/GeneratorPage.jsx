import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'
import { Generator } from '../components/Generator.jsx'

export default function GeneratorPage() {
  return (
    <div className="bg-kolam bg-fixed relative">
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute top-0 left-0 right-0 h-1 temple-border" />
        <div className="absolute bottom-0 left-0 right-0 h-1 temple-border" />
        <div className="absolute top-0 bottom-0 left-0 w-1 rangoli-border opacity-60" />
        <div className="absolute top-0 bottom-0 right-0 w-1 rangoli-border opacity-60" />
        <div className="absolute top-4 left-4 w-3 h-3 bg-gold rounded-full opacity-40" />
        <div className="absolute top-4 right-4 w-3 h-3 bg-gold rounded-full opacity-40" />
        <div className="absolute bottom-4 left-4 w-3 h-3 bg-gold rounded-full opacity-40" />
        <div className="absolute bottom-4 right-4 w-3 h-3 bg-gold rounded-full opacity-40" />
      </div>

      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Generator />
      </main>
      <Footer />
    </div>
  )
}


