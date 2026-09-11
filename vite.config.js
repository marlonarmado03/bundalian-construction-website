import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative asset paths make the site work on GitHub Pages repositories
// such as https://username.github.io/repository/ without changing this file.
export default defineConfig({
  base: '/bundalian-construction-website/',
  plugins: [react()],
})
