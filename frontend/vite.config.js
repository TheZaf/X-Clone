import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` (development/production)
  const env = loadEnv(mode, process.cwd(), '')
  console.log("vite url", env.VITE_API_URL)
  
  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server:{
      port:8000,
      proxy:{
        "/api":{
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin:true
        }
      }
    }
  }
})