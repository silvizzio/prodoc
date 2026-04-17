# prodoc

A reusable documentation site template for technical platform products. Ships a complete, deployable docs site with sidebar navigation, search, PDF export, responsive mobile layout, and structured MDX content authoring. No CMS, no separate design system, no starting from scratch.

## What you get

- Sidebar navigation with section grouping and auto-generated table of contents
- Command palette search (Fuse.js, Cmd+K) with keyboard navigation
- Per-page and full-guide PDF export (Puppeteer, server-side)
- Responsive layout with hamburger sidebar on mobile
- Side-by-side image + text layouts (ImageSide component)
- Private image pipeline: base64-encoded JPEG rendered on canvas (no public URLs)
- MDX content with custom components (callouts, tables, keyboard badges)
- Structured LOD-based content patterns with sub-tables for multi-value fields
- Homepage with hero cards, CTA banner, and browsable section grids
- Vercel deployment with auto-deploy from GitHub

## Stack

Next.js 16 App Router, MDX (next-mdx-remote), Tailwind v4, shadcn/ui, Fuse.js, Puppeteer, pdf-lib, Pillow

## Quick start

```bash
git clone https://github.com/silvizzio/prodoc.git
cd prodoc
./scaffold.sh my-project-docs
```

The scaffold script handles everything: creates the Next.js project, installs dependencies, initializes shadcn/ui, and copies all template files (components, layouts, lib, placeholder content). After scaffolding:

1. Update product name in doc-header, sidebar, mobile-nav, and homepage
2. Add your MDX content to content/docs/
3. Add screenshots to private/images/docs/ and compress with Pillow
4. Run `npm run dev` to preview
5. Deploy with `vercel --prod`

## Template files included

The `template/` folder contains all production-ready components:

| Category | Files |
|---|---|
| Components | doc-header, sidebar, toc, mobile-nav, search-box, doc-image, canvas-image, mdx-components, print-button, full-guide-button, prev-next |
| Layouts | root layout, docs layout, doc page renderer |
| API routes | PDF generation, image serving |
| Lib | MDX file reader, search index builder |
| Content | placeholder MDX pages, homepage |

## Customization

After scaffolding, update these files for your product:

| File | What to change |
|---|---|
| src/components/doc-header.tsx | Product name, logo |
| src/components/sidebar.tsx | Logo, product name, version |
| src/components/mobile-nav.tsx | Product name, version |
| src/app/page.tsx | Hero title, subtitle, section links |
| src/app/api/pdf/route.ts | Header/footer strings |
| content/docs/ | All MDX content |

## Content authoring workflow

The fastest way to populate a PRODOC site is to use Claude (or similar AI) to generate MDX content from your product screenshots:

1. Export all relevant screens from Figma (overview, detail views, cropped panels, toolbar)
2. Upload screenshots to Claude and describe the content structure you need
3. Claude reads the UI content from screenshots and generates MDX pages following the structured table pattern (Field, Example, Context)
4. Copy the generated MDX into content/docs/ and the images into private/images/docs/
5. Do a light QA pass for accuracy (field names, values, classifications). Most of the structure and formatting will be correct out of the box

This workflow can produce a 13-page documentation site in a single working day with minimal manual editing.

## Documentation

See [PRODOC.md](./PRODOC.md) for the full reference: content patterns, image pipeline, responsive layout details, MDX gotchas, and PDF setup.

---

*April 2026*
