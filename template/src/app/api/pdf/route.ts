import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

export const maxDuration = 120

const HDR = "<div style=\"width:100%;font-family:Inter,system-ui,sans-serif;font-size:7pt;color:#999;display:flex;justify-content:space-between;align-items:center;padding:0 20mm 2mm;border-bottom:0.3pt solid #e5e5e5\"><span style=\"font-weight:600\">Product Name — Platform Documentation v1.0</span><span>Confidential</span></div>"
const FTR = "<div style=\"width:100%;font-family:Inter,system-ui,sans-serif;font-size:7pt;color:#999;display:flex;justify-content:space-between;align-items:center;padding:2mm 20mm 0;border-top:0.3pt solid #e5e5e5\"><span>Company · April 2026</span><span style=\"font-weight:600\"><span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span></span></div>"
const CSS = "aside,header,.no-print{display:none!important}main{margin:0!important}main>div{padding:20px 0!important}main>div>div:first-child{display:none!important}"
const CHROMIUM_URL = "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"

function getSlugsInOrder(): string[] {
  const docsPath = path.join(process.cwd(), 'content/docs')
  return fs.readdirSync(docsPath)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const raw = fs.readFileSync(path.join(docsPath, f), 'utf8')
      const orderMatch = raw.match(/^order:\s*(\d+)/m)
      return { slug: f.replace('.mdx', ''), order: orderMatch ? parseInt(orderMatch[1]) : 99 }
    })
    .sort((a, b) => a.order - b.order)
    .map(f => f.slug)
}

async function launchBrowser() {
  const isVercel = process.env.VERCEL === '1'
  if (isVercel) {
    const chromium = await import('@sparticuz/chromium-min')
    const puppeteer = await import('puppeteer-core')
    return puppeteer.default.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(CHROMIUM_URL),
      headless: true,
    })
  } else {
    const puppeteer = await import('puppeteer-core')
    return puppeteer.default.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })
  }
}

async function renderPage(browser: Awaited<ReturnType<typeof launchBrowser>>, url: string): Promise<Buffer> {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.addStyleTag({ content: CSS })
  await page.waitForSelector('article', { timeout: 10000 }).catch(() => {})
  await page.evaluateHandle('document.fonts.ready')
  // Wait for all canvas elements to finish drawing
  await page.evaluate(() => new Promise(resolve => {
    const canvases = document.querySelectorAll('canvas')
    if (canvases.length === 0) return resolve(undefined)
    let loaded = 0
    canvases.forEach(canvas => {
      const img = new Image()
      img.onload = img.onerror = () => { if (++loaded === canvases.length) resolve(undefined) }
      img.src = canvas.toDataURL()
    })
    setTimeout(resolve, 2000) // fallback
  }))
  const pdf = await page.pdf({
    format: 'A4',
      scale: 0.8,
    printBackground: true,
      margin: { top: '25mm', right: '20mm', bottom: '22mm', left: '20mm' },
    displayHeaderFooter: true,
    headerTemplate: HDR,
    footerTemplate: FTR,
  })
  await page.close()
  return Buffer.from(pdf)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const full = searchParams.get('full') === 'true'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  let browser: Awaited<ReturnType<typeof launchBrowser>> | undefined
  try {
    browser = await launchBrowser()

    if (full) {
      const slugs = getSlugsInOrder()
      const pdfBuffers: Buffer[] = []
      for (const s of slugs) {
        const buf = await renderPage(browser, baseUrl + '/docs/' + s)
        pdfBuffers.push(buf)
      }
      const merged = await PDFDocument.create()
      for (const buf of pdfBuffers) {
        const doc = await PDFDocument.load(buf)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      return new NextResponse(Buffer.from(await merged.save()), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Docs-Platform-Documentation.pdf"',
        },
      })
    } else {
      const s = slug || 'overview'
      const buf = await renderPage(browser, baseUrl + '/docs/' + s)
      return new NextResponse(buf as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Docs-' + s + '.pdf"',
        },
      })
    }
  } catch (err) {
    console.error('PDF error:', err)
    return new NextResponse(String(err), { status: 500 })
  } finally {
    if (browser) await browser.close()
  }
}
