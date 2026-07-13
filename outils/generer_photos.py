#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
============================================================
 FRANCK G. PHOTOGRAPHIE — GÉNÉRATEUR DE LA LISTE DES PHOTOS
============================================================
Ce script est FACULTATIF : la galerie fonctionne très bien en
modifiant photos.js à la main.

Ce qu'il fait :
  1. il parcourt les sous-dossiers de images/
     (sauf "accueil" et "partage") ;
  2. il retrouve toutes les images (.webp, .avif, .jpg, .png) ;
  3. il réécrit le fichier photos.js.

Ce qu'il CONSERVE de votre photos.js actuel :
  - les textes "alt" que vous avez déjà écrits ;
  - les libellés de catégories que vous avez personnalisés ;
  - le bloc REGLAGES (filigrane).

Comment l'utiliser (depuis le dossier du projet) :
    python outils/generer_photos.py

Pour obtenir aussi les proportions des images ("ratio"),
installez une seule fois la petite bibliothèque Pillow :
    pip install Pillow
(sans Pillow, le script fonctionne quand même, simplement
sans le champ "ratio").
============================================================
"""

from __future__ import annotations

import json
import math
import re
import sys
from datetime import date
from pathlib import Path

# ------------------------------------------------------------
# Réglages du script
# ------------------------------------------------------------
RACINE = Path(__file__).resolve().parent.parent
DOSSIER_IMAGES = RACINE / "images"
FICHIER_PHOTOS = RACINE / "photos.js"

EXTENSIONS_IMAGES = {".webp", ".avif", ".jpg", ".jpeg", ".png"}

# Dossiers de images/ qui ne sont PAS des catégories de la galerie
DOSSIERS_IGNORES = {"accueil", "partage"}

# Ordre d'affichage des catégories connues ; les nouvelles
# catégories seront ajoutées ensuite, par ordre alphabétique.
ORDRE_CONNU = ["preparatifs", "decoration", "couple", "groupes", "soiree"]

# Libellés proposés par défaut (modifiables ensuite dans photos.js)
LABELS_PAR_DEFAUT = {
    "preparatifs": "Préparatifs",
    "decoration": "Décoration",
    "couple": "Couple",
    "groupes": "Groupes",
    "soiree": "Soirée",
    "ceremonie": "Cérémonie",
    "cocktail": "Cocktail",
}

REGLAGES_PAR_DEFAUT = (
    "const REGLAGES = {\n"
    "  filigrane: true,\n"
    "  texteFiligrane: \"© Franck G. Photographie\",\n"
    "};"
)

EN_TETE = """/* ============================================================
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
"""


# ------------------------------------------------------------
# Petites fonctions utilitaires
# ------------------------------------------------------------
def texte_js(valeur: str) -> str:
    """Transforme un texte en chaîne JavaScript correctement échappée."""
    return json.dumps(valeur, ensure_ascii=False)


def alt_par_defaut(nom_fichier: str) -> str:
    """Fabrique un texte alternatif lisible à partir du nom du fichier.
    Exemple : "couple-mariage-albi-01.webp" -> "Couple mariage albi 01"."""
    base = Path(nom_fichier).stem
    base = re.sub(r"[-_]+", " ", base).strip()
    if not base:
        return "Photo de mariage"
    return base[0].upper() + base[1:]


def label_par_defaut(dossier: str) -> str:
    if dossier in LABELS_PAR_DEFAUT:
        return LABELS_PAR_DEFAUT[dossier]
    propre = re.sub(r"[-_]+", " ", dossier).strip()
    return propre[:1].upper() + propre[1:] if propre else dossier


def decoder_chaine(brut: str) -> str:
    """Décode une chaîne extraite du fichier JS (gestion des \\" etc.)."""
    try:
        return json.loads('"' + brut + '"')
    except Exception:
        return brut


def lire_fichier_existant() -> tuple[dict, dict, str]:
    """Retourne (alts existants, labels existants, bloc REGLAGES existant)."""
    alts: dict[str, str] = {}
    labels: dict[str, str] = {}
    bloc_reglages = REGLAGES_PAR_DEFAUT

    if not FICHIER_PHOTOS.exists():
        return alts, labels, bloc_reglages

    texte = FICHIER_PHOTOS.read_text(encoding="utf-8")

    # Textes alternatifs déjà écrits : { src: "...", ... alt: "..." }
    for objet in re.finditer(r"\{[^{}]*\}", texte):
        bloc = objet.group(0)
        m_src = re.search(r'src\s*:\s*"((?:[^"\\]|\\.)*)"', bloc)
        m_alt = re.search(r'alt\s*:\s*"((?:[^"\\]|\\.)*)"', bloc)
        if m_src and m_alt:
            alts[decoder_chaine(m_src.group(1))] = decoder_chaine(m_alt.group(1))

    # Libellés de catégories personnalisés
    for m in re.finditer(
        r'\{\s*id\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*label\s*:\s*"((?:[^"\\]|\\.)*)"',
        texte,
    ):
        labels[decoder_chaine(m.group(1))] = decoder_chaine(m.group(2))

    # Bloc REGLAGES conservé tel quel
    m = re.search(r"const\s+REGLAGES\s*=\s*\{.*?\};", texte, re.S)
    if m:
        bloc_reglages = m.group(0)

    return alts, labels, bloc_reglages


def calculer_ratio(chemin: Path) -> str | None:
    """Retourne les proportions de l'image, par exemple "3/2"
    (nécessite Pillow ; sinon renvoie None sans erreur)."""
    try:
        from PIL import Image  # type: ignore
    except ImportError:
        return None
    try:
        with Image.open(chemin) as image:
            largeur, hauteur = image.size
        diviseur = math.gcd(largeur, hauteur)
        return f"{largeur // diviseur}/{hauteur // diviseur}"
    except Exception:
        return None


# ------------------------------------------------------------
# Programme principal
# ------------------------------------------------------------
def principal() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # affichage correct des accents
    except Exception:
        pass

    if not DOSSIER_IMAGES.is_dir():
        print("✗ Le dossier images/ est introuvable.")
        print("  Lancez ce script depuis le dossier du projet :")
        print("      python outils/generer_photos.py")
        return 1

    alts_existants, labels_existants, bloc_reglages = lire_fichier_existant()

    # 1. Catégories = sous-dossiers de images/
    dossiers = sorted(
        d.name
        for d in DOSSIER_IMAGES.iterdir()
        if d.is_dir() and d.name not in DOSSIERS_IGNORES
    )
    ordonnes = [d for d in ORDRE_CONNU if d in dossiers]
    ordonnes += [d for d in dossiers if d not in ORDRE_CONNU]

    if not ordonnes:
        print("✗ Aucun dossier de catégorie trouvé dans images/.")
        return 1

    # 2. Images de chaque catégorie
    photos_par_categorie: dict[str, list[dict]] = {}
    pillow_disponible = True
    total = 0

    for categorie in ordonnes:
        fichiers = sorted(
            f
            for f in (DOSSIER_IMAGES / categorie).iterdir()
            if f.is_file() and f.suffix.lower() in EXTENSIONS_IMAGES
        )
        entrees = []
        for fichier in fichiers:
            src = f"images/{categorie}/{fichier.name}"
            ratio = calculer_ratio(fichier)
            if ratio is None:
                pillow_disponible = False
            entrees.append(
                {
                    "src": src,
                    "category": categorie,
                    "alt": alts_existants.get(src, alt_par_defaut(fichier.name)),
                    "ratio": ratio,
                }
            )
            total += 1
        photos_par_categorie[categorie] = entrees

    # 3. Écriture de photos.js
    lignes: list[str] = [EN_TETE, ""]

    lignes.append("/* ---------- LES CATÉGORIES ----------")
    lignes.append('   "id"    = nom du dossier dans images/ (sans accents ni espaces)')
    lignes.append('   "label" = texte affiché sur le bouton de filtre               */')
    lignes.append("const CATEGORIES = [")
    largeur_id = max(len(c) for c in ordonnes)
    for categorie in ordonnes:
        label = labels_existants.get(categorie, label_par_defaut(categorie))
        espaces = " " * (largeur_id - len(categorie))
        lignes.append(
            f'  {{ id: "{categorie}",{espaces} label: {texte_js(label)} }},'
        )
    lignes.append("];")
    lignes.append("")
    lignes.append("")

    lignes.append("/* ---------- LES RÉGLAGES ----------")
    lignes.append("   filigrane : true  = affiche un petit texte discret sur la photo")
    lignes.append("               false = aucun filigrane                             */")
    lignes.append(bloc_reglages)
    lignes.append("")
    lignes.append("")

    lignes.append("/* ---------- LES PHOTOS ----------")
    lignes.append(f"   Liste générée automatiquement le {date.today().strftime('%d/%m/%Y')}.")
    lignes.append("   Les textes \"alt\" déjà présents ont été conservés :")
    lignes.append("   vous pouvez continuer à les modifier librement.            */")
    lignes.append("const PHOTOS = [")

    for categorie in ordonnes:
        label = labels_existants.get(categorie, label_par_defaut(categorie))
        lignes.append("")
        lignes.append(f"  /* ----- {label} ----- */")
        if not photos_par_categorie[categorie]:
            lignes.append("  // (aucune photo dans ce dossier pour le moment)")
        for photo in photos_par_categorie[categorie]:
            morceaux = [
                f'src: {texte_js(photo["src"])}',
                f'category: "{photo["category"]}"',
                f'alt: {texte_js(photo["alt"])}',
            ]
            if photo["ratio"]:
                morceaux.append(f'ratio: "{photo["ratio"]}"')
            lignes.append("  { " + ", ".join(morceaux) + " },")

    lignes.append("")
    lignes.append("];")
    lignes.append("")

    FICHIER_PHOTOS.write_text("\n".join(lignes), encoding="utf-8")

    # 4. Petit compte rendu
    print(f"✓ photos.js mis à jour : {total} photo(s) dans {len(ordonnes)} catégorie(s).")
    for categorie in ordonnes:
        print(f"   - {categorie} : {len(photos_par_categorie[categorie])} photo(s)")
    if not pillow_disponible:
        print("ℹ Pillow n'est pas installé : le champ \"ratio\" n'a pas été ajouté.")
        print("  (facultatif) Pour l'ajouter :  pip install Pillow")
    return 0


if __name__ == "__main__":
    sys.exit(principal())
