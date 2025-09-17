import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'

export function KolamCanvas({ size, complexity, style, preset, theme = 'light', showDots = true, paletteType = 'traditional', customColors = ['#ffffff', '#ff0000', '#ffff00', '#0000ff'], animationEnabled = false, suggestion = '', onGenerate }) {
  const svgRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 })
  const [currentPaths, setCurrentPaths] = useState([])
  const [isRecording, setIsRecording] = useState(false)

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
        // Minimal nested petals, skip every other to reduce density
        for (let i = 0; i < outerDots.length; i += 2) {
          const dot1 = outerDots[i]
          const dot2 = outerDots[(i + 2) % outerDots.length]
          const controlX = centerX + (dot1.x + dot2.x - 2 * centerX) * 0.35
          const controlY = centerY + (dot1.y + dot2.y - 2 * centerY) * 0.35
          paths.push({
            d: `M ${dot1.x} ${dot1.y} Q ${controlX} ${controlY} ${dot2.x} ${dot2.y}`,
            strokeWidth: 1.6,
            type: 'nested-min'
          })
        }
      } else {
        // Keep high complexity still simple: medium petals only
        for (let i = 0; i < outerDots.length; i += 1) {
          const dot1 = outerDots[i]
          const dot2 = outerDots[(i + 3) % outerDots.length]
          const controlX = centerX + (dot1.x + dot2.x - 2 * centerX) * 0.4
          const controlY = centerY + (dot1.y + dot2.y - 2 * centerY) * 0.4
          paths.push({
            d: `M ${dot1.x} ${dot1.y} Q ${controlX} ${controlY} ${dot2.x} ${dot2.y}`,
            strokeWidth: 1.4,
            type: 'complex-min'
          })
        }
      }
    } else if (preset === '8x8grid') {
      // Grid-based minimal kambi patterns
      const gridDots = dots.sort((a, b) => a.ring - b.ring)
      
      if (complexity <= 3) {
        // Simple grid connections
        for (let i = 0; i < gridDots.length - 1; i += 2) {
          const dot1 = gridDots[i]
          const dot2 = gridDots[i + 1]
          paths.push({
            d: `M ${dot1.x} ${dot1.y} L ${dot2.x} ${dot2.y}`,
            strokeWidth: 2,
            type: 'grid'
          })
        }
      } else {
        // Smooth diagonal connections, minimal density
        for (let i = 0; i < gridDots.length; i += 4) {
          const dot1 = gridDots[i]
          const dot2 = gridDots[(i + 3) % gridDots.length]
          const controlX = (dot1.x + dot2.x) / 2
          const controlY = (dot1.y + dot2.y) / 2
          
          paths.push({
            d: `M ${dot1.x} ${dot1.y} Q ${controlX} ${controlY} ${dot2.x} ${dot2.y}`,
            strokeWidth: 1.4,
            type: 'kambi'
          })
        }
      }
    } else if (preset === '13to7') {
      // 13 outer, 7 inner, 1 center → star-flower minimal
      const outer = dots.filter(d => d.ring === 0)
      const inner = dots.filter(d => d.ring === 1)
      const center = dots.find(d => d.ring === 2)

      // Outer star chords (skip-3)
      for (let i = 0; i < outer.length; i++) {
        const a = outer[i]
        const b = outer[(i + 3) % outer.length]
        const ctrlX = centerX + (a.x + b.x - 2 * centerX) * 0.25
        const ctrlY = centerY + (a.y + b.y - 2 * centerY) * 0.25
        paths.push({ d: `M ${a.x} ${a.y} Q ${ctrlX} ${ctrlY} ${b.x} ${b.y}`, strokeWidth: 1.4, type: 'star' })
      }

      // Petals from outer to nearest inner
      for (let i = 0; i < outer.length; i += 2) {
        const a = outer[i]
        const j = Math.round((i / outer.length) * inner.length) % inner.length
        const b = inner[j]
        const ctrlX = (a.x + centerX) / 2
        const ctrlY = (a.y + centerY) / 2
        paths.push({ d: `M ${a.x} ${a.y} Q ${ctrlX} ${ctrlY} ${b.x} ${b.y}`, strokeWidth: 1.3, type: 'petal' })
      }

      // Subtle spokes to center
      if (center) {
        for (let i = 0; i < inner.length; i += 2) {
          const b = inner[i]
          const ctrlX = centerX + (b.x - centerX) * 0.5
          const ctrlY = centerY + (b.y - centerY) * 0.5
          paths.push({ d: `M ${b.x} ${b.y} Q ${ctrlX} ${ctrlY} ${center.x} ${center.y}`, strokeWidth: 1.1, type: 'spoke', opacity: 0.75 })
        }
      }
    } else if (preset === 'radial-lotus') {
      // Radial lotus with minimal connections
      const rings = {}
      dots.forEach(dot => {
        if (!rings[dot.ring]) rings[dot.ring] = []
        rings[dot.ring].push(dot)
      })
      
      // Connect rings
      for (let ring = 0; ring < Math.min(2, Object.keys(rings).length - 1); ring++) {
        const currentRing = rings[ring]
        const nextRing = rings[ring + 1]
        
        if (currentRing && nextRing) {
          for (let i = 0; i < currentRing.length; i += 2) {
            const dot1 = currentRing[i]
            const dot2 = nextRing[i % nextRing.length]
            const controlX = centerX + (dot1.x + dot2.x - 2 * centerX) * 0.3
            const controlY = centerY + (dot1.y + dot2.y - 2 * centerY) * 0.3
            
            paths.push({
              d: `M ${dot1.x} ${dot1.y} Q ${controlX} ${controlY} ${dot2.x} ${dot2.y}`,
              strokeWidth: 1.6,
              type: 'radial'
            })
          }
        }
      }
    } else if (preset === '5x5grid' || preset === '7x7grid' || preset === 'default' || !preset) {
      // Minimal row/column loops on square grids
      const eps = 3
      const byRow = {}
      const byCol = {}
      dots.forEach(d => {
        const ry = Math.round(d.y / eps) * eps
        const rx = Math.round(d.x / eps) * eps
        if (!byRow[ry]) byRow[ry] = []
        if (!byCol[rx]) byCol[rx] = []
        byRow[ry].push(d)
        byCol[rx].push(d)
      })

      Object.values(byRow).forEach(row => {
        row.sort((a, b) => a.x - b.x)
        for (let i = 0; i < row.length - 1; i += 2) {
          const a = row[i]
          const b = row[i + 1]
          const midX = (a.x + b.x) / 2
          const midY = (a.y + b.y) / 2 + (a.y < centerY ? -4 : 4)
          paths.push({ d: `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`, strokeWidth: 1.3, type: 'row' })
        }
      })

      Object.values(byCol).forEach(col => {
        col.sort((a, b) => a.y - b.y)
        for (let i = 0; i < col.length - 1; i += 2) {
          const a = col[i]
          const b = col[i + 1]
          const midX = (a.x + b.x) / 2 + (a.x < centerX ? -4 : 4)
          const midY = (a.y + b.y) / 2
          paths.push({ d: `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`, strokeWidth: 1.3, type: 'col' })
        }
      })
    }

    return paths
  }

  // Connect dots with modern patterns
  const connectDotsModern = (dots, complexity, centerX, centerY) => {
    const paths = []
    
    // Minimal, Pinterest-style smooth connections
    const step = Math.max(2, Math.floor(dots.length / 12))
    for (let i = 0; i < dots.length; i += step) {
      const dot1 = dots[i]
      const dot2 = dots[(i + step * 2) % dots.length]
      const control1X = (dot1.x * 2 + dot2.x) / 3
      const control1Y = (dot1.y * 2 + dot2.y) / 3
      const control2X = (dot1.x + dot2.x * 2) / 3
      const control2Y = (dot1.y + dot2.y * 2) / 3
      paths.push({
        d: `M ${dot1.x} ${dot1.y} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${dot2.x} ${dot2.y}`,
        strokeWidth: 1.2,
        type: 'modern-min',
        opacity: 0.85
      })
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
    
    // Suggestion-specific minimal motifs override
    const sug = (suggestion || '').toLowerCase()
    if (sug === 'flower') {
      // Simple 8-petal flower using bezier curves around center
      const petals = 8
      const radius = Math.min(width, height) * 0.25
      for (let i = 0; i < petals; i++) {
        const a = (i * 2 * Math.PI) / petals
        const b = ((i + 1) * 2 * Math.PI) / petals
        const x1 = centerX + radius * Math.cos(a)
        const y1 = centerY + radius * Math.sin(a)
        const x2 = centerX + radius * Math.cos(b)
        const y2 = centerY + radius * Math.sin(b)
        const cx1 = centerX + (radius * 1.2) * Math.cos(a + (b - a) / 3)
        const cy1 = centerY + (radius * 1.2) * Math.sin(a + (b - a) / 3)
        const cx2 = centerX + (radius * 1.2) * Math.cos(a + (2 * (b - a)) / 3)
        const cy2 = centerY + (radius * 1.2) * Math.sin(a + (2 * (b - a)) / 3)
        paths.push({ d: `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}` , strokeWidth: 1.6, type: 'flower'})
      }
    } else if (sug === 'star') {
      // Clean 5-point star outline with inner chords
      const points = 5
      const R = Math.min(width, height) * 0.38
      const r = R * 0.4
      const coords = []
      for (let i = 0; i < points * 2; i++) {
        const angle = (Math.PI / points) * i - Math.PI / 2
        const rad = i % 2 === 0 ? R : r
        coords.push({ x: centerX + rad * Math.cos(angle), y: centerY + rad * Math.sin(angle) })
      }
      for (let i = 0; i < coords.length; i++) {
        const a = coords[i]
        const b = coords[(i + 2) % coords.length]
        paths.push({ d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`, strokeWidth: 1.4, type: 'star-edge'})
      }
    } else if (sug === 'festival') {
      // Festive rangoli: concentric circles with 8 spokes, minimal
      const rings = 3
      for (let i = 1; i <= rings; i++) {
        const r = (Math.min(width, height) * 0.1) * i + 12
        paths.push({ d: `M ${centerX - r} ${centerY} A ${r} ${r} 0 1 0 ${centerX + r} ${centerY} A ${r} ${r} 0 1 0 ${centerX - r} ${centerY}`, strokeWidth: 1.2, type: 'ring'})
      }
      const spokes = 8
      for (let i = 0; i < spokes; i++) {
        const ang = (i * 2 * Math.PI) / spokes
        const x = centerX + Math.min(width, height) * 0.42 * Math.cos(ang)
        const y = centerY + Math.min(width, height) * 0.42 * Math.sin(ang)
        const cx = centerX + Math.min(width, height) * 0.22 * Math.cos(ang)
        const cy = centerY + Math.min(width, height) * 0.22 * Math.sin(ang)
        paths.push({ d: `M ${centerX} ${centerY} Q ${cx} ${cy} ${x} ${y}`, strokeWidth: 1.2, type: 'spoke'})
      }
    } else if (sug === 'abstract') {
      // Minimal abstract: two smooth interleaving lemniscates (∞)
      const R = Math.min(width, height) * 0.28
      for (let k = 0; k < 2; k++) {
        const offset = k === 0 ? 0 : Math.PI / 4
        let d = ''
        for (let t = 0; t <= Math.PI * 2; t += Math.PI / 16) {
          const x = centerX + R * Math.sin(t + offset) / (1 + Math.cos(t + offset))
          const y = centerY + R * Math.sin(t + offset) * Math.tan((t + offset) / 2)
          d += (t === 0 ? 'M' : 'L') + ` ${x} ${y} `
        }
        paths.push({ d, strokeWidth: 1.3, type: 'abstract' })
      }
    } else {
      if (style === 'traditional') {
        paths = connectDotsTraditional(dots, complexity, centerX, centerY)
      } else {
        paths = connectDotsModern(dots, complexity, centerX, centerY)
      }
    }

    // Apply symmetry transformations
    // Keep symmetry folds minimal for clean look
    const symmetryFolds = complexity >= 7 ? 4 : 2
    const transformedPaths = []
    
    paths.forEach(path => {
      const symmetricPaths = symmetryTransform(path, 'rotational', symmetryFolds, centerX, centerY)
      transformedPaths.push(...symmetricPaths)
    })

    // Cap number of paths to avoid overly busy visuals
    const maxPaths = 80
    const finalPaths = transformedPaths.slice(0, maxPaths)

    setCurrentPaths(finalPaths)
    return { dots, paths: finalPaths }
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
    
    // Build palette gradients
    const gradients = []
    const addLinear = (id, colors) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
      g.setAttribute('id', id)
      g.setAttribute('x1', '0%')
      g.setAttribute('y1', '0%')
      g.setAttribute('x2', '100%')
      g.setAttribute('y2', '100%')
      colors.forEach((c, i) => {
        const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
        stop.setAttribute('offset', `${Math.round((i / (colors.length - 1)) * 100)}%`)
        stop.setAttribute('stop-color', c)
        g.appendChild(stop)
      })
      defs.appendChild(g)
      gradients.push(id)
    }

    if (paletteType === 'traditional') {
      const colors = theme === 'dark' ? ['#FFD700', '#FFB000'] : ['#ffffff', '#ff0000', '#ffff00', '#0000ff']
      addLinear('kolamGradient0', colors)
    } else if (paletteType === 'modern') {
      addLinear('kolamGradient0', ['#ff7e5f', '#feb47b'])
      addLinear('kolamGradient1', ['#6a11cb', '#2575fc'])
      addLinear('kolamGradient2', ['#00c6ff', '#0072ff'])
      addLinear('kolamGradient3', ['#f7971e', '#ffd200'])
    } else if (paletteType === 'custom') {
      const cols = customColors && customColors.length ? customColors : ['#ffffff', '#ff0000', '#ffff00', '#0000ff']
      addLinear('kolamGradient0', cols)
    }
    svg.appendChild(defs)
    svg.appendChild(defs)

    // Draw paths
    kolam.paths.forEach((pathData, index) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathData.d)
      if (paletteType === 'modern') {
        const gid = `kolamGradient${index % 4}`
        path.setAttribute('stroke', `url(#${gid})`)
      } else if (paletteType === 'custom' || paletteType === 'traditional') {
        path.setAttribute('stroke', 'url(#kolamGradient0)')
      } else {
        path.setAttribute('stroke', theme === 'dark' ? '#FFD700' : '#800000')
      }
      path.setAttribute('stroke-width', pathData.strokeWidth)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-linecap', 'round')
      path.setAttribute('stroke-linejoin', 'round')
      path.setAttribute('opacity', pathData.opacity || 0.8)
      
      if (animationEnabled) {
        // Step-by-step draw animation
        path.style.animationDelay = `${index * 0.05}s`
        path.style.animation = 'drawPath 2s ease-in-out forwards'
      }
      
      svg.appendChild(path)
    })

    // Draw dots if enabled
    if (showDots) {
      kolam.dots.forEach((dot, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', dot.x)
        circle.setAttribute('cy', dot.y)
        circle.setAttribute('r', dot.radius)
        if (paletteType === 'modern') {
          circle.setAttribute('fill', '#ffd200')
        } else if (paletteType === 'custom') {
          circle.setAttribute('fill', customColors[0] || '#800000')
        } else {
          circle.setAttribute('fill', theme === 'dark' ? '#FFD700' : '#800000')
        }
        circle.setAttribute('opacity', '0.7')
        
        if (animationEnabled) {
          circle.style.animationDelay = `${index * 0.02}s`
          circle.style.animation = 'fadeIn 1s ease-in-out forwards'
        }
        
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
  }, [size, complexity, style, preset, theme, showDots, paletteType, customColors, animationEnabled])

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
      
      {/* Download / Export buttons */}
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={downloadSVG}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron to-gold text-maroon font-semibold px-4 py-2 rounded-lg shadow-soft hover:scale-[1.01] transition-transform"
        >
          <FiDownload />
          Download SVG
        </button>
        {animationEnabled && (
          <button
            onClick={async () => {
              if (isRecording) return
              const svg = svgRef.current
              if (!svg) return

              // Rasterize SVG frames by cloning to an <img> drawn on a <canvas>
              const width = dimensions.width
              const height = dimensions.height
              const canvas = document.createElement('canvas')
              canvas.width = width
              canvas.height = height
              const ctx = canvas.getContext('2d')

              const stream = canvas.captureStream(30)
              const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
              const chunks = []
              recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }
              recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `kolam-${preset}-${complexity}-${style}.webm`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
                setIsRecording(false)
              }

              setIsRecording(true)
              recorder.start()

              const durationMs = 3000 + currentPaths.length * 50
              const start = performance.now()

              const renderFrame = () => {
                const now = performance.now()
                const t = Math.min(1, (now - start) / durationMs)

                // Clone SVG and set progressive stroke-dashoffset for reveal effect
                const cloned = svg.cloneNode(true)
                const nodeList = cloned.querySelectorAll('path')
                nodeList.forEach((p, idx) => {
                  const revealPoint = Math.max(0, t - (idx * 0.05) / 2)
                  const dash = 1000
                  const offset = (1 - Math.min(1, revealPoint * 2)) * dash
                  p.setAttribute('stroke-dasharray', `${dash}`)
                  p.setAttribute('stroke-dashoffset', `${offset}`)
                })

                const xml = new XMLSerializer().serializeToString(cloned)
                const image = new Image()
                const svg64 = btoa(unescape(encodeURIComponent(xml)))
                image.src = `data:image/svg+xml;base64,${svg64}`
                image.onload = () => {
                  ctx.clearRect(0, 0, width, height)
                  ctx.drawImage(image, 0, 0)
                }

                if (t < 1) {
                  requestAnimationFrame(renderFrame)
                } else {
                  setTimeout(() => recorder.stop(), 200)
                }
              }

              requestAnimationFrame(renderFrame)
            }}
            className="inline-flex items-center gap-2 bg-white text-maroon border border-gold px-4 py-2 rounded-lg shadow-soft hover:scale-[1.01] transition-transform disabled:opacity-60"
            disabled={isRecording}
            title="Export animation as WebM"
          >
            {isRecording ? 'Recording…' : 'Export Animation (WebM)'}
          </button>
        )}
      </div>
    </motion.div>
  )
}