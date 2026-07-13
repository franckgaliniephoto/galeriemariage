/* ============================================================
   FRANCK G. PHOTOGRAPHIE — GALERIE MARIAGE
   Fonctionnement du site (aucune bibliothèque extérieure)
   ------------------------------------------------------------
   Vous n'avez PAS besoin de modifier ce fichier.
   Les photos et les catégories se gèrent dans photos.js
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Récupération des éléments de la page ---------- */
  var galerie   = document.getElementById("galerie-photos");
  var zoneFiltres = document.getElementById("filtres");
  var compteur  = document.getElementById("compteur");

  var visionneuse  = document.getElementById("visionneuse");
  var visImage     = document.getElementById("visionneuse-image");
  var visLegende   = document.getElementById("visionneuse-legende");
  var visCompteur  = document.getElementById("visionneuse-compteur");
  var visFiligrane = document.getElementById("visionneuse-filigrane");
  var btnFermer    = document.getElementById("visionneuse-fermer");
  var btnPrec      = document.getElementById("visionneuse-prec");
  var btnSuiv      = document.getElementById("visionneuse-suiv");

  /* ---------- État de la galerie ---------- */
  var listePhotos   = (typeof PHOTOS !== "undefined" && Array.isArray(PHOTOS)) ? PHOTOS : null;
  var listeCategories = (typeof CATEGORIES !== "undefined" && Array.isArray(CATEGORIES)) ? CATEGORIES : [];
  var reglages = (typeof REGLAGES !== "undefined" && REGLAGES) ? REGLAGES : {};

  var filtreActif    = "toutes";  // catégorie sélectionnée
  var photosVisibles = [];        // photos actuellement affichées
  var indexCourant   = 0;         // photo ouverte dans la visionneuse
  var elementAvantOuverture = null; // pour rendre le focus au clavier

  /* ============================================================
     FILTRES PAR CATÉGORIE
     ============================================================ */
  function creerFiltres() {
    var boutons = [{ id: "toutes", label: "Toutes les photos" }].concat(listeCategories);

    boutons.forEach(function (categorie) {
      var bouton = document.createElement("button");
      bouton.type = "button";
      bouton.className = "filtre";
      bouton.textContent = categorie.label;
      bouton.dataset.categorie = categorie.id;
      bouton.setAttribute("aria-pressed", categorie.id === filtreActif ? "true" : "false");
      if (categorie.id === filtreActif) bouton.classList.add("actif");

      bouton.addEventListener("click", function () {
        appliquerFiltre(categorie.id);
      });

      zoneFiltres.appendChild(bouton);
    });
  }

  function appliquerFiltre(idCategorie) {
    filtreActif = idCategorie;

    var tousLesBoutons = zoneFiltres.querySelectorAll(".filtre");
    tousLesBoutons.forEach(function (bouton) {
      var actif = bouton.dataset.categorie === idCategorie;
      bouton.classList.toggle("actif", actif);
      bouton.setAttribute("aria-pressed", actif ? "true" : "false");
    });

    afficherGalerie();
  }

  /* ============================================================
     AFFICHAGE DE LA MOSAÏQUE
     ============================================================ */
  function afficherGalerie() {
    galerie.innerHTML = "";

    if (!listePhotos) {
      afficherMessage(
        "La liste des photos est introuvable. Vérifiez que le fichier photos.js " +
        "est bien présent à la racine du site, à côté de index.html."
      );
      majCompteur(0);
      return;
    }

    photosVisibles = (filtreActif === "toutes")
      ? listePhotos.slice()
      : listePhotos.filter(function (photo) { return photo.category === filtreActif; });

    if (photosVisibles.length === 0) {
      afficherMessage("Aucune photo dans cette catégorie pour le moment.");
      majCompteur(0);
      return;
    }

    photosVisibles.forEach(function (photo, position) {
      var carte = document.createElement("button");
      carte.type = "button";
      carte.className = "carte-photo";
      carte.setAttribute("aria-label", "Agrandir la photo : " + (photo.alt || "photo de mariage"));

      var image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.alt || "";
      image.loading = "lazy";       // chargement différé
      image.decoding = "async";
      image.draggable = false;      // limite le glisser-déposer
      if (photo.ratio) {
        // Réserve l'espace de l'image avant son chargement
        // (évite les décalages de mise en page)
        image.style.aspectRatio = photo.ratio;
      }

      // Si le fichier est introuvable, on l'indique clairement
      // (très utile pour repérer une faute de frappe dans photos.js)
      image.addEventListener("error", function () {
        carte.classList.add("image-manquante");
        carte.innerHTML =
          '<p class="carte-erreur"><strong>Image introuvable</strong>' +
          "Vérifiez ce chemin dans photos.js : " + photo.src + "</p>";
      });

      carte.appendChild(image);
      carte.addEventListener("click", function () {
        ouvrirVisionneuse(position);
      });

      galerie.appendChild(carte);
    });

    majCompteur(photosVisibles.length);
  }

  function afficherMessage(texte) {
    var message = document.createElement("p");
    message.className = "galerie-message";
    message.textContent = texte;
    galerie.appendChild(message);
  }

  function majCompteur(nombre) {
    if (nombre === 0) {
      compteur.textContent = "";
      return;
    }
    var libelle = (filtreActif === "toutes")
      ? "toutes catégories"
      : trouverLabel(filtreActif);
    compteur.textContent = nombre + (nombre > 1 ? " photos — " : " photo — ") + libelle;
  }

  function trouverLabel(idCategorie) {
    for (var i = 0; i < listeCategories.length; i++) {
      if (listeCategories[i].id === idCategorie) return listeCategories[i].label;
    }
    return idCategorie;
  }

  /* ============================================================
     VISIONNEUSE (photo en grand)
     ============================================================ */
  // Secours pour les très vieux navigateurs
  var prochaineImage = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : function (fonction) { window.setTimeout(fonction, 16); };

  function ouvrirVisionneuse(position) {
    indexCourant = position;
    elementAvantOuverture = document.activeElement;

    document.addEventListener("keydown", surTouche);
    visionneuse.hidden = false;
    document.body.classList.add("defilement-bloque");
    chargerPhotoCourante();

    // Petite attente pour laisser la transition d'ouverture se jouer
    prochaineImage(function () {
      visionneuse.classList.add("ouverte");
    });

    btnFermer.focus();
  }

  function fermerVisionneuse() {
    visionneuse.classList.remove("ouverte");
    document.removeEventListener("keydown", surTouche);
    document.body.classList.remove("defilement-bloque");

    window.setTimeout(function () {
      visionneuse.hidden = true;
      visImage.src = "";
    }, 200);

    if (elementAvantOuverture && elementAvantOuverture.focus) {
      elementAvantOuverture.focus();
    }
  }

  function chargerPhotoCourante() {
    var photo = photosVisibles[indexCourant];
    if (!photo) return;

    visImage.classList.add("en-chargement");
    visImage.src = photo.src;
    visImage.alt = photo.alt || "";
    visImage.onload = function () { visImage.classList.remove("en-chargement"); };
    visImage.onerror = function () { visImage.classList.remove("en-chargement"); };

    visLegende.textContent = photo.alt || "";
    visCompteur.textContent = (indexCourant + 1) + " / " + photosVisibles.length;
    visFiligrane.textContent = reglages.filigrane ? (reglages.texteFiligrane || "") : "";

    prechargerVoisines();
  }

  function allerA(decalage) {
    var total = photosVisibles.length;
    if (total < 2) return;
    indexCourant = (indexCourant + decalage + total) % total;
    chargerPhotoCourante();
  }

  // Précharge la photo suivante et la précédente pour une navigation fluide
  function prechargerVoisines() {
    var total = photosVisibles.length;
    if (total < 2) return;
    [1, -1].forEach(function (decalage) {
      var voisine = photosVisibles[(indexCourant + decalage + total) % total];
      if (voisine) { var img = new Image(); img.src = voisine.src; }
    });
  }

  /* ---------- Clavier : Échap, flèches, Tab ---------- */
  function surTouche(evenement) {
    switch (evenement.key) {
      case "Escape":
        fermerVisionneuse();
        break;
      case "ArrowRight":
        allerA(1);
        break;
      case "ArrowLeft":
        allerA(-1);
        break;
      case "Tab":
        // Le focus reste à l'intérieur de la visionneuse
        evenement.preventDefault();
        var boutons = [btnFermer, btnPrec, btnSuiv];
        var actuel = boutons.indexOf(document.activeElement);
        var pas = evenement.shiftKey ? -1 : 1;
        var suivant = (actuel + pas + boutons.length) % boutons.length;
        boutons[suivant].focus();
        break;
    }
  }

  /* ---------- Tactile : balayage gauche / droite / bas ---------- */
  var toucheDepartX = 0;
  var toucheDepartY = 0;

  visionneuse.addEventListener("touchstart", function (evenement) {
    if (evenement.touches.length !== 1) return;
    toucheDepartX = evenement.touches[0].clientX;
    toucheDepartY = evenement.touches[0].clientY;
  }, { passive: true });

  visionneuse.addEventListener("touchend", function (evenement) {
    if (evenement.changedTouches.length !== 1) return;
    var deltaX = evenement.changedTouches[0].clientX - toucheDepartX;
    var deltaY = evenement.changedTouches[0].clientY - toucheDepartY;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      allerA(deltaX < 0 ? 1 : -1);       // balayage horizontal : photo suivante / précédente
    } else if (deltaY > 90 && Math.abs(deltaY) > Math.abs(deltaX)) {
      fermerVisionneuse();               // balayage vers le bas : fermeture
    }
  }, { passive: true });

  /* ---------- Souris : boutons et clic sur le fond ---------- */
  btnFermer.addEventListener("click", fermerVisionneuse);
  btnPrec.addEventListener("click", function () { allerA(-1); });
  btnSuiv.addEventListener("click", function () { allerA(1); });

  visionneuse.addEventListener("click", function (evenement) {
    // Un clic sur le fond sombre (hors photo et hors boutons) ferme la visionneuse
    if (evenement.target === visionneuse) fermerVisionneuse();
  });

  /* ============================================================
     PROTECTION LÉGÈRE DES PHOTOS
     ------------------------------------------------------------
     - le menu du clic droit est désactivé UNIQUEMENT sur les photos ;
     - le glisser-déposer des images est bloqué ;
     - le reste du site garde un clic droit normal.
     Important : aucune protection ne peut empêcher totalement
     une capture d'écran.
     ============================================================ */
  document.addEventListener("contextmenu", function (evenement) {
    if (evenement.target.closest(".carte-photo, .visionneuse-figure")) {
      evenement.preventDefault();
    }
  });

  document.addEventListener("dragstart", function (evenement) {
    if (evenement.target.closest(".carte-photo, .visionneuse-figure")) {
      evenement.preventDefault();
    }
  });

  /* ============================================================
     DÉMARRAGE
     ============================================================ */
  function demarrer() {
    creerFiltres();
    afficherGalerie();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})();
