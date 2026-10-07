/* =====================================================================
   MODE HORS LIGNE – Page d'accueil « Les jeux du Labyrinthe » (/home/)
   ---------------------------------------------------------------------
   Quand le visiteur ouvre la page d'accueil (à l'entrée, avec du réseau),
   ce fichier télécharge à l'avance les fichiers des DEUX jeux dans la
   mémoire du téléphone (mémoire commune « labyrinthe-jeux »).

   Ensuite, chaque jeu utilise son propre fichier hors ligne (sw.js placé
   dans son dossier) pour s'ouvrir sans réseau à partir de cette mémoire.

   ⚠️ SI VOUS MODIFIEZ CE FICHIER : augmentez le numéro de VERSION.
   ===================================================================== */

const VERSION = 'home-v2';
const CACHE = 'labyrinthe-jeux';        // mémoire commune aux deux jeux et à l'accueil
const DELAI_RESEAU_MS = 4000;

// Fichiers téléchargés à l'avance. Un fichier absent est simplement ignoré.
const FICHIERS = [
  // Page d'accueil
  '/home/',
  '/home/img/challenge-logo.png',
  '/home/img/fond.webp',
  '/home/img/logo-zarlor.png',

  // Challenge des Experts (fichiers actuels, inchangés)
  '/challenge-des-experts/',
  '/challenge-des-experts/Challenge%20des%20expert%202026.png',
  '/challenge-des-experts/width_1599.webp',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',

  // Le Zarlor Vivant (liste complétée lors de sa livraison)
  '/zarlor-vivant/',
  '/zarlor-vivant/style.css',
  '/zarlor-vivant/app.js',
  '/zarlor-vivant/data/zarlor.json',
  '/zarlor-vivant/lib/html5-qrcode.min.js',
  '/zarlor-vivant/img/logo-zarlor.png'
];

// Feuilles de style Google Fonts (accueil + Challenge) : les fichiers de police sont aussi téléchargés.
const POLICES = [
  'https://fonts.googleapis.com/css2?family=Chewy&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
];

const HOTES_EXTERNES = ['fonts.googleapis.com', 'fonts.gstatic.com', 'unpkg.com', 'cdn.jsdelivr.net'];

/* ---------- Outils ---------- */

// Clé d'enregistrement : adresse sans ?token= / ?espece= / ?lang=
function cleDe(url) {
  const u = new URL(url, self.location.origin);
  if (u.origin === self.location.origin) {
    u.search = '';
    if (u.pathname.endsWith('/index.html')) u.pathname = u.pathname.slice(0, -10);
    if (['/home', '/challenge-des-experts', '/zarlor-vivant'].includes(u.pathname)) u.pathname += '/';
  }
  u.hash = '';
  return u.toString();
}

async function nettoyer(rep) {
  if (!rep || !rep.redirected) return rep;
  return new Response(await rep.blob(), { status: rep.status, statusText: rep.statusText, headers: rep.headers });
}

async function telecharger(cache, adresse) {
  try {
    const externe = !adresse.startsWith('/');
    const rep = await fetch(new Request(adresse, { cache: 'reload', mode: externe ? 'cors' : 'same-origin' }));
    if (rep.ok) await cache.put(cleDe(adresse), await nettoyer(rep));
  } catch (e) { /* absent ou pas de réseau : ignoré */ }
}

async function telechargerPolices(cache, css) {
  try {
    const rep = await fetch(css, { mode: 'cors', cache: 'reload' });
    if (!rep.ok) return;
    const texte = await rep.clone().text();
    await cache.put(css, rep);
    const fichiers = [...texte.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m => m[1]);
    await Promise.all(fichiers.map(f => telecharger(cache, f)));
  } catch (e) { /* ignoré */ }
}

/* ---------- Installation ---------- */

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all([
      ...FICHIERS.map(f => telecharger(cache, f)),
      ...POLICES.map(p => telechargerPolices(cache, p))
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Nettoyage d'une ancienne version éventuelle (on ne touche jamais à la mémoire commune)
    const noms = await caches.keys();
    await Promise.all(noms.filter(n => n.startsWith('labyrinthe-v')).map(n => caches.delete(n)));
    await self.clients.claim();
    (await self.clients.matchAll({ type: 'window' })).forEach(c => c.postMessage({ type: 'precache-termine' }));
  })());
});

/* ---------- Ouverture de la page d'accueil ---------- */

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (url.pathname.endsWith('/sw.js') || url.pathname.endsWith('.pdf')) return;
    event.respondWith(reseauPuisCopie(event));
  } else if (HOTES_EXTERNES.includes(url.hostname)) {
    event.respondWith(copiePuisReseau(req));
  }
});

async function reseauPuisCopie(event) {
  const req = event.request;
  const cle = cleDe(req.url);
  const cache = await caches.open(CACHE);
  const reseau = fetch(req).then(async rep => {
    if (rep && rep.ok) await cache.put(cle, await nettoyer(rep.clone()));
    return rep;
  });
  event.waitUntil(reseau.catch(() => {}));
  const delai = new Promise(r => setTimeout(r, DELAI_RESEAU_MS, null));
  try {
    const rep = await Promise.race([reseau, delai]);
    if (rep && rep.ok) return await nettoyer(rep);
    if (rep && rep.status === 404) return rep;
  } catch (e) {}
  const copie = await cache.match(cle);
  if (copie) return copie;
  try { return await reseau; } catch (e) {}
  return new Response('<p style="font-family:sans-serif;padding:24px">Pas de réseau / No network 🌿</p>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

async function copiePuisReseau(req) {
  const cache = await caches.open(CACHE);
  const copie = await cache.match(cleDe(req.url));
  if (copie) return copie;
  try {
    const rep = await fetch(req);
    if (rep && rep.ok) cache.put(cleDe(req.url), rep.clone());
    return rep;
  } catch (e) { return new Response('', { status: 504 }); }
}
