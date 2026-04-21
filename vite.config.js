import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/landing-page-20260421/',
  plugins: [react(), tailwindcss()],
})
