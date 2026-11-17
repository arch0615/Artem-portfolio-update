import type { IncomingMessage } from 'node:http'
import type { Plugin } from 'vite'

/**
 * Serves the Vercel functions in /api during `npm run dev`, so the contact form
 * can be exercised locally without the Vercel CLI. Production uses the real
 * Vercel runtime; this plugin is dev-only.
 */

type Handler = (request: Request) => Promise<Response> | Response

const routes: Record<string, string> = {
  '/api/contact': '/api/contact.ts',
}

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  return Buffer.concat(chunks)
}

export function devApiPlugin(): Plugin {
  return {
    name: 'portfolio-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? '').split('?')[0]
        const modulePath = routes[pathname]
        if (!modulePath) return next()

        try {
          const mod = (await server.ssrLoadModule(modulePath)) as Record<string, Handler | undefined>
          const method = (req.method ?? 'GET').toUpperCase()
          const handler = mod[method]
          if (!handler) {
            res.statusCode = 405
            res.end('Method Not Allowed')
            return
          }

          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value)
          }
          const body = method === 'GET' || method === 'HEAD' ? undefined : await readBody(req)
          const request = new Request(new URL(req.url ?? '/', `http://${req.headers.host}`), {
            method,
            headers,
            body: body ? new Uint8Array(body) : undefined,
          })

          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          server.config.logger.error(`[dev-api] ${String(error)}`)
          res.statusCode = 500
          res.end('Internal Server Error')
        }
      })
    },
  }
}
