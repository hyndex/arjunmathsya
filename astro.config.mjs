// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// Canonical origin for canonical tags, social images, the sitemap and robots.txt:
// SITE_URL if set, else the project's production domain on Vercel (set automatically there), else the current public address.
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  'https://mathsya-connected-services.arjtha.chatgpt.site';

export default defineConfig({
  site,
  integrations: [
    react(),
    sitemap({ filter: (page) => !/\/(pitch|investor-brief|404)(\.html)?$/.test(page) }),
  ],

  // `file` output (about.html, platform.html…) matches the current host, which serves clean URLs
  // and also keeps legacy *.html links working.
  build: { format: 'file' },

  trailingSlash: 'never',

  // Static builds emit an instant meta-refresh page per entry; public/_redirects adds true 301s on hosts that support it.
  redirects: {
    '/pitch': '/investors',
    '/investor-brief': '/investors/brief',
  },

  devToolbar: { enabled: false },

  // Content-Security-Policy <meta> on every page (works on any static host). Scripts are hash-pinned;
  // 'wasm-unsafe-eval' lets the bundled Meshopt decoder compile WebAssembly for the 3D model.
  // Styles allow inline: server-rendered style="" attributes carry design tokens (Astro has no style-src-attr).
  security: {
    csp: {
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "connect-src 'self' blob:", // GLTFLoader fetches the model's embedded textures from blob: URLs
        "worker-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },

  markdown: { syntaxHighlight: false }, // no code blocks on this site; keeps the CSP free of Shiki's inline styles

  vite: {
    plugins: [tailwindcss()],
    // three.js (~1 MB) is one lazily loaded chunk, fetched only by pages that render 3D.
    build: { chunkSizeWarningLimit: 1100 },
  },
});