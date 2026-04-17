#!/bin/bash
set -e

echo ""
echo "  PRODOC Scaffolder"
echo "  ================="
echo ""

if [ -z "$1" ]; then
  read -p "  Project name (kebab-case): " PROJECT_NAME
else
  PROJECT_NAME=$1
fi

if [ -z "$PROJECT_NAME" ]; then
  echo "  Error: Project name is required."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  Creating $PROJECT_NAME..."
echo ""

npx create-next-app@latest "$PROJECT_NAME" \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack

cd "$PROJECT_NAME"

echo ""
echo "  Installing dependencies..."
npm install next-mdx-remote gray-matter remark-gfm fuse.js pdf-lib puppeteer-core @sparticuz/chromium-min jspdf
npm install @tailwindcss/typography lucide-react clsx tailwind-merge class-variance-authority @base-ui/react

echo ""
echo "  Initializing shadcn/ui..."
npx shadcn@latest init -y
npx shadcn@latest add separator scroll-area badge

echo ""
echo "  Copying template files..."
cp -r "$SCRIPT_DIR/template/src/components/"* src/components/
cp -r "$SCRIPT_DIR/template/src/lib/"* src/lib/
cp -r "$SCRIPT_DIR/template/src/app/" src/
cp -r "$SCRIPT_DIR/template/content" .
mkdir -p private/images/docs
mkdir -p public/images/docs

echo ""
echo "  Adding .gitignore entries..."
echo "" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "private/" >> .gitignore

echo ""
echo "  Creating .env.example..."
cat > .env.example << ENVEOF
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
VERCEL_BYPASS_FALLBACK_OVERSIZED_ERROR=1
ENVEOF

echo ""
echo "  Done! Next steps:"
echo ""
echo "  1. cd $PROJECT_NAME"
echo "  2. Update product name in:"
echo "     - src/components/doc-header.tsx"
echo "     - src/components/sidebar.tsx"
echo "     - src/components/mobile-nav.tsx"
echo "     - src/app/page.tsx"
echo "  3. Add MDX content to content/docs/"
echo "  4. Add images to private/images/docs/"
echo "  5. npm run dev"
echo "  6. vercel --prod"
echo ""
