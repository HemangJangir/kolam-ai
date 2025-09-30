import { motion } from 'framer-motion'

export function About() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative bg-white rounded-2xl p-8 sm:p-14 shadow-sm ring-1 ring-gold/20 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(255,215,0,0.06),transparent)]" />
      <div className="absolute -top-1 left-0 right-0 h-1 temple-border" />
      <div className="absolute -bottom-1 left-0 right-0 h-1 temple-border" />
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🪔</span>
        <h2 className="text-4xl heading-calligraphy text-maroon">About Kolams</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
          <p>
            Kolams (also called Rangoli) are living art traditions drawn each dawn on thresholds across South India. Dots and lines flow into patterns that invite auspiciousness, cultivate patience, and celebrate community.
          </p>
          <p>
            Every motif carries meaning: lotus for purity, conch for cosmic sound, parrots for companionship, and knots that symbolize continuity. As hands repeat curves daily, memory becomes geometry and devotion becomes design.
          </p>
          <p>
            Oral stories tell of elders teaching children to “breathe with the line,” tracing rice flour so birds may feast. During Pongal, streets bloom with kolams that honor the harvest, the sun, and the rhythm of seasons.
          </p>
          <p>
            Our AI respects these roots—learning from symmetry, rotation, and rhythm—while offering a canvas to explore new variations that remain culturally grounded.
          </p>
          <div className="pt-2">
            <a href="#about-us" className="inline-block btn-gold font-semibold px-5 py-2 rounded-lg hover:scale-[1.02] transition-transform">Learn About Us</a>
          </div>
        </div>
        <div className="bg-[radial-gradient(closest-side,rgba(255,153,51,0.08),transparent)] rounded-xl p-6 ring-1 ring-gold/10">
          <ul className="space-y-3 text-gray-800">
            <li>• Daily practice fosters mindfulness and skill.</li>
            <li>• Rice flour kolams feed small creatures—art as offering.</li>
            <li>• Symmetry reflects cosmic order and balance.</li>
            <li>• Festival kolams tell seasonal stories and blessings.</li>
            <li>• Community sharing keeps the tradition alive.</li>
          </ul>
        </div>
      </div>
    </motion.section>
  )
}
