import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// HTTPS is needed on mobile (camera + DeviceOrientation require secure context).
// On desktop dev, set VITE_NO_HTTPS=1 to skip the self-signed cert.
const useHttps = process.env.VITE_NO_HTTPS !== '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: useHttps ? [react(), basicSsl()] : [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
  },
})
