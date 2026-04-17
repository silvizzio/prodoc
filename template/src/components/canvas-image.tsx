'use client'
import { useEffect, useRef } from 'react'

export function CanvasImage({ src, alt, style }: { src: string; alt?: string; style?: React.CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new window.Image()
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
    }
    img.src = src
  }, [src])

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      onContextMenu={e => e.preventDefault()}
      style={{
        display: 'block',
        maxWidth: '100%',
        borderRadius: '4px',
        filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
        ...style
      }}
    />
  )
}
