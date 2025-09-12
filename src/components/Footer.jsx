export function Footer() {
  return (
    <footer id="contact" className="mt-20 bg-maroon text-gold">
      <div className="temple-border w-full"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="heading-calligraphy text-2xl">Kolam AI</p>
          <p className="text-sm opacity-90">© {new Date().getFullYear()} Kolam AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
