import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fontPreloadPlugin, seoPlugin } from './config/seo-plugin.ts'

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), seoPlugin(), fontPreloadPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2022',
      cssMinify: true,
      reportCompressedSize: true,
      rolldownOptions: {
        output: {
          // Stable vendor chunks: they change rarely, so browsers keep them cached across deploys.
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'router', test: /node_modules[\\/]react-router[\\/]/ },
              { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/ },
            ],
          },
        },
      },
    },
  }
})
