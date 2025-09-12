import { motion } from 'framer-motion'

export function About() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm ring-1 ring-gold/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🪔</span>
        <h2 className="text-3xl font-heading text-maroon">About Kolams</h2>
      </div>
      <p className="text-gray-700 leading-relaxed">
        Kolams (rangoli) are intricate patterns drawn at thresholds to welcome prosperity and positive energy. Passed down through generations, each motif carries stories of symmetry, rhythm, and devotion.
      </p>
      <p className="text-gray-700 leading-relaxed mt-4">
        Our AI-based generator honors this heritage by learning from traditional designs while enabling new expressions. Create patterns that are culturally grounded, elegant, and uniquely yours.
      </p>
    </motion.section>
  )
}
