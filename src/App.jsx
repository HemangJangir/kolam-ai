import './index.css'
import { Navbar } from './components/Navbar.jsx'
import { Hero } from './components/Hero.jsx'
import { About } from './components/About.jsx'
import { Footer } from './components/Footer.jsx'
import Community from './components/Community.jsx'
import { AboutUs } from './components/AboutUs.jsx'

function App() {
  return (
    <div className="bg-kolam bg-fixed relative">
      {/* Page-wide rangoli border frame */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-1 temple-border" />
        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 temple-border" />
        {/* Left border */}
        <div className="absolute top-0 bottom-0 left-0 w-1 rangoli-border opacity-60" />
        {/* Right border */}
        <div className="absolute top-0 bottom-0 right-0 w-1 rangoli-border opacity-60" />
        
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-gold rounded-full opacity-40" />
        <div className="absolute top-4 right-4 w-3 h-3 bg-gold rounded-full opacity-40" />
        <div className="absolute bottom-4 left-4 w-3 h-3 bg-gold rounded-full opacity-40" />
        <div className="absolute bottom-4 right-4 w-3 h-3 bg-gold rounded-full opacity-40" />
      </div>
      
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section id="home">
          <Hero />
        </section>
        <section id="about" className="py-24">
          <About />
        </section>
        <section id="about-us" className="py-16">
          <AboutUs />
        </section>
        <section id="community" className="py-16">
          <Community />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
