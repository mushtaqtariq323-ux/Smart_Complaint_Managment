import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    /* SandboxOpaque-origin iframes (jaise preview panes) module scripts ko CORS
       se fetch karte hain (origin 'null') — in headers ke baghair modules block
       ho jate hain aur app black screen deti hai. */
    headers: { 'Access-Control-Allow-Origin': '*' },
    hmr: { protocol: 'wss', clientPort: 443 },
    proxy: {
      '/api': { target: `http://localhost:${process.env.PORT || 8787}`, changeOrigin: true },
    },
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy: { '/api': { target: 'http://localhost:8787', changeOrigin: true } },
  },
})
