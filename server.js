'use strict';
// Verräter an Bord – kleiner Server: liefert die Seite aus und führt das Spiel über WebSocket (/ws).
// Zugang nur mit dem gemeinsamen Passwort aus ZUGANG_PASSWORT (siehe zugang.js).
const http = require('http');
const fs = require('fs');
const path = require('path');
const zugang = require('./zugang')({ titel:'Verräter an Bord' });
const spiel = require('./spiel')({ hatZugang:zugang.hatZugang });

const PORT = Number(process.env.PORT) || 10000;
const OEFFENTLICH = path.join(__dirname, 'public');
const TYPEN = { '.html':'text/html; charset=utf-8', '.woff2':'font/woff2', '.txt':'text/plain; charset=utf-8' };
const DATEIEN = new Set(['index.html', 'vendor/barlow-semi-condensed-600.woff2', 'vendor/barlow-semi-condensed-800.woff2', 'vendor/OFL-Barlow.txt']);

const server = http.createServer((req, res) => {
  const pfad = new URL(req.url, 'http://x').pathname;
  if (pfad === '/datenschutz' || pfad === '/datenschutz.html'){
    res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-cache' });
    return fs.createReadStream(path.join(__dirname, 'datenschutz.html')).pipe(res);
  }
  if (pfad === '/healthz'){ res.writeHead(200, { 'Content-Type':'application/json' }); return res.end('{"ok":true}'); }
  // Ohne Passwort-Cookie gibt es nur die Passwortseite
  if (zugang.pruefen(req, res)) return;
  if (req.method !== 'GET' && req.method !== 'HEAD'){ res.writeHead(405); return res.end(); }
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
