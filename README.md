# mot_m-anger 🍕

Petit **jeu de mots mélangés** jouable dans le navigateur : retrouve le mot caché à partir de lettres mélangées, avant la fin du temps !

## 🎮 Jouer

Ouvre simplement `index.html` dans un navigateur (aucune installation nécessaire) — ou rendez-vous sur la version en ligne si elle est déployée.

## ✨ Fonctionnalités

- 3 niveaux de difficulté (Facile / Moyen / Difficile), 5 mots par partie
- Clic sur les lettres pour reconstituer le mot (ou clic sur une case déjà remplie pour retirer la lettre)
- Chronomètre avec barre de progression
- Score avec bonus de temps, et **meilleur score sauvegardé** (`localStorage`)
- Indices (2 par mot) et bouton pour mélanger les lettres
- Interface responsive, jouable sur mobile
- Mots 100 % en français

## 🛠 Stack

- HTML5
- CSS3
- JavaScript (vanilla, sans dépendance)

## 📁 Structure

```
index.html       # interface du jeu
style.css        # styles (responsive)
words.js         # listes de mots par difficulté
script.js        # logique du jeu
```

## 🚧 Roadmap

- [x] Logique de mélange et de vérification des mots
- [x] Interface de jeu et niveaux
- [x] Indices, scores, chronomètre
- [ ] Ajout d'une banque de mots plus large
- [ ] Modes de jeu supplémentaires (contre-la-montre, sans faute)

---

Auteur : [Samuel HOUSSOU](https://github.com/Samuel-12094) — houssousamuel454@gmail.com