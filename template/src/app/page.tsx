import Link from "next/link"
import DocHeader from "@/components/doc-header"
import { getSearchIndex } from "@/lib/search"

export default function Home() {
  const searchDocs = getSearchIndex()
  return (
    <div style={{ minHeight: "100vh", background: "hsl(var(--background))", color: "hsl(var(--foreground))", display: "flex", flexDirection: "column", paddingTop: "48px" }}>
      <DocHeader searchDocs={searchDocs} />
      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "48px 16px", flex: 1 }}>
        <div className="mb-12">
          <h1 className="text-3xl font-medium mb-2">Product Name</h1>
          <p className="text-muted-foreground text-sm max-w-xl">Product documentation. Replace this with your product description.</p>
        </div>
        <div className="mb-8 p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8" style={{background:"#10b981",border:"1px solid #10b981"}}>
          <div>
            <p className="text-xs uppercase tracking-wide mb-2" style={{color:"rgba(2,44,34,0.6)"}}>GETTING STARTED</p>
            <h2 className="text-base font-medium mb-1" style={{color:"#022c22"}}>New to the platform?</h2>
            <p className="text-xs leading-relaxed" style={{color:"rgba(2,44,34,0.75)"}}>Start with the overview to understand the platform and how to use it.</p>
          </div>
          <div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
            <Link href="/docs/overview" className="shrink-0 inline-flex items-center gap-1.5 text-xs rounded-md px-3 py-1.5 transition-colors" style={{background:"transparent",color:"#022c22",border:"1px solid rgba(2,44,34,0.35)"}}>
              Overview
            </Link>
            <Link href="/docs/02-interface-guide" className="shrink-0 inline-flex items-center gap-1.5 text-xs rounded-md px-3 py-1.5 transition-colors" style={{background:"transparent",color:"#022c22",border:"1px solid rgba(2,44,34,0.35)"}}>
              Interface guide
            </Link>
          </div>
        </div>
      </main>
      <footer style={{ borderTop: "1px solid hsl(var(--border))", padding: "16px 32px", maxWidth: "1440px", width: "100%", margin: "0 auto" }}>
        <p style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>Product Documentation v1.0</p>
      </footer>
    </div>
  )
}
