import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import {defineConfig} from 'vite'
import {tanstackStart} from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

import {tailwindBreakpointsPlugin} from './src/lib/tailwind-breakpoints/vite-plugin.ts'

export default defineConfig({
  server: {
    proxy: {
      // `pnpm studio` serves Studio and its assets under /studio on port 3333.
      // Production serves the static Studio build from the same path instead.
      '^/studio(/|$)': {
        target: 'http://localhost:3333',
        ws: true,
        rewrite: (path) => (path === '/studio' ? '/studio/' : path),
      },
    },
  },
  plugins: [
    netlify({
      dev: {
        // Local edge emulation shells out to Deno, and this app has no edge
        // functions, so skip it.
        edgeFunctions: {enabled: false},
        // The `/studio` rewrites in netlify.toml would serve the last Studio
        // build from dist/ ahead of the dev proxy.
        redirects: {enabled: false},
      },
    }),
    tailwindcss(),
    tailwindBreakpointsPlugin(),
    tanstackStart(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
})
