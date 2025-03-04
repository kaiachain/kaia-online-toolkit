import { defineConfig } from 'vite'
import svgr from '@svgr/rollup'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: { overrides: { removeViewBox: false } },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@/consts',
        replacement: '/src/consts',
      },
      {
        find: '@/common',
        replacement: '/src/common',
      },
      {
        find: '@/animation',
        replacement: '/src/animation',
      },
      {
        find: '@/components',
        replacement: '/src/components',
      },
      {
        find: '@/images',
        replacement: '/src/images',
      },
      {
        find: '@/hooks',
        replacement: '/src/hooks',
      },
      {
        find: '@/types',
        replacement: '/src/types',
      },
    ],
  },
})
