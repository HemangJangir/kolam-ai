import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiZap } from 'react-icons/fi'
import { KolamCanvas } from './KolamCanvas'

export function Generator() {
  const [size, setSize] = useState('medium')
  const [complexity, setComplexity] = useState(5)
  const [style, setStyle] = useState('traditional')
  const [preset, setPreset] = useState('11to1')
  const [theme, setTheme] = useState('light')
  const [showDots, setShowDots] = useState(true)
  const [loading, setLoading] = useState(false)
  const [generateTrigger, setGenerateTrigger] = useState(0)

  const handleGenerate = async () => {
    setLoading(true)
    setGenerateTrigger(prev => prev + 1) // Trigger kolam regeneration
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <option value="modern">Modern</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preset</label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-saffron focus:ring-saffron"
          >
            <option value="11to1">11→1 Petal</option>
            <option value="13to7">13→7 Melikala</option>
            <option value="8x8grid">8×8 Grid Kambi</option>
            <option value="radial-lotus">Radial Lotus 4-fold</option>
            <option value="5x5grid">5×5 Square Grid</option>
            <option value="7x7grid">7×7 Default Grid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-saffron focus:ring-saffron"
          >
            <option value="light">Light (Dark on Light)</option>
            <option value="dark">Dark (Light on Dark)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dots</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDots}
              onChange={(e) => setShowDots(e.target.checked)}
              className="accent-saffron"
            />
            <span className="text-sm text-gray-600">Show dots</span>
          </div>
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

      {/* Kolam Canvas */}
      <div className="mt-8">
        <div className="text-center mb-4">
          <h3 className="text-xl font-heading text-maroon mb-2">Your Kolam</h3>
          <p className="text-sm text-gray-600">
            {style === 'traditional' ? 'Traditional Pulli Kolam' : 'Modern Abstract Design'} • 
            {preset.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} • 
            Size: {size.charAt(0).toUpperCase() + size.slice(1)} • 
            Complexity: {complexity}/10
          </p>
        </div>
        <KolamCanvas 
          size={size}
          complexity={complexity}
          style={style}
          preset={preset}
          theme={theme}
          showDots={showDots}
          onGenerate={generateTrigger}
        />
      </div>
    </motion.section>
  )
}
