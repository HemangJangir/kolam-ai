import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Community() {
  return (
    <section id="community" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 backdrop-blur rounded-xl shadow p-8 text-center space-y-4"
      >
        <h2 className="text-3xl heading-calligraphy text-maroon">Community</h2>
        <p className="text-gray-700 max-w-prose mx-auto">
          Host Kolam events, invite participants to upload their creations, and score entries to crown the top teams.
        </p>
        <div>
          <Link to="/organize-event" className="btn-gold font-semibold px-6 py-3 rounded-lg hover:scale-[1.02] transition-transform">
            Organize Event
          </Link>
        </div>
      </motion.div>
    </section>
  )
}


