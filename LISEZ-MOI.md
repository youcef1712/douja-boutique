# Douja — Boutique Jupe Satin 🛍️

Site de vente professionnel pour votre jupe en satin (3 500 DA), prêt à l'emploi.
**Paiement à la livraison · 58 wilayas · 100 % responsive (mobile + PC).**

---

## ▶️ Ouvrir le site
Double-cliquez sur **`index.html`**. Il s'ouvre dans votre navigateur. Rien à installer.

---

## ✏️ À personnaliser (3 choses importantes)

### 1) Votre numéro WhatsApp / téléphone
✅ **Déjà configuré** avec le numéro **06 65 31 91 69** (WhatsApp `213665319169`).
Pour le changer : dans **`js/script.js`** (`const WHATSAPP = "213665319169";`) et
dans **`index.html`** (liens `wa.me/213665319169`, `tel:+213665319169` et le
numéro affiché `06 65 31 91 69`).

### 🌍 Version arabe (العربية)
Le site est **bilingue Français / Arabe** avec mise en page **RTL** automatique.
Un bouton **« العربية / FR »** en haut à droite bascule la langue (le choix est
mémorisé). Pour modifier des traductions arabes : objet `AR` dans **`js/script.js`**.

### 2) Vos vraies photos
Mettez vos photos dans le dossier **`images/`** puis, dans **`index.html`**,
ajoutez sur les blocs `.product-photo` un style `--img`. Exemple :
```html
<div class="product-photo" style="--img:url('images/jupe-1.jpg')"></div>
```
Tant que vous n'ajoutez pas de photo, un joli aperçu satiné coloré s'affiche
automatiquement (selon la couleur choisie).

### 3) Le prix et les frais de livraison
- **Prix** : dans `js/script.js`, variable `const PRICE = 3500;`
  (et le texte « 3 500 DA » dans `index.html` si vous changez le prix).
- **Frais par wilaya** : dans `js/script.js`, tableau `WILAYAS`
  → chaque ligne = `["Nom", fraisDomicile, fraisBureau]`. Ajustez selon votre livreur.

---

## ✅ Ce qui est déjà inclus
- Page de vente complète (hero, produit, atouts, avis, FAQ, CTA).
- Choix **couleur** (6 teintes) et **taille** (S–XL), synchronisés avec la commande.
- **Formulaire de commande** : nom, téléphone, wilaya (58), commune, livraison
  (domicile / bureau), couleur, taille, quantité.
- **Total calculé en direct** (produit + livraison selon la wilaya).
- **Validation** des champs (téléphone algérien, champs requis).
- **Confirmation** + bouton « Envoyer la commande sur WhatsApp » pré-rempli.
- Barre de commande fixe sur mobile + bouton WhatsApp flottant.
- Lien Instagram **@douja.19** déjà branché.

> Les commandes sont aussi sauvegardées dans le navigateur (localStorage,
> clé `douja_orders`) — pratique en attendant un vrai serveur.

---

## 📊 Activer Google Sheets (tableau des commandes)
1. Crée un Google Sheet vide sur https://sheets.new
2. Menu **Extensions → Apps Script**.
3. Efface tout et colle ce code :
```js
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date','Nom','Téléphone','Wilaya','Commune','Livraison','Produit','Couleur','Taille','Quantité','Livraison(DA)','Total(DA)','Note']);
    }
    sheet.appendRow([data.date, data.name, data.phone, data.wilaya, data.commune,
      data.delivery, data.product, data.color, data.size, data.qty, data.ship, data.total, data.note]);
    return ContentService.createTextOutput(JSON.stringify({success:true}));
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success:false}));
  }
}
```
4. **Déployer → Nouveau déploiement → Type : Application Web**.
5. « Qui peut accéder » → **Tout le monde** → **Déployer** (autorise l'accès).
6. Copie l'**URL de l'application Web** (se termine par `/exec`).
7. Colle-la dans `js/script.js` → `const GSHEET_URL = "...";`

## ⚙️ Réglages avancés (dans `js/script.js`)
- **Livraison offerte** dès X jupes : `const FREE_SHIP_QTY = 2;`
- **Stock affiché** par couleur : objet `STOCK = { "Bordeaux": 7, ... }`
- **Durée du compte à rebours** : `Date.now() + 24 * 3600 * 1000` (24 h, glissant).
- **Notifications « vient de commander »** : tableau `people` (noms + villes).

> Ces éléments (compte à rebours, stock, notifications) servent à rassurer et
> créer un sentiment d'urgence — pratiques courantes des boutiques en ligne.
> Vous pouvez les ajuster ou les retirer librement.

## 🚀 Mettre en ligne (gratuit)
Le site est 100 % statique. Vous pouvez l'héberger gratuitement sur :
- **Netlify** (glisser-déposer le dossier sur app.netlify.com/drop),
- **Vercel**, **GitHub Pages**, ou **Cloudflare Pages**.

Pensez à remplacer `images/og.jpg` par une belle photo : c'est l'aperçu
affiché quand vous partagez le lien sur Instagram / WhatsApp.
