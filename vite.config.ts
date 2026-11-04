import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    cors: true,
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
    cors: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@react-pdf') || id.includes('pdfjs-dist') || id.includes('fontkit') || id.includes('png-js') || id.includes('yoga-layout')) {
              return 'vendor-pdf';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('@insforge') || id.includes('@supabase')) {
              return 'vendor-backend';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/') || id.includes('react\\')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
})
