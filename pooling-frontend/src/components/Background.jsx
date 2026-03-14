import { useEffect, useRef } from 'react'

export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animFrame
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.005

      ctx.save()
      const grd1 = ctx.createRadialGradient(
        canvas.width * 0.2 + Math.sin(t * 0.7) * 80,
        canvas.height * 0.3 + Math.cos(t * 0.5) * 60,
        0,
        canvas.width * 0.2,
        canvas.height * 0.3,
        400
      )
      grd1.addColorStop(0, 'rgba(99,102,241,0.12)')
      grd1.addColorStop(1, 'rgba(99,102,241,0)')
      ctx.fillStyle = grd1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const grd2 = ctx.createRadialGradient(
        canvas.width * 0.8 + Math.sin(t * 0.4) * 100,
        canvas.height * 0.7 + Math.cos(t * 0.6) * 80,
        0,
        canvas.width * 0.8,
        canvas.height * 0.7,
        350
      )
      grd2.addColorStop(0, 'rgba(139,92,246,0.08)')
      grd2.addColorStop(1, 'rgba(139,92,246,0)')
      ctx.fillStyle = grd2
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(129,140,248,${p.opacity * 0.6})`
        ctx.fill()
      })

      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  )
}
