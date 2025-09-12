import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiZap } from 'react-icons/fi'

export function Generator() {
  const [size, setSize] = useState('medium')
  const [complexity, setComplexity] = useState(5)
  const [style, setStyle] = useState('traditional')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    const target = document.getElementById('gallery')
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 rounded-2xl p-6 sm:p-8 shadow ring-1 ring-maroon/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <FiZap className="text-saffron" size={24} />
        <h2 className="text-3xl font-heading text-maroon">Kolam Generator</h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-saffron focus:ring-saffron"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
          <input
            type="range"
            min={1}
            max={10}
            value={complexity}
            onChange={(e) => setComplexity(parseInt(e.target.value))}
            className="w-full accent-saffron"
          />
          <div className="text-xs text-gray-600">Level: {complexity}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-saffron focus:ring-saffron"
          >
            <option value="traditional">Traditional</option>
            <option value="geometric">Geometric</option>
            <option value="floral">Floral</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron to-gold text-maroon font-semibold px-6 py-3 rounded-lg shadow-soft hover:scale-[1.01] transition-transform disabled:opacity-60"
        >
          <FiZap />
          {loading ? 'Generating…' : 'Generate Kolam'}
        </button>
        <span className="text-sm text-gray-600">Preserving Tradition Through AI</span>
      </div>
    </motion.section>
  )
}
