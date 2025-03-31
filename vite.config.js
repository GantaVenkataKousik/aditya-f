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
        manualChunks(id) {
          // Group larger dependencies into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('axios') || id.includes('react-toastify')) {
              return 'vendor-utils';
            }
            if (id.includes('react-icons') || id.includes('recharts') || id.includes('react-apexcharts')) {
              return 'vendor-charts';
            }
            if (id.includes('react-responsive-carousel')) {
              return 'vendor-carousel';
            }
            return 'vendor'; // all other node_modules
          }
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
