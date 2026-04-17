# Product Docs Site — Template Guide

**Stack:** Next.js 16 · MDX · shadcn/ui · Tailwind v4 · Puppeteer PDF · Fuse.js search
**Last updated:** April 2026

---

## What this is

A technical documentation site template for platform products. Each project gets its own standalone docs site with:

- Sidebar navigation with section grouping and role badges
- MDX content with custom components (callouts, screenshot placeholders, reference tables)
- Right-side table of contents with scroll-aware active state
- Full-text search across all docs (Fuse.js, client-side) with command palette (Cmd+K)
- Per-page PDF download and full guide download (Puppeteer, server-side)
- Prev/Next navigation between pages
- Architecture and workflow diagrams as React/HTML components (no SVG coordinate math)
- Canvas-based image rendering to prevent DevTools URL exposure
- Compressed JPEG images (base64 encoded) for private asset delivery
- Vercel deployment with GitHub auto-deploy

---

## Stack decisions

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router | Static + dynamic routes, zero-config Vercel deploy |
| Content | MDX files in `/content/docs` | File-based, Git-versionable, no CMS needed |
| Styling | Tailwind v4 + shadcn/ui | Consistent component library |
| Typography | `@tailwindcss/typography` prose classes | Handles all article body styling |
| Search | Fuse.js (client-side) | No backend needed; fast for doc-scale content |
| PDF | Puppeteer + local Chrome | Renders exact HTML/CSS — no layout mismatch |
| PDF merge | `pdf-lib` | Combines per-page PDFs into full guide |
| Images | Base64 JPEG via canvas | No public URLs; canvas rendering prevents DevTools extraction |
| Deployment | Vercel | Zero-config Next.js; auto-deploy from GitHub |

---

## Folder structure

```
project/
├── content/
│   └── docs/                     ← MDX files, one per page
│       ├── overview.mdx
│       ├── 01-section-name.mdx
│       └── ...
├── private/
│   └── images/docs/              ← Source images (never served publicly)
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Homepage
│   │   ├── layout.tsx            ← Root layout
│   │   ├── globals.css           ← Tailwind + prose overrides + print CSS
│   │   ├── docs/
│   │   │   ├── layout.tsx        ← Docs shell (sidebar + header)
│   │   │   └── [slug]/
│   │   │       └── page.tsx      ← Dynamic doc page renderer
│   │   └── api/
│   │       └── pdf/
│   │           └── route.ts      ← PDF generation API (Puppeteer)
│   ├── components/
│   │   ├── doc-header.tsx        ← Shared header (search + download)
│   │   ├── sidebar.tsx           ← Left nav with section groups
│   │   ├── toc.tsx               ← Right-side table of contents
│   │   ├── mdx-components.tsx    ← Custom MDX components + diagram components
│   │   ├── doc-image.tsx         ← Image renderer (base64 → canvas)
│   │   ├── canvas-image.tsx      ← Client component: draws image on canvas
│   │   ├── prev-next.tsx         ← Bottom page navigation
│   │   ├── search-box.tsx        ← Command palette search (Cmd+K)
│   │   ├── print-button.tsx      ← Per-page PDF download
│   │   └── full-guide-button.tsx ← Full guide PDF download
│   └── lib/
│       ├── docs.ts               ← MDX file reader + frontmatter parser
│       └── search.ts             ← Search index builder
├── next.config.ts
└── tailwind.config.ts
```

---

## Replication guide (new project)

### 1. Scaffold

```bash
mkdir my-project-docs && cd my-project-docs
git init
npx create-next-app@latest . \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack
```

### 2. Install dependencies

```bash
npm install next-mdx-remote gray-matter remark-gfm fuse.js pdf-lib puppeteer-core
npm install @tailwindcss/typography lucide-react clsx tailwind-merge
npx shadcn@latest init
npx shadcn@latest add separator scroll-area badge
```

### 3. Copy core files

Copy these files verbatim — they are project-agnostic:

- `src/lib/docs.ts`
- `src/lib/search.ts`
- `src/app/docs/[slug]/page.tsx`
- `src/components/sidebar.tsx`
- `src/components/toc.tsx`
- `src/components/mdx-components.tsx`
- `src/components/doc-image.tsx`
- `src/components/canvas-image.tsx`
- `src/components/prev-next.tsx`
- `src/components/search-box.tsx`
- `src/components/print-button.tsx`
- `src/components/full-guide-button.tsx`
- `src/app/api/pdf/route.ts`

### 4. Customise for the new project

| File | What to change |
|---|---|
| `src/components/doc-header.tsx` | Product name, logo SVG |
| `src/app/page.tsx` | Hero title, subtitle, section grid links |
| `src/app/docs/layout.tsx` | Product name in sidebar header |
| `src/components/sidebar.tsx` | Logo SVG, product name, version |
| `src/app/api/pdf/route.ts` | Header/footer strings (product name, date) |
| `src/app/globals.css` | CSS variables (brand colors if needed) |
| `content/docs/` | All MDX content files |

### 5. Image pipeline

Images are stored in `private/images/docs/` and never served publicly. They are read at build time, compressed to JPEG, base64-encoded, and rendered on a `<canvas>` element to prevent DevTools URL extraction.

**Compress images before use:**

```bash
pip install Pillow --break-system-packages
python3 << 'EOF'
from PIL import Image
import os

img_dir = 'private/images/docs'
for filename in os.listdir(img_dir):
    if not filename.endswith('.png'):
        continue
    path = os.path.join(img_dir, filename)
    img = Image.open(path).convert('RGB')
    if img.width > 1440:
        ratio = 1440 / img.width
        img = img.resize((1440, int(img.height * ratio)), Image.LANCZOS)
    jpg_path = path.replace('.png', '.jpg')
    img.save(jpg_path, 'JPEG', quality=82, optimize=True)
    os.remove(path)
    print(f'compressed {filename}')
EOF
```

**Reference images in MDX using `/api/img/filename.jpg`:**

```mdx
![Caption text](/api/img/your-screenshot.jpg)
```

The `DocImage` component reads the file from `private/images/docs/`, encodes it as base64, and passes it to `CanvasImage` for rendering. No URL ever appears in the DOM.

**Add Vercel env var to bypass ISR size limit** (required if any page exceeds 19MB after base64 encoding):

```
VERCEL_BYPASS_FALLBACK_OVERSIZED_ERROR=1
```

**Title/caption split using em dash separator:**

```mdx
![Section Title — Caption describing the screenshot](/api/img/screenshot.jpg)
```

Everything before ` — ` renders as a bold label above the image. Everything after renders as a caption below.

### 6. Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

On Vercel dashboard:
- Settings → Environment Variables → add `NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app`
- Settings → Environment Variables → add `VERCEL_BYPASS_FALLBACK_OVERSIZED_ERROR=1`

---

## MDX content authoring

### Frontmatter

Every `.mdx` file in `content/docs/` must have this frontmatter:

```mdx
---
title: Page Title
section: Section Name
order: 1
role: admin        # optional — shows admin badge in sidebar
---
```

**Sections** group pages in the sidebar. Use consistent section names across files:

- `Getting Started`
- `Analysis`
- `Applications`
- `Pipelines`
- `Platform`
- `Reference`

**Order** determines sidebar and prev/next sequence. Use integers. Reference/appendix pages use high numbers (e.g. 15, 16).

### Slash usage

Never use spaces around slashes when communicating "or" in navigation paths or UI labels:

```
✓ All Apps/Change Detection/Compliance
✗ All Apps / Change Detection / Compliance
```

Spaces around slashes are acceptable only for paired technical terms (e.g. `IoU/F1`, `Train/Val/Test`).

### Custom components

These are available in all MDX files without importing:

#### `<Callout>`

```mdx
<Callout type="note" title="Note title">
  Content here. Supports **markdown** inside.
</Callout>
```

Types: `note` (blue) · `warning` (amber) · `tip` (zinc) · `admin` (red)

#### `<ScreenshotPlaceholder>`

```mdx
<ScreenshotPlaceholder caption="Describe the exact UI state needed for this screenshot" />
```

Renders a grey dashed box with caption. Replace with image reference once screenshots are ready.

#### `<Kbd>`

```mdx
Press <Kbd>Cmd+K</Kbd> to open search.
```

#### `<ArchitectureDiagram>` and `<CoreWorkflowDiagram>`

Built-in React/HTML diagram components. Copy and adapt `ArchitectureDiagram` from `mdx-components.tsx` for new products — replace layer names, colors, and card labels. No SVG coordinate math needed; uses flexbox divs.

---

## Component reference

### `Callout`

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `note\|warning\|tip\|admin` | `note` | Visual style |
| `title` | `string` | — | Bold label above content |
| `children` | `ReactNode` | required | Body content |

### `ScreenshotPlaceholder`

| Prop | Type | Description |
|---|---|---|
| `caption` | `string` | Caption text below the placeholder icon |

### `DocImage`

Server component. Reads image from `private/images/docs/`, encodes as base64, passes to `CanvasImage`.

| Prop | Type | Description |
|---|---|---|
| `src` | `string` | Image path in `/api/img/filename.jpg` format |
| `alt` | `string` | Alt text. Use `Title — Caption` format to split into label + caption |

### `CanvasImage`

Client component. Draws base64 image onto a `<canvas>` element. No `src` attribute in DOM.

| Prop | Type | Description |
|---|---|---|
| `src` | `string` | Base64 data URL |
| `alt` | `string` | Accessible label |

### `PrintButton`

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Doc page title (used for filename) |
| `section` | `string` | Section name |
| `slug` | `string` | Doc slug (used for filename) |

---

## PDF generation

### How it works

1. User clicks **Download PDF** or **Download full guide**
2. Client hits `/api/pdf?slug=page-slug` (or `?full=true`)
3. API route launches local Chrome via Puppeteer
4. Puppeteer navigates to the live page, injects CSS to hide sidebar/nav
5. Calls `page.pdf()` with A4 format, scale 0.8, custom header/footer
6. For full guide: renders each page, merges with `pdf-lib`
7. Returns PDF buffer as `application/pdf` download

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Yes (production) | Full URL of the deployed site |
| `VERCEL_BYPASS_FALLBACK_OVERSIZED_ERROR` | Yes (if images > 19MB/page) | Bypasses Vercel ISR size check |
| `CHROME_PATH` | Optional | Path to Chrome binary (defaults to Mac location) |

### Local Chrome path (Mac)

```
/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

### Production (Vercel)

On Vercel, replace `puppeteer-core` + local Chrome with `@sparticuz/chromium`:

```bash
npm install @sparticuz/chromium
```

Update `route.ts` launch config:

```ts
import chromium from '@sparticuz/chromium'

browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
})
```

---

## Customisation reference

### Brand colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --primary: 240 5.9% 10%;          /* Main action color */
  --muted-foreground: 240 3.8% 46%; /* Sidebar labels, captions */
  --border: 240 5.9% 90%;           /* All dividers */
}
```

### Sidebar width

Currently `224px`. Change in:
- `src/components/sidebar.tsx`
- `src/app/docs/layout.tsx`
- `src/components/toc.tsx`

### Adding a new doc section

1. Create MDX files in `content/docs/` with matching `section:` frontmatter
2. The sidebar auto-generates from frontmatter — no config needed
3. Update `src/app/page.tsx` section grid to add a card for the new section

### Prose typography overrides

Override in `tailwind.config.ts` under `typography.DEFAULT.css`:

```ts
p: { fontSize: '0.9375rem', lineHeight: '1.7' },
li: { fontSize: '0.9375rem', lineHeight: '1.6', marginTop: '0.2rem', marginBottom: '0.2rem' },
h2: { fontSize: '1.25rem' },
h3: { fontSize: '1.0625rem' },
```

List item paragraph margins must also be overridden in `globals.css`:

```css
article ol > li > p,
article ul > li > p {
  margin-top: 0.25rem !important;
  margin-bottom: 0.25rem !important;
}
```

---

## Responsive layout

The template is responsive across desktop, tablet, and mobile viewports.

### Desktop (lg and above)
- Sidebar visible on left (224px fixed)
- Table of contents visible on right (224px fixed)
- Content centered between both panels
- Search bar inline in header alongside download button

### Mobile (below lg breakpoint)
- Sidebar and TOC hidden
- Hamburger menu in header opens a slide-out sidebar (MobileNav component)
- Search bar moves to second row below logo
- Content takes full width with 16px horizontal padding
- Breadcrumb hidden on mobile
- Tables get horizontal scroll (overflow-x-auto)
- Image grids reflow (5-col becomes auto-fill with 150px min)
- ImageSide components stack vertically (flex-wrap)

### Key responsive classes

| Element | Desktop | Mobile |
|---|---|---|
| Sidebar | hidden lg:block | Hidden, replaced by MobileNav |
| TOC | hidden lg:block | Hidden |
| Content margins | lg:ml-[224px] lg:mr-[224px] | No margin |
| Header search | hidden sm:flex (inline) | sm:hidden (second row) |
| Content padding top | sm:pt-[48px] | pt-[88px] (accounts for 2-row header) |
| Breadcrumb | hidden lg:flex | Hidden |

### MobileNav component

Client component. Renders a hamburger icon that opens a fixed overlay sidebar with chapter navigation. Receives docsBySection and currentSlug as props from the header. Add to core files list when scaffolding.

---

## ImageSide component

Server component for side-by-side image + text layouts. Uses DocImage pipeline internally.

| Prop | Type | Default | Description |
|---|---|---|---|
| src | string | required | Image path in /api/img/filename.jpg format |
| alt | string | - | Caption text below the image |
| children | ReactNode | required | Text content beside the image |
| width | string | 240px | Image column width |
| maxHeight | string | 420px | Max image height before overflow hidden |
| position | left or right | left | Which side the image appears on |

Markdown inside ImageSide must have blank lines before and after the content block. The children div gets Tailwind prose classes automatically.

---

## Content structure patterns

### Detection layer chapters

1. Intro paragraph with hero image (LOD 1, full screen)
2. How to access: query example
3. What it detects: 2-column table (Field, Value) plus sub-tables for multi-value fields
4. LOD 1 City overview: screenshot + 3-column table (Field, Example, Context)
5. LOD 2 Zone detail: screenshot + 3-column table
6. LOD 3 Site detail: screenshot + 3-column table + sub-tables for types
7. Source line

### Use case chapters

1. Intro paragraph
2. How to access: query example
3. What it shows: layer role table + derived metrics table + sub-tables for value types
4. LOD 1 City overview: screenshot + 3-column table
5. LOD 2 Zone detail: screenshot + 3-column table
6. LOD 3 Site detail: screenshot + 3-column table

### Table patterns

Main field tables use 3 columns: Field, Example, Context. Classification tables use 2 columns: Field, Value. When a field has multiple possible values (status, risk level, roof type), add a bold-titled sub-table after the main table. Sub-tables must be separated from the main table by a blank line and a bold heading, otherwise markdown merges them.

### Image naming convention

Chapter-prefixed: 03-buildings-tabuk-lod1.jpg, 08-change-madinah-lod3.jpg. Non-chapter: 00-default-state-1.jpg, 01-interface-guide.jpg, bottom-bar.png.

### Image compression

Compress all images before committing. Target under 500KB per image, max width 1920px, JPEG quality 65. This is critical for Vercel. The DocImage component base64-encodes images inline, so uncompressed 3-4MB screenshots cause FALLBACK_BODY_TOO_LARGE errors.

---

## Homepage patterns

1. Hero section: product title and subtitle
2. Hero cards: two image cards (Overview, Interface Guide) using screenshots with gradient overlay
3. Getting Started banner: green banner with CTA buttons
4. Browse by section: image card grids for Detection Layers and Use Cases (auto-fill responsive grid)

Hero cards use img tags with objectFit cover over a gradient overlay. Browse cards have thumbnail, title, short description, and link to the respective page.

---

## MDX gotchas

- Self-closing tags cause "Unexpected closing slash" errors in MDX. Use open+close tags instead
- Less-than followed by a number (e.g. below 0.5) is parsed as JSX. Spell out "below"
- Image syntax with exclamation mark triggers zsh history expansion. Use heredoc for Python scripts
- Curly quotes vs straight quotes cause string match failures
- Markdown inside JSX blocks does not get prose styling. Use pure JSX or separate prose div with className
- Never use sed for file edits. Use Python for all CLI file modifications
- Sub-tables in markdown merge with the table above if there is no blank line separating them

*April 2026*
