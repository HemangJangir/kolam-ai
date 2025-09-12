import { motion } from 'framer-motion'

const samples = Array.from({ length: 8 }).map((_, i) => ({ id: i }))

export function Gallery() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🌸</span>
        <h2 className="text-3xl font-heading text-maroon">Gallery Preview</h2>
      </div>
      <div className="bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop')] bg-center bg-cover rounded-xl p-4 sm:p-6 ring-1 ring-maroon/15 relative">
        <div className="pointer-events-none absolute -top-4 -left-4 text-6xl icon-accent select-none">🪷</div>
        <div className="pointer-events-none absolute -bottom-6 -right-6 text-6xl icon-accent select-none">🦚</div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {/* Masonry columns */}
          {samples.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="mb-4 break-inside-avoid rounded-lg overflow-hidden bg-white/85 backdrop-blur ring-1 ring-gold/30 hover:ring-gold shadow hover:shadow-lg transition hover:scale-[1.01]"
            >
              <div className="aspect-square grid place-items-center p-4">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <g stroke="#00897B" strokeWidth="1.1" fill="none" opacity="0.9">
                    {Array.from({ length: 10 }).map((_, i2) => (
                      <circle key={i2} cx="100" cy="100" r={10 + i2 * 8} />
                    ))}
                  </g>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
