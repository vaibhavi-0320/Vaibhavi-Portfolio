import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_ROUTES = ['inkbyte', 'resume-download']

/**
 * Runs the functions in api/ during `npm run dev`, the way Vercel runs them in
 * production. Secrets go in .env.local (see .env.example).
 */
function localApi(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = (req.url ?? '').split('?')[0].replace(/^\//, '')
        if (!API_ROUTES.includes(name)) return next()
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)
        const { POST, GET } = await server.ssrLoadModule(`/api/${name}.ts`)
        const request = new Request(`http://localhost/api/${name}`, {
          method: req.method,
          headers: { 'content-type': 'application/json', 'x-forwarded-for': req.socket.remoteAddress ?? '' },
          body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
        })
        const response: Response = req.method === 'POST' ? await POST(request) : GET()
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        res.end(await response.text())
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Server-side only: non-VITE_ variables never reach the browser bundle.
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) process.env[key] ??= value
  return {
    plugins: [react(), tailwindcss(), localApi()],
  }
})
