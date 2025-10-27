import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
   server: {
    proxy: {
      '/api': {
        target: 'http://13.125.141.226:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    allowedHosts: [
      'suborbicularly-bushlike-rodolfo.ngrok-free.dev', // 🔹 ngrok 도메인 추가
    ],}
})
