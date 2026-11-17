import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fontPreloadPlugin, seoPlugin } from './config/seo-plugin.ts'
import { devApiPlugin } from './config/dev-api-plugin.ts'

export default defineConfig(({ mode }) => {
  // Expose server-only variables (RESEND_API_KEY, …) to the local /api emulation.
  // They are never bundled into client code — only VITE_* variables are.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    process.env[key] ??= value
  }

  return {
    plugins: [react(), tailwindcss(), seoPlugin(), fontPreloadPlugin(), devApiPlugin()],
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
