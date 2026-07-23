'use client'

import { useEffect, useRef } from 'react'

export function PlaneAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const handleResize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Plane properties
    let x = -100
    let y = 100
    let angle = 0
    const speed = 1.5
    const amplitude = 30
    const frequency = 0.02

    // Trail particles
    const trails: { x: number; y: number; alpha: number }[] = []

    // Animation loop
    let animationId: number

    function animate() {
      if (!ctx || !canvas) return
      
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      
      ctx.clearRect(0, 0, width, height)

      // Update plane position
      x += speed
      y = 100 + Math.sin(x * frequency) * amplitude
      angle = Math.cos(x * frequency) * 0.1

      // Reset when off screen
      if (x > width + 100) {
        x = -100
        trails.length = 0
      }

      // Add trail
      trails.push({ x, y: y + 20, alpha: 1 })
      if (trails.length > 50) trails.shift()

      // Draw trails
      trails.forEach((trail) => {
        trail.alpha -= 0.02
        ctx.beginPath()
        ctx.arc(trail.x, trail.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 200, 100, ${Math.max(0, trail.alpha * 0.5)})`
        ctx.fill()
      })

      // Draw plane
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)

      // Plane body
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.ellipse(0, 0, 25, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      // Wings
      ctx.fillStyle = '#e0e0e0'
      ctx.beginPath()
      ctx.moveTo(-5, -2)
      ctx.lineTo(10, -15)
      ctx.lineTo(15, -15)
      ctx.lineTo(5, -2)
      ctx.closePath()
      ctx.fill()

      // Tail
      ctx.fillStyle = '#f0f0f0'
      ctx.beginPath()
      ctx.moveTo(-20, 0)
      ctx.lineTo(-30, -12)
      ctx.lineTo(-25, -12)
      ctx.lineTo(-15, 0)
      ctx.closePath()
      ctx.fill()

      // Window
      ctx.fillStyle = '#87CEEB'
      ctx.beginPath()
      ctx.arc(8, -2, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  )
}