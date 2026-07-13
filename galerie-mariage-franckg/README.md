# Galerie mariage — Franck G. Photographie

Un site vitrine élégant, sous forme d'album photo de mariage, à envoyer aux futurs mariés.
Il fonctionne sans base de données, sans serveur et s'héberge **gratuitement sur GitHub Pages**.

Ce guide est écrit pour une personne qui n'a **jamais** utilisé GitHub. Suivez-le dans l'ordre, étape par étape.

---

## Sommaire

1. [Ce que contient le projet](#1-ce-que-contient-le-projet)
2. [Mettre le site en ligne sur GitHub Pages](#2-mettre-le-site-en-ligne-sur-github-pages)
3. [Ajouter une photo](#3-ajouter-une-photo)
4. [Retirer une photo](#4-retirer-une-photo)
5. [Ajouter une catégorie](#5-ajouter-une-catégorie)
6. [Remplacer l'image d'accueil](#6-remplacer-limage-daccueil)
7. [Image de partage et favicon](#7-image-de-partage-et-favicon)
8. [Modifier les textes et les liens](#8-modifier-les-textes-et-les-liens)
9. [Préparer et optimiser les photos](#9-préparer-et-optimiser-les-photos)
10. [Automatisation facultative](#10-automatisation-facultative--la-liste-des-photos-se-remplit-toute-seule)
11. [Qui peut modifier le site ? (sécurité)](#11-qui-peut-modifier-le-site--sécurité)
12. [Filigrane et protection des photos](#12-filigrane-et-protection-des-photos)
13. [Problèmes courants et solutions](#13-problèmes-courants-et-solutions)

---

## 1. Ce que contient le projet

```
galerie-mariage-franckg/
├── index.html                  ← la page du site
├── style.css                   ← l'apparence (couleurs, polices…)
├── script.js                   ← le fonctionnement (filtres, visionneuse…)
├── photos.js                   ← ★ LA LISTE DES PHOTOS (le seul fichier à modifier)
├── README.md                   ← ce guide
├── .gitignore                  ← fichiers à ignorer (technique)
│
├── images/
│   ├── accueil/
│   │   └── accueil.webp        ← la grande image d'introduction
│   ├── partage/
│   │   └── image-partage.jpg   ← l'image affichée sur Facebook / WhatsApp
│   ├── preparatifs/            ← vos photos "Préparatifs"
│   ├── decoration/             ← vos photos "Décoration"
│   ├── couple/                 ← vos photos "Couple"
│   ├── groupes/                ← vos photos "Groupes"
│   └── soiree/                 ← vos photos "Soirée"
│
├── favicon/                    ← les petites icônes du site
│   ├── favicon.svg
│   ├── favicon.png
│   └── apple-touch-icon.png
│
├── outils/
│   └── generer_photos.py       ← script facultatif (voir partie 10)
│
└── .github/workflows/
    └── generer-photos.yml      ← automatisation facultative (voir partie 10)
```

Des **photos d'exemple** sont déjà incluses : le site fonctionne immédiatement.
Vous les remplacerez ensuite par vos vraies photos.

> **À retenir** : au quotidien, vous ne touchez qu'à deux choses :
> les dossiers `images/…` (déposer vos photos) et le fichier `photos.js` (la liste des photos).

---

## 2. Mettre le site en ligne sur GitHub Pages

### Étape A — Créer un compte GitHub (une seule fois)

1. Ouvrez [github.com](https://github.com) et cliquez sur **Sign up**.
2. Choisissez un identifiant simple (par exemple `franckgphoto`) : il apparaîtra dans l'adresse du site.
3. Validez votre adresse e-mail. Le compte gratuit suffit.

### Étape B — Créer le dépôt (l'espace qui contiendra le site)

1. Une fois connecté, cliquez sur le bouton **+** en haut à droite, puis **New repository**.
2. **Repository name** : par exemple `galerie-mariage`
   (minuscules, sans espaces ni accents — ce nom apparaîtra dans l'adresse du site).
3. Laissez **Public** coché (voir partie 11 pour l'explication).
4. Ne cochez rien d'autre, puis cliquez sur **Create repository**.

### Étape C — Envoyer les fichiers du site

1. Sur votre ordinateur, **décompressez** le dossier du projet si nécessaire, puis ouvrez-le : vous devez voir `index.html`, `style.css`, etc.
2. Sur la page de votre dépôt GitHub, cliquez sur **uploading an existing file**
   (ou **Add file → Upload files** si le dépôt contient déjà quelque chose).
3. Sélectionnez **tout le contenu** du dossier du projet (fichiers **et** dossiers `images`, `favicon`, `outils`, `.github`) et glissez-le dans la page GitHub.
   💡 Vous pouvez glisser des dossiers entiers : GitHub garde leur organisation.
4. Attendez la fin de l'envoi, puis cliquez sur le bouton vert **Commit changes**.

> `index.html` doit être **à la racine** du dépôt (visible directement sur la page d'accueil du dépôt), pas dans un sous-dossier.

### Étape D — Activer GitHub Pages

1. Dans votre dépôt, ouvrez l'onglet **Settings** (en haut).
2. Dans le menu de gauche, cliquez sur **Pages**.
3. Sous **Build and deployment → Source**, choisissez **Deploy from a branch**.
4. Sous **Branch** : choisissez **main**, puis le dossier **/(root)**.
5. Cliquez sur **Save**.

### Étape E — Récupérer l'adresse du site

1. Patientez 1 à 3 minutes, puis rechargez la page **Settings → Pages**.
2. Un encadré affiche : *Your site is live at* suivi de l'adresse, du type :

```
https://VOTRE-IDENTIFIANT.github.io/galerie-mariage/
```

3. Ouvrez cette adresse : votre galerie est en ligne. 🎉
   C'est **ce lien** que vous enverrez aux futurs mariés.

### Étape F — Dernière petite finition (recommandé)

Dans le fichier `index.html`, remplacez les 3 adresses
`https://VOTRE-IDENTIFIANT.github.io/NOM-DU-DEPOT/` par votre vraie adresse
(voir partie 8 pour savoir comment modifier un fichier sur GitHub).
Cela améliore le référencement et l'aperçu lors des partages.

---

## 3. Ajouter une photo

**En 2 étapes, directement depuis le site GitHub** (ordinateur, tablette ou téléphone) :

### Étape 1 — Déposer le fichier image

1. Ouvrez votre dépôt sur GitHub, puis le dossier de la catégorie,
   par exemple `images` → `couple`.
2. Cliquez sur **Add file → Upload files**.
3. Glissez votre photo (déjà optimisée, voir partie 9), par exemple
   `couple-mariage-albi-01.webp`.
4. Cliquez sur **Commit changes**.

### Étape 2 — Ajouter la photo dans la liste

1. Revenez à la racine du dépôt et ouvrez le fichier `photos.js`.
2. Cliquez sur le **crayon** ✏️ (Edit this file), en haut à droite.
3. Dans la liste `PHOTOS`, ajoutez une ligne dans la section de la catégorie :

```js
{ src: "images/couple/couple-mariage-albi-01.webp", category: "couple", alt: "Séance photo de couple au coucher du soleil" },
```

4. Vérifiez la **virgule en fin de ligne**, puis cliquez sur **Commit changes**.
5. Après 1 à 2 minutes, rechargez le site : la photo est en ligne.

**Les 3 informations de chaque ligne :**

| Champ | Rôle | Exemple |
|---|---|---|
| `src` | Le chemin du fichier (dossier + nom exact) | `"images/couple/couple-mariage-albi-01.webp"` |
| `category` | Le nom du dossier / de la catégorie | `"couple"` |
| `alt` | Une courte description (accessibilité + légende) | `"Séance photo de couple au coucher du soleil"` |

Un 4ᵉ champ facultatif, `ratio` (par exemple `ratio: "3/2"`), indique les proportions de l'image et évite les petits sauts de mise en page. Vous pouvez l'omettre.

> ⚠️ Le nom dans `src` doit être **exactement identique** au nom du fichier envoyé, majuscules et extension comprises (`Photo-01.WEBP` ≠ `photo-01.webp`).

---

## 4. Retirer une photo

1. Ouvrez `photos.js`, cliquez sur le crayon ✏️.
2. Supprimez la ligne complète de la photo (de `{` jusqu'à `},`).
3. Cliquez sur **Commit changes**.

Pour supprimer aussi le fichier image : ouvrez l'image dans son dossier sur GitHub → bouton **⋯** (en haut à droite) → **Delete file** → **Commit changes**. (Facultatif : une image absente de `photos.js` n'apparaît de toute façon plus sur le site.)

---

## 5. Ajouter une catégorie

Exemple avec une catégorie **Cérémonie** :

1. **Créer le dossier** : dans `images/`, cliquez sur **Add file → Create new file**, tapez `ceremonie/a-supprimer.txt` (le `/` crée le dossier), puis **Commit changes**. Déposez ensuite vos photos dans ce dossier et supprimez le fichier `a-supprimer.txt`.
2. **Déclarer la catégorie** : dans `photos.js`, ajoutez une ligne dans `CATEGORIES` :

```js
{ id: "ceremonie", label: "Cérémonie" },
```

- `id` = le nom du dossier, **sans accents, espaces ni majuscules** ;
- `label` = le texte du bouton, avec accents si vous voulez.

3. **Ajouter les photos** dans la liste `PHOTOS` avec `category: "ceremonie"`.

Le bouton de filtre apparaît automatiquement. Pour supprimer une catégorie : retirez sa ligne de `CATEGORIES` et les photos correspondantes de `PHOTOS`.

---

## 6. Remplacer l'image d'accueil

1. Préparez une photo **horizontale** (environ 2000 px de large, format WebP, voir partie 9).
2. Renommez-la exactement : `accueil.webp`
3. Sur GitHub, ouvrez `images/accueil/`, puis **Add file → Upload files**, déposez le fichier et validez : il **remplace automatiquement** l'ancien (même nom = remplacement).

Astuce : choisissez une image pas trop chargée au centre, car le titre s'affiche par-dessus.

---

## 7. Image de partage et favicon

- **Image de partage** (aperçu sur Facebook / WhatsApp) : remplacez
  `images/partage/image-partage.jpg` par une image **1200 × 630 px** en JPG, même nom de fichier. Pensez à compléter les adresses dans `index.html` (partie 8).
- **Favicon** (petite icône dans l'onglet) : remplacez les fichiers du dossier `favicon/` en gardant les mêmes noms (`favicon.svg`, `favicon.png` 96×96 px, `apple-touch-icon.png` 180×180 px).

---

## 8. Modifier les textes et les liens

Pour modifier un fichier sur GitHub : ouvrez le fichier → crayon ✏️ → modifiez → **Commit changes**.

Tout se trouve dans `index.html` :

| Quoi | Où le trouver dans `index.html` |
|---|---|
| Titre de l'onglet + description Google | Balises `<title>` et `<meta name="description">` |
| Adresse du site (référencement + partage) | Les 3 lignes contenant `VOTRE-IDENTIFIANT.github.io/NOM-DU-DEPOT` |
| Grand titre de la page | `<h1>Histoires de mariage <em>en images</em></h1>` |
| Texte d'introduction | Paragraphe `class="heros-texte"` |
| Lien vers le site principal | Les liens `https://www.franckgphotographie.fr` (en-tête et pied de page) |
| Lien Mariages.net | Le lien `https://www.mariages.net/photo-mariage/franck-g--e155408` — **vérifiez-le** en le comparant à l'adresse exacte de votre vitrine |
| Mention de bas de page | `© Franck G. Photographie — Tous droits réservés` |

Le **filigrane** se règle dans `photos.js`, bloc `REGLAGES` (voir partie 12).

---

## 9. Préparer et optimiser les photos

Des photos bien préparées = un site rapide, même avec beaucoup d'images.

**Réglages recommandés :**

- format : **WebP** (ou AVIF) ;
- largeur maximale : **1600 à 2000 pixels** ;
- qualité : **75 à 85 %** ;
- poids visé : **moins de 400 Ko** par photo ;
- noms de fichiers : **sans espaces, sans accents, en minuscules**,
  par exemple : `couple-mariage-albi-01.webp`
  (❌ `Photo Mariée n°1.jpg` → ✅ `photo-mariee-01.webp`).

**Méthode simple et gratuite, sans installation :**

1. Ouvrez [squoosh.app](https://squoosh.app) dans votre navigateur.
2. Glissez votre photo.
3. À droite : **Resize** → largeur `1800` px, puis format **WebP**, qualité `80`.
4. Téléchargez le fichier, renommez-le proprement, c'est prêt.

Pour traiter beaucoup de photos d'un coup, un logiciel gratuit comme **XnConvert** (Windows/Mac) fait la même chose par lot : redimensionner à 1800 px + exporter en WebP qualité 80.

---

## 10. Automatisation facultative : la liste des photos se remplit toute seule

Le site fonctionne parfaitement avec la méthode manuelle (partie 3). Deux aides facultatives existent :

### Option A — Le robot GitHub (recommandé si vous ajoutez souvent des photos)

Le fichier `.github/workflows/generer-photos.yml` est déjà inclus. Une fois le projet en ligne, à chaque fois que vous **déposez ou supprimez des images** dans `images/…`, un robot GitHub met à jour `photos.js` automatiquement (1 à 2 minutes). Votre routine devient simplement :

1. ouvrir le dossier de la catégorie ;
2. **Add file → Upload files** → déposer les photos → **Commit changes** ;
3. c'est tout. ✨

Détails utiles :

- il **conserve** les textes `alt` que vous avez déjà personnalisés ;
- pour les nouvelles photos, il fabrique un `alt` à partir du nom du fichier
  (d'où l'intérêt de noms parlants comme `couple-coucher-soleil-01.webp`) — vous pouvez ensuite l'améliorer à la main dans `photos.js` ;
- il calcule aussi le champ `ratio` (proportions) pour une mise en page plus stable ;
- vous pouvez le lancer manuellement : onglet **Actions** → *Mettre à jour la liste des photos* → **Run workflow** ;
- pour vous en passer : supprimez ce fichier `.yml`, rien d'autre ne change.

À la toute première utilisation, GitHub peut demander d'autoriser les workflows : onglet **Actions** → bouton vert d'activation.

### Option B — Le script sur votre ordinateur

Si Python est installé sur votre machine, ouvrez un terminal dans le dossier du projet et lancez :

```
python outils/generer_photos.py
```

Il reconstruit `photos.js` à partir du contenu des dossiers (mêmes garanties que le robot). Facultatif : `pip install Pillow` pour qu'il ajoute aussi les proportions des images.

---

## 11. Qui peut modifier le site ? (sécurité)

**La règle est simple :**

- 👀 **Tout le monde peut regarder** la galerie (c'est le but : vous envoyez le lien aux mariés).
- ✏️ **Vous seul pouvez la modifier**, car ajouter ou retirer des photos nécessite d'être **connecté à votre compte GitHub**, protégé par votre mot de passe (activez la double authentification dans les réglages GitHub : *Settings → Password and authentication*).

C'est une vraie protection : GitHub **est** votre interface d'administration sécurisée.

**Points importants à comprendre :**

- GitHub Pages est un hébergement *statique* : un "code d'accès" écrit dans le JavaScript de la page serait visible par n'importe qui et ne protégerait rien. C'est pourquoi ce projet n'en utilise pas, volontairement.
- **Aucun mot de passe ni clé secrète ne figure dans le code** de ce site — et il ne faut jamais en ajouter.
- Le dépôt est **public** : c'est ce qui rend l'hébergement gratuit. Les fichiers du dépôt sont donc visibles, mais ce sont exactement les mêmes photos que celles déjà publiées sur le site. (Publier un site GitHub Pages depuis un dépôt **privé** nécessite un abonnement payant GitHub Pro.)
- N'ajoutez jamais de "collaborateur" au dépôt, sauf à une personne de confiance : un collaborateur peut modifier le site.

Si un jour vous souhaitez une interface d'administration plus visuelle, des services comme **Decap CMS** s'ajoutent par-dessus GitHub Pages avec une vraie connexion sécurisée par votre compte GitHub — mais leur installation est plus technique et n'est pas nécessaire pour ce site.

---

## 12. Filigrane et protection des photos

Dans `photos.js`, bloc `REGLAGES` :

```js
const REGLAGES = {
  filigrane: true,                                // true = affiché, false = masqué
  texteFiligrane: "© Franck G. Photographie",     // le texte du filigrane
};
```

Quand `filigrane` vaut `true`, un texte discret s'affiche sur la photo agrandie.

**Protections déjà en place :**

- glisser-déposer des images bloqué ;
- clic droit désactivé **uniquement sur les photos** (le reste du site garde un clic droit normal) ;
- filigrane léger activable ;
- les photos publiées sont en résolution web (1600–2000 px), pas vos fichiers haute définition.

**Honnêteté importante :** aucune technique ne peut empêcher totalement une capture d'écran ou un téléchargement. Ces protections découragent la copie occasionnelle, sans dégrader l'expérience des visiteurs. La meilleure protection reste de ne publier que des versions web de vos images.

---

## 13. Problèmes courants et solutions

| Problème | Cause probable | Solution |
|---|---|---|
| La page affiche une erreur **404** | GitHub Pages pas encore activé, ou `index.html` pas à la racine | Refaites l'étape D de la partie 2 ; vérifiez que `index.html` est visible sur la page d'accueil du dépôt ; patientez 2–3 minutes |
| Une carte affiche **« Image introuvable »** | Le chemin dans `photos.js` ne correspond pas exactement au fichier | Comparez lettre à lettre : dossier, nom, majuscules/minuscules, extension (`.webp` vs `.jpg`), espaces ou accents dans le nom |
| **La galerie est vide** avec le message « liste introuvable » | `photos.js` absent ou mal nommé | Vérifiez que `photos.js` est à la racine, à côté de `index.html` |
| La galerie est vide **sans message** | Erreur de frappe dans `photos.js` (virgule ou guillemet manquant) | Rouvrez votre dernière modification et vérifiez : chaque ligne finit par `},` et chaque texte est entre guillemets `"..."`. Sur ordinateur, la touche **F12** → onglet *Console* indique la ligne fautive |
| Mes modifications **n'apparaissent pas** | Le site met 1–2 min à se republier, ou votre navigateur garde l'ancienne version en mémoire | Attendez 2 minutes puis rechargez en forçant : **Ctrl + F5** (Windows) ou **Cmd + Maj + R** (Mac) ; sur téléphone, ouvrez en navigation privée |
| Le site est **lent** | Photos trop lourdes | Repassez les images dans Squoosh (partie 9) : 1800 px de large, WebP qualité 80 |
| L'onglet **Actions** montre une croix rouge ❌ | Le robot facultatif a rencontré un souci | Cliquez dessus pour lire le détail ; au besoin, supprimez `.github/workflows/generer-photos.yml` et gérez `photos.js` à la main |
| Les **accents** s'affichent bizarrement (Ã©…) | Fichier enregistré dans un mauvais encodage | Modifiez les fichiers directement sur GitHub, ou enregistrez-les en **UTF-8** dans votre éditeur |
| L'aperçu **Facebook / WhatsApp** ne montre pas la bonne image | Adresses `og:` non complétées, ou cache de Facebook | Complétez les 3 adresses dans `index.html` (partie 2, étape F), puis forcez la mise à jour sur [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/) |
| Une photo apparaît **déformée ou coupée** dans la mosaïque | (Ne devrait pas arriver : la mosaïque respecte les proportions) | Vérifiez que l'image d'origine n'est pas elle-même recadrée ; supprimez un éventuel champ `ratio` erroné |

---

**Bon mariage(s) ! 📸**
En cas de doute, relisez la partie 3 : dans 95 % des cas, tout se joue dans `photos.js` — une ligne par photo, une virgule à la fin.
