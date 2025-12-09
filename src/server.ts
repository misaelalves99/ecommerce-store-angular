// src/server.ts
import 'zone.js/node';

import express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { CommonEngine } from '@angular/ssr';

import bootstrap from './main.server';

// Nome do app (usado na pasta dist)
const APP_NAME = 'ecommerce-store-angular';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), `dist/${APP_NAME}/browser`);
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index.html';

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Arquivos estáticos (CSS, JS, imagens)
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    }),
  );

  // Todas as outras rotas passam pelo Angular SSR
  server.get('*', (req, res, next) => {
    commonEngine
      .render({
        bootstrap,
        documentFilePath: join(distFolder, indexHtml),
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      })
      .then((html) => res.send(html))
      .catch((err) => {
        console.error('Erro ao renderizar SSR:', err);
        next(err);
      });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`✅ Node Express server ouvindo em http://localhost:${port}`);
  });
}

run();

// Exporta o bootstrap SSR caso o builder do Angular precise
export * from './main.server';
