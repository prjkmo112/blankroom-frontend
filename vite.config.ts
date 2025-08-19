import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import vitteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitteTsConfigPaths(),
    svgr({ svgrOptions: { icon: true, svgo: true } }),
    tailwindcss()
  ],
})