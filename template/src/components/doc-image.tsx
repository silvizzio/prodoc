import fs from 'fs'
import path from 'path'
import { CanvasImage } from '@/components/canvas-image'

const EXT_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

export function DocImage({ src, alt }: { src: string; alt?: string }) {
  try {
    const filename = src.replace('/api/img/', '')
    const filePath = path.join(process.cwd(), 'private', 'images', 'docs', filename)
    const ext = path.extname(filename).toLowerCase()
    const mime = EXT_MIME[ext] || 'image/jpeg'
    const buffer = fs.readFileSync(filePath)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${mime};base64,${base64}`
    const isSvg = ext === '.svg'

    const separator = ' \u2014 '
    const hasTitle = (alt || '').includes(separator)
    const title = hasTitle ? (alt || '').split(separator)[0] : ''
    const caption = hasTitle ? (alt || '').split(separator).slice(1).join(separator) : (alt || '')

    return (
      <span style={{ display: 'block', marginBottom: '32px' }}>
        {title && (
          <span style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'hsl(var(--foreground))' }}>
            {title}
          </span>
        )}
        {isSvg ? (
          <img src={dataUrl} alt={alt || ''} draggable={false} style={{ display: 'block', maxWidth: '100%', pointerEvents: 'none', userSelect: 'none' }} />
        ) : (
          <CanvasImage src={dataUrl} alt={alt || ''} />
        )}
        {caption && (
          <span style={{ display: 'block', marginTop: '8px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', textAlign: 'center', lineHeight: 1.5 }}>
            {caption.charAt(0).toUpperCase() + caption.slice(1)}
          </span>
        )}
      </span>
    )
  } catch {
    return null
  }
}
