import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',            
    setupFiles: './src/setupTests.js', 
    globals: true,                   
    restoreMocks: true,             
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/main.jsx', 'src/setupTests.js'],
      reporter: ['text', 'html'],
    },
  },
})
