#!/bin/bash
# Script to update dependencies for Next.js 15

# Update Next.js and React
npm install next@latest react@latest react-dom@latest

# Update TypeScript
npm install typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest --save-dev

# Update ESLint related packages
npm install eslint@latest eslint-config-next@latest --save-dev

# Update Tailwind CSS and related packages
npm install tailwindcss@latest postcss@latest autoprefixer@latest @tailwindcss/typography@latest tailwindcss-animate@latest --save-dev

# Update shadcn UI related packages
npm install class-variance-authority@latest clsx@latest tailwind-merge@latest

# Update other important dependencies
npm install @vercel/analytics@latest @vercel/speed-insights@latest
npm install next-themes@latest

# Run the Next.js codemod to help with migration
npx @next/codemod@latest update-next-config-experimental .
npx @next/codemod@latest next-async-request-api .

echo "Packages updated successfully!"