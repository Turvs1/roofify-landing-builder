
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
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
          
          // Radix UI components - split by category for better tree shaking
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
          if (id.includes('@radix-ui/react-scroll-area') || id.includes('@radix-ui/react-hover-card')) {
            return 'radix-ui-interactive';
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
          
          // Supabase - split into smaller chunks
          if (id.includes('@supabase/supabase-js')) {
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
          
          // Split remaining node_modules into much smaller chunks
          if (id.includes('node_modules')) {
            // Group by package type - more granular splitting
            if (id.includes('@types/') || id.includes('typescript')) {
              return 'types';
            }
            if (id.includes('postcss') || id.includes('autoprefixer') || id.includes('tailwindcss')) {
              return 'css-tools';
            }
            if (id.includes('eslint') || id.includes('stylelint')) {
              return 'linting';
            }
            if (id.includes('vite') || id.includes('rollup')) {
              return 'build-tools';
            }
            
            // Split by package name for better granularity
            if (id.includes('node_modules/react-helmet')) {
              return 'react-helmet';
            }
            if (id.includes('node_modules/react-resizable')) {
              return 'react-resizable';
            }
            if (id.includes('node_modules/embla-carousel')) {
              return 'embla-carousel';
            }
            if (id.includes('node_modules/date-fns')) {
              return 'date-fns';
            }
            if (id.includes('node_modules/zod')) {
              return 'zod';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'lucide-react';
            }
            if (id.includes('node_modules/sonner')) {
              return 'sonner';
            }
            if (id.includes('node_modules/next-themes')) {
              return 'next-themes';
            }
            if (id.includes('node_modules/vaul')) {
              return 'vaul';
            }
            if (id.includes('node_modules/cmdk')) {
              return 'cmdk';
            }
            if (id.includes('node_modules/input-otp')) {
              return 'input-otp';
            }
            
            // Group remaining packages by size category
            if (id.includes('node_modules/')) {
              // Extract package name from path
              const packageMatch = id.match(/node_modules\/([^/]+)/);
              if (packageMatch) {
                const packageName = packageMatch[1];
                // Group small packages together
                if (packageName.startsWith('@')) {
                  return 'at-packages';
                }
                if (packageName.length <= 5) {
                  return 'short-packages';
                }
                if (packageName.length <= 10) {
                  return 'medium-packages';
                }
                return 'long-packages';
              }
            }
            
            // Default vendor chunk for other dependencies
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
    host: "::",
    port: 8080,
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
}))
