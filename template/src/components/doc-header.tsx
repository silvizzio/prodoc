import Link from 'next/link'
import MobileNav from '@/components/mobile-nav'
import SearchBox from '@/components/search-box'
import FullGuideButton from '@/components/full-guide-button'
import type { SearchDoc } from '@/lib/search'

type Props = {
  searchDocs: SearchDoc[]
  docsBySection?: Record<string, any[]>
  currentSlug?: string
}

export default function DocHeader({ searchDocs, docsBySection, currentSlug }: Props) {
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, borderBottom: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', zIndex: 50 }}>
        <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {docsBySection && <MobileNav docsBySection={docsBySection} currentSlug={currentSlug} />}
              <div style={{ width: '20px', height: '20px', background: 'hsl(var(--foreground))', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" fill="white" rx="1"/>
                  <rect x="8" y="1" width="5" height="5" fill="white" rx="1" opacity="0.6"/>
                  <rect x="1" y="8" width="5" height="5" fill="white" rx="1" opacity="0.6"/>
                  <rect x="8" y="8" width="5" height="5" fill="white" rx="1" opacity="0.3"/>
                </svg>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Docs</span>
              <span style={{ color: 'hsl(var(--muted-foreground))', opacity: 0.4 }}>/</span>
              <Link href="/" style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', textDecoration: 'none' }}>Documentation</Link>
            </div>
            <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '8px' }}>
              <SearchBox docs={searchDocs} />
              <FullGuideButton />
            </div>
            <div className="sm:hidden">
              <FullGuideButton />
            </div>
          </div>
          <div className="sm:hidden" style={{ paddingBottom: '8px' }}>
            <SearchBox docs={searchDocs} />
          </div>
        </div>
      </header>
  )
}
