import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    port: 5173, // default Vite dev server port
    proxy: {
      // Proxy API requests to Spring Boot backend
      '/api': 'http://localhost:8080'
    }
  }
})
