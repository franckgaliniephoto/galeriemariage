/* ============================================================
   FRANCK G. PHOTOGRAPHIE — LISTE DES PHOTOS
   ============================================================
   C'EST LE SEUL FICHIER À MODIFIER POUR GÉRER LA GALERIE.

   ➊ AJOUTER UNE PHOTO (2 étapes)
      1. Déposez le fichier image dans le bon dossier,
         par exemple : images/couple/couple-mariage-albi-01.webp
      2. Ajoutez une ligne dans la liste PHOTOS ci-dessous :

         { src: "images/couple/couple-mariage-albi-01.webp",
           category: "couple",
           alt: "Séance photo de couple au coucher du soleil" },

      ⚠️ N'oubliez pas la virgule à la fin de chaque ligne
         (sauf éventuellement la toute dernière).

   ➋ RETIRER UNE PHOTO
      Supprimez sa ligne dans la liste PHOTOS
      (et, si vous voulez, le fichier image dans le dossier).

   ➌ "alt" = texte alternatif
      Courte description de la photo, utile pour l'accessibilité
      et le référencement. Elle sert aussi de légende dans la
      visionneuse.

   ➍ "ratio" (facultatif)
      Proportions de l'image (largeur/hauteur), par exemple "3/2".
      Cela évite les petits sauts de mise en page pendant le
      chargement. Vous pouvez l'omettre : tout fonctionne sans.

   Astuce : le script outils/generer_photos.py peut créer cette
   liste automatiquement à partir des dossiers (voir README.md).
   ============================================================ */


/* ---------- LES CATÉGORIES ----------
   "id"    = nom du dossier dans images/ (sans accents ni espaces)
   "label" = texte affiché sur le bouton de filtre               */
const CATEGORIES = [
  { id: "preparatifs", label: "Préparatifs" },
  { id: "decoration",  label: "Décoration" },
  { id: "couple",      label: "Couple" },
  { id: "groupes",     label: "Groupes" },
  { id: "soiree",      label: "Soirée" },
];


/* ---------- LES RÉGLAGES ----------
   filigrane : true  = affiche un petit texte discret sur la photo
               false = aucun filigrane                             */
const REGLAGES = {
  filigrane: true,
  texteFiligrane: "© Franck G. Photographie",
};


/* ---------- LES PHOTOS ----------
   Les photos ci-dessous sont des images d'exemple générées
   automatiquement : remplacez-les par vos vraies photos.        */
const PHOTOS = [

  /* ----- Préparatifs ----- */
  { src: "images/preparatifs/exemple-preparatifs-01.webp", category: "preparatifs", alt: "Photo d'exemple : préparatifs de la mariée, détail de la robe", ratio: "3/2" },
  { src: "images/preparatifs/exemple-preparatifs-02.webp", category: "preparatifs", alt: "Photo d'exemple : boutons de manchette du marié", ratio: "3/4" },
  { src: "images/preparatifs/exemple-preparatifs-03.webp", category: "preparatifs", alt: "Photo d'exemple : bouquet posé près de la fenêtre", ratio: "4/5" },

  /* ----- Décoration ----- */
  { src: "images/decoration/exemple-decoration-01.webp", category: "decoration", alt: "Photo d'exemple : table d'honneur fleurie", ratio: "3/2" },
  { src: "images/decoration/exemple-decoration-02.webp", category: "decoration", alt: "Photo d'exemple : arche de cérémonie en plein air", ratio: "3/4" },
  { src: "images/decoration/exemple-decoration-03.webp", category: "decoration", alt: "Photo d'exemple : détail du plan de table", ratio: "3/2" },

  /* ----- Couple ----- */
  { src: "images/couple/exemple-couple-01.webp", category: "couple", alt: "Photo d'exemple : séance de couple au coucher du soleil", ratio: "2/3" },
  { src: "images/couple/exemple-couple-02.webp", category: "couple", alt: "Photo d'exemple : les mariés dans les vignes", ratio: "3/2" },
  { src: "images/couple/exemple-couple-03.webp", category: "couple", alt: "Photo d'exemple : portrait des mariés en lumière douce", ratio: "3/4" },

  /* ----- Groupes ----- */
  { src: "images/groupes/exemple-groupes-01.webp", category: "groupes", alt: "Photo d'exemple : grande photo de groupe devant le domaine", ratio: "8/5" },
  { src: "images/groupes/exemple-groupes-02.webp", category: "groupes", alt: "Photo d'exemple : les témoins réunis autour des mariés", ratio: "3/2" },
  { src: "images/groupes/exemple-groupes-03.webp", category: "groupes", alt: "Photo d'exemple : famille rassemblée dans le parc", ratio: "4/3" },

  /* ----- Soirée ----- */
  { src: "images/soiree/exemple-soiree-01.webp", category: "soiree", alt: "Photo d'exemple : première danse des mariés", ratio: "3/2" },
  { src: "images/soiree/exemple-soiree-02.webp", category: "soiree", alt: "Photo d'exemple : lancer de lanternes à la nuit tombée", ratio: "2/3" },
  { src: "images/soiree/exemple-soiree-03.webp", category: "soiree", alt: "Photo d'exemple : piste de danse illuminée", ratio: "3/2" },

];
