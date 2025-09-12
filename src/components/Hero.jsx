import { motion } from 'framer-motion'

function KolamSVG() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#g)" />
      <g stroke="#800000" strokeWidth="1.2" fill="none" strokeLinecap="round">
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={i}
            d={`M100 20 Q ${100 + 60 * Math.cos((i * Math.PI) / 8)} ${100 + 60 * Math.sin((i * Math.PI) / 8)}, 100 180`}
            opacity="0.4"
          />
        ))}
      </g>
    </svg>
  )
}

export function Hero() {
  return (
    <section className="relative pt-20 pb-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-gold/10 to-white" />

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h1 className="text-5xl sm:text-6xl heading-calligraphy text-maroon leading-[1.1]">
            Preserving Tradition Through AI
          </h1>
          <p className="text-lg text-gray-700 max-w-prose">
            Experience the timeless beauty of Kolams with an intelligent generator that respects culture and celebrates creativity.
          </p>
          <div className="flex gap-4">
            <a
              href="#generator"
              className="btn-gold font-semibold px-6 py-3 rounded-lg hover:scale-[1.02] transition-transform"
            >
              Generate Kolam
            </a>
            <a href="#gallery" className="text-teal hover:text-maroon transition-colors font-medium">
              View Gallery →
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="aspect-square relative"
        >
          <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,153,51,0.25),transparent)]" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
            className="rounded-full p-6 bg-white/70 backdrop-blur shadow"
          >
            <KolamSVG />
          </motion.div>
          <div className="absolute -inset-6 -z-10 bg-white/40 blur-2xl rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}
