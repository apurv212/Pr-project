import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // Add gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Add brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    })
  ],
  build: {
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          lucide: ['lucide-react']
        }
      }
    },
    // Enable minification
    minify: 'terser',
    // Optimize assets
    assetsInlineLimit: 4096,
    // Enable source maps for production debugging (optional)
    sourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
})
