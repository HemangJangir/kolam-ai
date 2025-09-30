import { motion } from 'framer-motion'

export function AboutUs() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-white rounded-2xl p-8 sm:p-12 shadow-sm ring-1 ring-gold/20 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(255,215,0,0.06),transparent)]" />
      <div className="absolute -top-1 left-0 right-0 h-1 temple-border" />
      <div className="absolute -bottom-1 left-0 right-0 h-1 temple-border" />
      <h2 className="text-3xl sm:text-4xl heading-calligraphy text-maroon mb-4">About Us</h2>
      <p className="text-gray-700 leading-relaxed text-lg">
        Kolam is a living heritage—drawn at dawn, shared across generations, and woven from dots, lines, and devotion. Our website is a warm home for this tradition. We celebrate Kolam’s beauty and meaning, preserve techniques and stories, and make them easy to learn and share.
      </p>
      <p className="text-gray-700 leading-relaxed text-lg mt-4">
        Our intent is simple and heartfelt: celebrate classic and contemporary Kolams; preserve patterns, methods, and cultural context; share clear guides and resources for learners; and inspire creativity by blending tradition with thoughtful, modern presentation. Above all, we seek to connect a kind, global community where artists, learners, and admirers exchange ideas and encouragement.
      </p>
      <p className="text-gray-700 leading-relaxed text-lg mt-4">
        Whether you’re sketching your first dot grid or exploring complex symmetries, you’ll find guidance, inspiration, and belonging here. May each pattern invite patience, joy, and continuity—linking households, neighborhoods, and cultures through the timeless art of Kolam.
      </p>
      <div className="mt-6">
        <a href="/organize-event" className="inline-block btn-gold font-semibold px-6 py-3 rounded-lg hover:scale-[1.02] transition-transform">Organize an Event</a>
      </div>
    </motion.section>
  )
}


