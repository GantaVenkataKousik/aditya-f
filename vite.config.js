import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ultra-optimized for memory usage
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext', // Modern browsers only for smaller build
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // 4kb
    rollupOptions: {
      output: {
        // Hard-code specific chunking strategy
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['react-icons', 'react-toastify'],
          'vendor-utils': ['axios'],
          'vendor-carousel': ['react-responsive-carousel']
        }
      }
    }
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
