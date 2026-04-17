'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type DocMeta } from '@/lib/docs'

import { Badge } from '@/components/ui/badge'

type Props = {
  docsBySection: Record<string, DocMeta[]>
}

export default function Sidebar({ docsBySection }: Props) {
  const pathname = usePathname()

  return (
    <aside
      className="no-print hidden lg:block"
      style={{ position: 'absolute', top: 0, left: 0, width: '224px', height: '100%' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', borderRight: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }} className="sidebar-scroll">
        <div style={{ padding: '16px 0 16px', borderBottom: '1px solid hsl(var(--border))', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
            <div style={{ width: '24px', height: '24px', background: 'hsl(var(--foreground))', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" fill="white" rx="1"/>
                <rect x="8" y="1" width="5" height="5" fill="white" rx="1" opacity="0.6"/>
                <rect x="1" y="8" width="5" height="5" fill="white" rx="1" opacity="0.6"/>
                <rect x="8" y="8" width="5" height="5" fill="white" rx="1" opacity="0.3"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 500, lineHeight: 1.3 }}>Product Name</p>
              <p style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>v1.0</p>
            </div>
          </div>
        </div>

        <nav style={{ paddingBottom: '16px' }}>
          {Object.entries(docsBySection).map(([section, docs]) => (
            <div key={section} style={{ marginBottom: '4px' }}>
              <p style={{ padding: '6px 16px', fontSize: '10px', fontWeight: 500, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {section}
              </p>
              {docs.map(doc => {
                const isActive = pathname === `/docs/${doc.slug}`
                return (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: isActive ? '6px 16px 6px 14px' : '6px 16px',
                      fontSize: '13px',
                      borderLeft: isActive ? '2px solid hsl(var(--foreground))' : '2px solid transparent',
                      color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                      fontWeight: isActive ? 500 : 400,
                      textDecoration: 'none',
                      background: isActive ? 'hsl(var(--background))' : 'transparent',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', opacity: 0.6, minWidth: '16px', fontVariantNumeric: 'tabular-nums' }}>
                      {doc.order < 10 ? `0${doc.order}` : doc.order >= 98 ? '—' : doc.order}
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.4 }}>{doc.title}</span>
                    {doc.role === 'admin' && (
                      <Badge variant="outline" style={{ fontSize: '9px', padding: '0 4px', height: '16px' }}>
                        admin
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: '1px solid hsl(var(--border))' }}>
          <p style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}> — Authorized Stakeholders Only</p>
        </div>
      </div>
    </aside>
  )
}
