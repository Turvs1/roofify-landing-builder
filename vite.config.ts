
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and core libraries
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-core';
          }
          
          // Radix UI components - split by category
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-dropdown-menu') || id.includes('@radix-ui/react-select')) {
            return 'radix-ui-forms';
          }
          if (id.includes('@radix-ui/react-accordion') || id.includes('@radix-ui/react-collapsible') || id.includes('@radix-ui/react-tabs')) {
            return 'radix-ui-layout';
          }
          if (id.includes('@radix-ui/react-avatar') || id.includes('@radix-ui/react-badge') || id.includes('@radix-ui/react-progress')) {
            return 'radix-ui-display';
          }
          if (id.includes('@radix-ui/react-navigation-menu') || id.includes('@radix-ui/react-menubar') || id.includes('@radix-ui/react-context-menu')) {
            return 'radix-ui-navigation';
          }
          if (id.includes('@radix-ui/react-toast') || id.includes('@radix-ui/react-tooltip') || id.includes('@radix-ui/react-popover')) {
            return 'radix-ui-overlays';
          }
          if (id.includes('@radix-ui/react-checkbox') || id.includes('@radix-ui/react-radio-group') || id.includes('@radix-ui/react-switch')) {
            return 'radix-ui-inputs';
          }
          if (id.includes('@radix-ui/react-slider') || id.includes('@radix-ui/react-separator') || id.includes('@radix-ui/react-aspect-ratio')) {
            return 'radix-ui-controls';
          }
          
          // Utility libraries
          if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
            return 'utils';
          }
          
          // Form handling
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
            return 'forms';
          }
          
          // Large libraries that should be separate
          if (id.includes('jspdf')) {
            return 'jspdf';
          }
          
          // Supabase
          if (id.includes('@supabase')) {
            return 'supabase';
          }
          
          // React Query
          if (id.includes('@tanstack/react-query')) {
            return 'react-query';
          }
          
          // Date handling
          if (id.includes('date-fns') || id.includes('react-day-picker')) {
            return 'date-utils';
          }
          
          // Icons and UI components
          if (id.includes('lucide-react') || id.includes('sonner')) {
            return 'ui-components';
          }
          
          // Carousel and panels
          if (id.includes('embla-carousel') || id.includes('react-resizable-panels')) {
            return 'interactive-components';
          }
          
          // Theme handling
          if (id.includes('next-themes')) {
            return 'theme';
          }
          
          // Other specific libraries
          if (id.includes('cmdk')) {
            return 'cmdk';
          }
          if (id.includes('vaul')) {
            return 'vaul';
          }
          if (id.includes('input-otp')) {
            return 'input-otp';
          }
          
          // Default vendor chunk for other dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash].[ext]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 500, // Reduced from 1000 to catch more issues
    // Enable source maps for production debugging
    sourcemap: false,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096, // 4KB limit for inline assets
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
    ],
    exclude: [
      'jspdf',
    ],
  },
  // Server options for development
  server: {
    port: 8080,
    host: true,
    // Enable HMR
    hmr: {
      overlay: false,
    },
  },
  // CSS optimization
  css: {
    devSourcemap: false,
  },
  // Asset handling
  assetsInclude: ['**/*.pdf', '**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp'],
})
