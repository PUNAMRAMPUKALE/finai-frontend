import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: { include: ['pdfjs-dist'] },
  server: {
  port: 5173,
   proxy: {
      // anything starting with /api goes to FastAPI
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // no rewrite needed because your backend already serves at /api/...
        // rewrite: (p) => p,   // (keep default)
      },
    },
}

})
