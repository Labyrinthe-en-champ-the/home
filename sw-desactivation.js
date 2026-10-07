/* =====================================================================
   FICHIER DE SECOURS – à n'utiliser qu'en cas de problème.
   Pour désactiver le mode hors ligne de la page d'accueil :
   1. supprimez le fichier sw.js du dépôt ;
   2. renommez ce fichier-ci en sw.js.
   ===================================================================== */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await caches.delete('labyrinthe-jeux');
    await self.registration.unregister();
  })());
});
