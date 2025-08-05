import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' && process.env.VERCEL ? '/' : '/morent-guide/',
  plugins: [react()],
  server: {
    host: true,
    port: 8888,
    strictPort: false,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
