'use strict';
// Verräter an Bord – kleiner Server: liefert die Seite aus und führt das Spiel über WebSocket (/ws).
const http = require('http');
const fs = require('fs');
const path = require('path');
const spiel = require('./spiel')();

const PORT = Number(process.env.PORT) || 10000;
const OEFFENTLICH = path.join(__dirname, 'public');
const TYPEN = { '.html':'text/html; charset=utf-8', '.woff2':'font/woff2', '.txt':'text/plain; charset=utf-8' };
const DATEIEN = new Set(['index.html', 'vendor/barlow-semi-condensed-600.woff2', 'vendor/barlow-semi-condensed-800.woff2', 'vendor/OFL-Barlow.txt']);

const server = http.createServer((req, res) => {
  const pfad = new URL(req.url, 'http://x').pathname;
  if (req.method !== 'GET' && req.method !== 'HEAD'){ res.writeHead(405); return res.end(); }
  if (pfad === '/healthz'){ res.writeHead(200, { 'Content-Type':'application/json' }); return res.end('{"ok":true}'); }
  const datei = pfad === '/' ? 'index.html' : pfad.slice(1);
  if (!DATEIEN.has(datei)){ res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' }); return res.end('Nicht gefunden'); }
  res.writeHead(200, {
    'Content-Type':TYPEN[path.extname(datei)],
    'Cache-Control':datei === 'index.html' ? 'no-cache' : 'public, max-age=604800'
  });
  fs.createReadStream(path.join(OEFFENTLICH, datei)).pipe(res);
});

server.on('upgrade', (req, socket, kopf) => {
  if (new URL(req.url, 'http://x').pathname !== '/ws'){ socket.write('HTTP/1.1 404 Not Found\r\n\r\n'); socket.destroy(); return; }
  spiel.upgrade(req, socket, kopf);
});

server.listen(PORT, () => console.log(`Verräter an Bord läuft auf http://localhost:${PORT}`));
