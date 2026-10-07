# Page d'accueil « Les jeux du Labyrinthe »

Adresse : **https://labyrinthe-en-champ-the.github.io/home/** (dépôt `home`)
C'est cette adresse qu'il faut mettre dans le **QR code de l'entrée**.

## Contenu du dossier

| Fichier | À quoi il sert |
|---|---|
| `index.html` | La page d'accueil (textes FR et EN en bas du fichier, rubrique « TEXTES FR / EN ») |
| `sw.js` | Le mode hors ligne : enregistre les deux jeux sur le téléphone du visiteur |
| `sw-desactivation.js` | Fichier de secours, à utiliser seulement en cas de problème (voir plus bas) |
| `img/challenge-logo.png` | Logo du Challenge |
| `img/fond.webp` | Motif de fond à feuillages |
| `img/logo-zarlor.png` | **À ajouter par vous** : le logo du Zarlor (PNG à fond transparent). Tant qu'il n'est pas là, le titre s'affiche en texte. |

## Mettre à jour le dépôt `home`

1. Ouvrez le dépôt `home` sur github.com.
2. Supprimez les anciens fichiers mal placés, s'il y en a (par exemple `challenge-logo.png` ou `fond.webp` à la racine) : ouvrez le fichier, cliquez sur **⋯**, puis **Delete file** et **Commit changes**.
3. Cliquez sur **Add file**, puis **Upload files**.
4. Depuis le zip décompressé, glissez **`index.html`, `sw.js`, `sw-desactivation.js`, `LISEZMOI.md` ET le dossier `img` lui-même**. GitHub garde ainsi le dossier. Si GitHub demande de remplacer des fichiers, acceptez.
5. Cliquez sur **Commit changes**.
6. Vérifiez que la page d'accueil du dépôt montre bien un dossier **img** contenant `challenge-logo.png` et `fond.webp`.
7. Dans **Settings**, puis **Pages**, vérifiez que **Branch** est réglé sur `main` et `/ (root)`.

⚠️ Ne créez jamais de dossier nommé `challenge-des-experts` ou `zarlor-vivant` dans ce dépôt.

## Comment fonctionne le mode hors ligne

- À l'entrée, la page d'accueil télécharge les fichiers des deux jeux sur le téléphone.
- Pour qu'un jeu s'ouvre ensuite **sans réseau**, il doit aussi contenir son propre fichier `sw.js`.
  - **Le Zarlor** l'aura dès sa livraison.
  - **Le Challenge** l'aura avec le lot de modifications prévu (bouton Zarlor, scanner croisé, langue).
- En attendant, l'encart de la page affiche « Challenge des Experts : fonctionne avec le réseau uniquement 📶 ». C'est normal.

## Ajouter le logo du Zarlor

1. Ouvrez le dépôt, puis le dossier `img`.
2. Cliquez sur **Add file**, puis **Upload files**.
3. Déposez votre logo **renommé exactement** `logo-zarlor.png`.
4. Cliquez sur **Commit changes**. Le logo remplace automatiquement le titre en texte.

## Modifier un texte

1. Ouvrez `index.html` dans le dépôt, puis cliquez sur le crayon ✏️ (Edit).
2. Descendez jusqu'à la rubrique `TEXTES FR / EN`.
3. Modifiez le texte **entre les guillemets**, sans toucher au reste.
4. Cliquez sur **Commit changes**.

## Vérifications après la mise en ligne

- [ ] La page s'ouvre et le bouton EN/FR fonctionne.
- [ ] « Jouer au Challenge » ouvre bien le Challenge, dans la bonne langue.
- [ ] Le logo du Challenge et le motif de fond s'affichent.
- [ ] L'encart affiche « Challenge des Experts : fonctionne avec le réseau uniquement 📶 ». Après la mise à jour du Challenge, il affichera « prêt, même sans réseau ✅ ».
- [ ] **Test des QR existants** : réseau activé, scannez 3 ou 4 pancartes du Challenge (en français et en anglais). Tout doit fonctionner comme avant.

## En cas de problème avec le mode hors ligne

Les jeux continuent de marcher en ligne. Pour désactiver complètement le mode hors ligne :
1. supprimez `sw.js` du dépôt ;
2. renommez `sw-desactivation.js` en `sw.js`.

Les téléphones des visiteurs effaceront leurs copies à leur prochaine visite avec du réseau.
