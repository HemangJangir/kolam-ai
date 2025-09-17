import { motion } from 'framer-motion'
import { KolamCanvas } from './KolamCanvas'

export function PresetShowcase() {
  const presets = [
    {
      name: "11→1 Petal",
      preset: "11to1",
      complexity: 7,
      style: "traditional",
      description: "Traditional 11-dot petal pattern with nested loops and center connections"
    },
    {
      name: "8×8 Grid Kambi",
      preset: "8x8grid", 
      complexity: 5,
      style: "traditional",
      description: "Classic kambi pattern on 8×8 grid with flowing curves"
    },
    {
      name: "Radial Lotus 4-fold",
      preset: "radial-lotus",
      complexity: 9,
      style: "traditional", 
      description: "Radial lotus design with 4-fold symmetry and multiple rings"
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 rounded-2xl p-6 sm:p-8 shadow ring-1 ring-maroon/10 mt-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading text-maroon mb-4">Pinterest-Style Kolam Presets</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Showcasing traditional kolam patterns inspired by Pinterest designs, 
          featuring authentic dot-grid structures and symmetric motifs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {presets.map((preset, index) => (
          <motion.div
            key={preset.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gradient-to-br from-saffron/5 to-gold/5 rounded-xl p-4 border border-gold/20"
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-maroon mb-2">{preset.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
              <div className="text-xs text-gray-500">
                Complexity: {preset.complexity}/10 • Style: {preset.style}
              </div>
            </div>
            
            <div className="flex justify-center">
              <KolamCanvas
                size="small"
                complexity={preset.complexity}
                style={preset.style}
                preset={preset.preset}
                theme="light"
                showDots={true}
                onGenerate={0}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 mb-4">
          Curated, simple and beautiful Kolams inspired by Pinterest aesthetics.
        </p>
        <a href="#gallery" className="btn-gold inline-block font-semibold px-6 py-3 rounded-lg hover:scale-[1.02] transition-transform">
          See All
        </a>
      </div>
    </motion.section>
  )
}
