import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 6901,
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        // Vite dev server runs on :6901, proxy /api → backend :8080
      },
    },
  },
})
