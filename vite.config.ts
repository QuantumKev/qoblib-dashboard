import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: https://quantumkev.github.io/qoblib-dashboard/
const repoBase = process.env.GITHUB_ACTIONS ? '/qoblib-dashboard/' : '/'

export default defineConfig({
  base: repoBase,
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
