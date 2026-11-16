import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    
      allowedHosts: ['dev.petmap.es', 'localhost', '192.168.1.129']
  },

})
