import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Su GitHub Pages project site l'app vive in https://<utente>.github.io/<repo>/ .
// La GitHub Action passa VITE_BASE="/<repo>/"; in locale resta "/".
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      // Genera tutte le icone PNG/maskable/apple-touch da un solo SVG.
      pwaAssets: {
        image: 'public/icon.svg',
      },
      manifest: {
        name: 'Amsterdam Explorer',
        short_name: 'Explorer',
        description: 'Avventura interattiva per piccoli esploratori ad Amsterdam.',
        lang: 'it',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#07111F',
        theme_color: '#07111F',
      },
      workbox: {
        // Tutto l'essenziale in precache => l'app si apre offline dopo la prima visita.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2,json}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
