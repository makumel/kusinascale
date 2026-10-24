import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        let rawBody = '';
        req.on('data', (chunk) => { rawBody += chunk; });
        req.on('end', async () => {
          let body = {};
          if (rawBody) {
            try { body = JSON.parse(rawBody); } catch {}
          }
          const mockReq = {
            method: req.method,
            headers: req.headers,
            query: Object.fromEntries(new URL(req.url!, `http://${req.headers.host || 'localhost'}`).searchParams),
            body
          };
          const mockRes = {
            setHeader(k: string, v: string) { res.setHeader(k, v); },
            status(code: number) { res.statusCode = code; return this; },
            json(data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
            end() { res.end(); }
          };

          try {
            if (req.url?.startsWith('/api/suggestions')) {
              const { default: handler } = await import('./api/suggestions.ts');
              await handler(mockReq, mockRes);
              return;
            }
            if (req.url?.startsWith('/api/costings')) {
              const { default: handler } = await import('./api/costings.ts');
              await handler(mockReq, mockRes);
              return;
            }
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
            return;
          }
          next();
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiDevPlugin(),
  ],
  server: {
    host: true,
    allowedHosts: true,
  },
});
