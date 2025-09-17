import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'

export function KolamCanvas({ size, complexity, style, preset, theme = 'light', showDots = true, onGenerate }) {
  const svgRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 })
  const [currentPaths, setCurrentPaths] = useState([])

  // Calculate canvas dimensions based on size
  const getCanvasSize = () => {
    switch (size) {
      case 'small': return { width: 300, height: 300 }
      case 'medium': return { width: 400, height: 400 }
      case 'large': return { width: 500, height: 500 }
      default: return { width: 400, height: 400 }
    }
  }

  // Generate dot layout based on preset and size
  const generateDotLayout = (preset, canvasSize) => {
    const { width, height } = canvasSize
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) * 0.35
    const dots = []

    switch (preset) {
      case '11to1':
        // 11→1 melikala pattern (11 dots in outer ring, 1 in center)
        for (let i = 0; i < 11; i++) {
          const angle = (i * 2 * Math.PI) / 11
          const x = centerX + maxRadius * Math.cos(angle)
          const y = centerY + maxRadius * Math.sin(angle)
          dots.push({ x, y, radius: 2, ring: 0 })
        }
        dots.push({ x: centerX, y: centerY, radius: 3, ring: 1 })
        break

      case '13to7':
        // 13→7 pattern (13 outer, 7 inner, 1 center)
        for (let i = 0; i < 13; i++) {
          const angle = (i * 2 * Math.PI) / 13
          const x = centerX + maxRadius * Math.cos(angle)
          const y = centerY + maxRadius * Math.sin(angle)
          dots.push({ x, y, radius: 2, ring: 0 })
        }
        for (let i = 0; i < 7; i++) {
          const angle = (i * 2 * Math.PI) / 7
          const x = centerX + (maxRadius * 0.6) * Math.cos(angle)
          const y = centerY + (maxRadius * 0.6) * Math.sin(angle)
          dots.push({ x, y, radius: 1.5, ring: 1 })
        }
        dots.push({ x: centerX, y: centerY, radius: 3, ring: 2 })
        break

      case '8x8grid':
        // 8x8 rectangular grid
        const gridSize = 8
        const spacing = (maxRadius * 1.4) / (gridSize - 1)
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            const x = centerX - (gridSize - 1) * spacing / 2 + i * spacing
            const y = centerY - (gridSize - 1) * spacing / 2 + j * spacing
            dots.push({ x, y, radius: 1.5, ring: Math.floor(Math.sqrt(i*i + j*j)) })
          }
        }
        break

      case 'radial-lotus':
        // Radial lotus pattern with 4-fold symmetry
        const petals = 8
        for (let ring = 0; ring < 4; ring++) {
          const ringRadius = (maxRadius * (ring + 1)) / 4
          const dotsInRing = petals * (ring + 1)
          for (let i = 0; i < dotsInRing; i++) {
            const angle = (i * 2 * Math.PI) / dotsInRing
            const x = centerX + ringRadius * Math.cos(angle)
            const y = centerY + ringRadius * Math.sin(angle)
            dots.push({ x, y, radius: 2 - ring * 0.3, ring })
          }
        }
        dots.push({ x: centerX, y: centerY, radius: 4, ring: 4 })
        break

      case '5x5grid':
        // 5x5 square grid
        const grid5Size = 5
        const spacing5 = (maxRadius * 1.2) / (grid5Size - 1)
        for (let i = 0; i < grid5Size; i++) {
          for (let j = 0; j < grid5Size; j++) {
            const x = centerX - (grid5Size - 1) * spacing5 / 2 + i * spacing5
            const y = centerY - (grid5Size - 1) * spacing5 / 2 + j * spacing5
            dots.push({ x, y, radius: 2, ring: Math.floor(Math.sqrt(i*i + j*j)) })
          }
        }
        break

      default:
        // Default 7x7 grid
        const defaultSize = 7
        const defaultSpacing = (maxRadius * 1.3) / (defaultSize - 1)
        for (let i = 0; i < defaultSize; i++) {
          for (let j = 0; j < defaultSize; j++) {
            const x = centerX - (defaultSize - 1) * defaultSpacing / 2 + i * defaultSpacing
            const y = centerY - (defaultSize - 1) * defaultSpacing / 2 + j * defaultSpacing
            dots.push({ x, y, radius: 1.8, ring: Math.floor(Math.sqrt(i*i + j*j)) })
          }
        }
    }

    return dots
  }

  // Symmetry transformation functions
  const symmetryTransform = (path, type, folds, centerX, centerY) => {
    const transformedPaths = [path]
    
    if (type === 'rotational') {
      for (let i = 1; i < folds; i++) {
        const angle = (i * 2 * Math.PI) / folds
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        
        const transformedPath = {
          ...path,
          d: path.d.replace(/([MLCQ])\s+([\d.-]+)\s+([\d.-]+)/g, (match, cmd, x, y) => {
            const relX = parseFloat(x) - centerX
            const relY = parseFloat(y) - centerY
            const newX = relX * cos - relY * sin + centerX
            const newY = relX * sin + relY * cos + centerY
            return `${cmd} ${newX.toFixed(2)} ${newY.toFixed(2)}`
          })
        }
        transformedPaths.push(transformedPath)
      }
    } else if (type === 'reflection') {
      // Add reflection across X and Y axes
      const reflectX = { ...path, d: path.d.replace(/([MLCQ])\s+([\d.-]+)\s+([\d.-]+)/g, (match, cmd, x, y) => {
        const newX = 2 * centerX - parseFloat(x)
        return `${cmd} ${newX.toFixed(2)} ${y}`
      })}
      const reflectY = { ...path, d: path.d.replace(/([MLCQ])\s+([\d.-]+)\s+([\d.-]+)/g, (match, cmd, x, y) => {
        const newY = 2 * centerY - parseFloat(y)
        return `${cmd} ${x} ${newY.toFixed(2)}`
      })}
      transformedPaths.push(reflectX, reflectY)
    }
    
    return transformedPaths
  }

  // Connect dots with traditional patterns
  const connectDotsTraditional = (dots, complexity, centerX, centerY) => {
    const paths = []
    const numDots = dots.length

    if (preset === '11to1') {
      // 11→1 petal pattern
      const outerDots = dots.filter(d => d.ring === 0)
      const centerDot = dots.find(d => d.ring === 1)
      
      if (complexity <= 3) {
        // Simple petal connections
        for (let i = 0; i < outerDots.length; i++) {
          const dot1 = outerDots[i]
          const dot2 = outerDots[(i + 1) % outerDots.length]
          const controlX = centerX + (dot1.x + dot2.x - 2 * centerX) * 0.3
          const controlY = centerY + (dot1.y + dot2.y - 2 * centerY) * 0.3
          
          paths.push({
            d: `M ${dot1.x} ${dot1.y} Q ${controlX} ${controlY} ${dot2.x} ${dot2.y}`,
            strokeWidth: 2 + complexity * 0.3,
            type: 'petal'
          })
        }
      } else if (complexity <= 7) {
        // Multiple nested loops
        for (let i = 0; i < outerDots.length; i++) {
          const dot1 = outerDots[i]
          const dot2 = outerDots[(i + 2) % outerDots.length]
          const controlX = centerX + (dot1.x + dot2.x - 2 * centerX) * 0.5
          const controlY = centerY + (dot1.y + dot2.y - 2 * centerY) * 0.5
          
          paths.push({
            d: `M ${dot1.x} ${dot1.y} Q ${controlX} ${controlY} ${dot2.x} ${dot2.y}`,
            strokeWidth: 2 + complexity * 0.2,
            type: 'nested'
          })
        }
        
        // Center connections
        for (let i = 0; i < outerDots.length; i += 2) {
          const dot = outerDots[i]
          const controlX = centerX + (dot.x - centerX) * 0.7
          const controlY = centerY + (dot.y - centerY) * 0.7
          
          paths.push({
            d: `M ${dot.x} ${dot.y} Q ${controlX} ${controlY} ${centerDot.x} ${centerDot.y}`,
            strokeWidth: 1.5,
            type: 'center'
          })
        }
      } else {
        // Dense recursive patterns
        for (let i = 0; i < outerDots.length; i++) {
          const dot1 = outerDots[i]
          const dot2 = outerDots[(i + 3) % outerDots.length]
          const dot3 = outerDots[(i + 6) % outerDots.length]
          
          const control1X = centerX + (dot1.x - centerX) * 0.6
          const control1Y = centerY + (dot1.y - centerY) * 0.6
          const control2X = centerX + (dot2.x - centerX) * 0.4
          const control2Y = centerY + (dot2.y - centerY) * 0.4
          
          paths.push({
            d: `M ${dot1.x} ${dot1.y} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${dot2.x} ${dot2.y}`,
            strokeWidth: 1.5,
            type: 'complex'
          })
        }
      }
    } else if (preset === '8x8grid') {
      // Grid-based kambi patterns
      const gridDots = dots.sort((a, b) => a.ring - b.ring)
      
      if (complexity <= 3) {
        // Simple grid connections
        for (let i = 0; i < gridDots.length - 1; i++) {
          const dot1 = gridDots[i]
          const dot2 = gridDots[i + 1]
          paths.push({
            d: `M ${dot1.x} ${dot1.y} L ${dot2.x} ${dot2.y}`,
            strokeWidth: 2,
            type: 'grid'
          })
        }
      } else {
        // Complex kambi patterns
        for (let i = 0; i < gridDots.length; i += 2) {
          const dot1 = gridDots[i]
          const dot2 = gridDots[(i + 3) % gridDots.length]
          const controlX = (dot1.x + dot2.x) / 2 + (Math.random() - 0.5) * 20
          const controlY = (dot1.y + dot2.y) / 2 + (Math.random() - 0.5) * 20
          
          paths.push({
            d: `M ${dot1.x} ${dot1.y} Q ${controlX} ${controlY} ${dot2.x} ${dot2.y}`,
            strokeWidth: 1.5 + complexity * 0.1,
            type: 'kambi'
          })
        }
      }
    } else if (preset === 'radial-lotus') {
      // Radial lotus with 4-fold symmetry
      const rings = {}
      dots.forEach(dot => {
        if (!rings[dot.ring]) rings[dot.ring] = []
        rings[dot.ring].push(dot)
      })
      
      // Connect rings
      for (let ring = 0; ring < Object.keys(rings).length - 1; ring++) {
        const currentRing = rings[ring]
        const nextRing = rings[ring + 1]
        
        if (currentRing && nextRing) {
          for (let i = 0; i < currentRing.length; i++) {
            const dot1 = currentRing[i]
            const dot2 = nextRing[i % nextRing.length]
            const controlX = centerX + (dot1.x + dot2.x - 2 * centerX) * 0.3
            const controlY = centerY + (dot1.y + dot2.y - 2 * centerY) * 0.3
            
            paths.push({
              d: `M ${dot1.x} ${dot1.y} Q ${controlX} ${controlY} ${dot2.x} ${dot2.y}`,
              strokeWidth: 2 - ring * 0.2,
              type: 'radial'
            })
          }
        }
      }
    }

    return paths
  }

  // Connect dots with modern patterns
  const connectDotsModern = (dots, complexity, centerX, centerY) => {
    const paths = []
    
    // Create flowing curves with controlled randomness
    for (let i = 0; i < dots.length; i++) {
      const dot1 = dots[i]
      const dot2 = dots[(i + Math.floor(complexity / 2) + 1) % dots.length]
      
      // Multiple control points for smooth curves
      const control1X = dot1.x + (Math.random() - 0.5) * 30 * (complexity / 10)
      const control1Y = dot1.y + (Math.random() - 0.5) * 30 * (complexity / 10)
      const control2X = dot2.x + (Math.random() - 0.5) * 30 * (complexity / 10)
      const control2Y = dot2.y + (Math.random() - 0.5) * 30 * (complexity / 10)
      
      paths.push({
        d: `M ${dot1.x} ${dot1.y} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${dot2.x} ${dot2.y}`,
        strokeWidth: 1 + complexity * 0.2,
        type: 'modern',
        opacity: 0.6 + Math.random() * 0.4
      })
    }

    // Add spiral patterns for higher complexity
    if (complexity >= 6) {
      for (let i = 0; i < complexity; i++) {
        const startAngle = Math.random() * 2 * Math.PI
        const endAngle = startAngle + Math.PI * (1 + Math.random())
        const radius = 20 + i * 15
        
        let spiralPath = `M ${centerX + radius * Math.cos(startAngle)} ${centerY + radius * Math.sin(startAngle)}`
        for (let angle = startAngle; angle <= endAngle; angle += 0.1) {
          const currentRadius = radius + (angle - startAngle) * 5
          const x = centerX + currentRadius * Math.cos(angle)
          const y = centerY + currentRadius * Math.sin(angle)
          spiralPath += ` L ${x} ${y}`
        }
        
        paths.push({
          d: spiralPath,
          strokeWidth: 1 + complexity * 0.1,
          type: 'spiral',
          opacity: 0.4 + Math.random() * 0.3
        })
      }
    }

    return paths
  }

  // Generate kolam based on style and preset
  const generateKolam = () => {
    const canvasSize = getCanvasSize()
    setDimensions(canvasSize)
    
    const dots = generateDotLayout(preset, canvasSize)
    const { width, height } = canvasSize
    const centerX = width / 2
    const centerY = height / 2
    
    let paths = []
    
    if (style === 'traditional') {
      paths = connectDotsTraditional(dots, complexity, centerX, centerY)
    } else {
      paths = connectDotsModern(dots, complexity, centerX, centerY)
    }

    // Apply symmetry transformations
    const symmetryFolds = complexity >= 7 ? 8 : complexity >= 4 ? 4 : 2
    const transformedPaths = []
    
    paths.forEach(path => {
      const symmetricPaths = symmetryTransform(path, 'rotational', symmetryFolds, centerX, centerY)
      transformedPaths.push(...symmetricPaths)
    })

    setCurrentPaths(transformedPaths)
    return { dots, paths: transformedPaths }
  }

  // Clear and redraw kolam
  const redrawKolam = () => {
    const kolam = generateKolam()
    const svg = svgRef.current
    if (!svg) return

    // Clear previous content
    svg.innerHTML = ''

    // Create defs for gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    
    // Create gradient based on theme
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
    gradient.setAttribute('id', 'kolamGradient')
    gradient.setAttribute('x1', '0%')
    gradient.setAttribute('y1', '0%')
    gradient.setAttribute('x2', '100%')
    gradient.setAttribute('y2', '100%')
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('stop-color', theme === 'dark' ? '#FFD700' : '#800000')
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('stop-color', theme === 'dark' ? '#FF9933' : '#FFD700')
    
    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    defs.appendChild(gradient)
    svg.appendChild(defs)

    // Draw paths
    kolam.paths.forEach((pathData, index) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathData.d)
      path.setAttribute('stroke', theme === 'dark' ? '#FFD700' : 'url(#kolamGradient)')
      path.setAttribute('stroke-width', pathData.strokeWidth)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-linecap', 'round')
      path.setAttribute('stroke-linejoin', 'round')
      path.setAttribute('opacity', pathData.opacity || 0.8)
      
      // Add animation delay
      path.style.animationDelay = `${index * 0.05}s`
      path.style.animation = 'drawPath 2s ease-in-out forwards'
      
      svg.appendChild(path)
    })

    // Draw dots if enabled
    if (showDots) {
      kolam.dots.forEach((dot, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', dot.x)
        circle.setAttribute('cy', dot.y)
        circle.setAttribute('r', dot.radius)
        circle.setAttribute('fill', theme === 'dark' ? '#FFD700' : '#800000')
        circle.setAttribute('opacity', '0.7')
        
        // Add animation delay
        circle.style.animationDelay = `${index * 0.02}s`
        circle.style.animation = 'fadeIn 1s ease-in-out forwards'
        
        svg.appendChild(circle)
      })
    }

    // Add CSS animations
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style')
    style.textContent = `
      @keyframes drawPath {
        from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
        to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0); }
        to { opacity: 0.7; transform: scale(1); }
      }
    `
    svg.appendChild(style)
  }

  // Download SVG
  const downloadSVG = () => {
    const svg = svgRef.current
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)
    
    const downloadLink = document.createElement('a')
    downloadLink.href = svgUrl
    downloadLink.download = `kolam-${preset}-${complexity}-${style}.svg`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(svgUrl)
  }

  // Redraw when props change
  useEffect(() => {
    redrawKolam()
  }, [size, complexity, style, preset, theme, showDots])

  // Redraw when generate button is clicked
  useEffect(() => {
    if (onGenerate) {
      redrawKolam()
    }
  }, [onGenerate])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-6"
    >
      <div className={`kolam-container bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-xl shadow-lg p-4 border-2 border-gold/20`}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="kolam-svg"
        >
          {/* Background circle for visual appeal */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={Math.min(dimensions.width, dimensions.height) * 0.45}
            fill="none"
            stroke={theme === 'dark' ? '#FFD700' : '#800000'}
            strokeWidth="1"
            opacity="0.2"
          />
        </svg>
      </div>
      
      {/* Download button */}
      <button
        onClick={downloadSVG}
        className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-saffron to-gold text-maroon font-semibold px-4 py-2 rounded-lg shadow-soft hover:scale-[1.01] transition-transform"
      >
        <FiDownload />
        Download SVG
      </button>
    </motion.div>
  )
}