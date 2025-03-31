import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // More aggressive memory optimization
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild', // Uses less memory than terser
    sourcemap: false, // Disable sourcemaps to save memory
    rollupOptions: {
      output: {
        manualChunks: {
          // Explicitly chunk large dependencies
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['react-icons', 'react-toastify'],
          charts: ['react-apexcharts', 'recharts'],
          carousel: ['react-responsive-carousel']
        }
      }
    },
    // Build in smaller chunks
    assetsInlineLimit: 4096, // 4kb
  },
  server: {
    // Limit memory usage during development
    hmr: { overlay: false },
    middlewareMode: true
  },
  css: {
    // Minimize CSS processing
    postcss: {
      // Will be merged with your postcss.config.js
    }
  }
})
