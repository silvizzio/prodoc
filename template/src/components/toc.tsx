'use client'

import { useEffect, useState } from 'react'

type Heading = {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('article h2, article h3')
    )
    const parsed: Heading[] = elements.map((el) => {
      if (!el.id) {
        el.id = (el.textContent ?? '')
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      }
      return {
        id: el.id,
        text: el.textContent ?? '',
        level: parseInt(el.tagName[1]),
      }
    })
    setTimeout(() => setHeadings(parsed), 0)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setTimeout(() => setActive(entry.target.id), 0)
        })
      },
      { rootMargin: '0px 0px -60% 0px' }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <aside className="no-print hidden lg:block" style={{ position: 'absolute', top: 0, right: 0, width: '224px', height: '100%' }}>
      <div style={{ position: 'sticky', top: 0, padding: '40px 24px 40px 0' }}>
        <p style={{ fontSize: '10px', fontWeight: 500, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Contents
        </p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {headings.map((item, idx) => (
            <a key={item.id + '-' + idx} href={'#' + item.id} style={{ fontSize: '12px', lineHeight: '1.5', padding: '2px 0', paddingLeft: item.level === 3 ? '12px' : '0', color: active === item.id ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', fontWeight: active === item.id ? 500 : 400, textDecoration: 'none', display: 'block' }}>
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
