import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@core': resolve(__dirname, './src/core'),
      '@plugins': resolve(__dirname, './src/plugins'),
      '@shared': resolve(__dirname, './src/shared'),
      '@assets': resolve(__dirname, './src/assets'),
    },
  },
  base: './',
})