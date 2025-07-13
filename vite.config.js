import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import { componentTagger } from "lovable-tagger";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(), 
    tailwindcss(),
    // Add gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Add brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),

    mode === "development" && componentTagger(),
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

  
}))
