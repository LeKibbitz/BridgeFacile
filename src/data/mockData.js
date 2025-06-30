// Données de test pour le ChatBot d'arbitrage Bridge
export const mockLaws = {
  "loi-1": {
    id: "loi-1",
    type: "loi",
    number: "1",
    title: "Le jeu de cartes",
    content: `
**A. Hiérarchie des cartes et des couleurs**

Les cartes de chaque couleur se classent dans l'ordre décroissant : As, Roi, Dame, Valet, 10, 9, 8, 7, 6, 5, 4, 3, 2.

Les couleurs se classent dans l'ordre décroissant : Pique (♠), Cœur (♥), Carreau (♦), Trèfle (♣).

**B. La face des cartes**

Chaque carte a une face et un dos. La face montre la couleur et la valeur de la carte.

**C. Le dos des cartes**

Le dos de toutes les cartes doit être identique.

*Voir également : Loi 2 (Les étuis de tournoi), Loi 13 (Nombre incorrect de cartes)*
    `,
    references: ["loi-2", "loi-13"],
    section: "Matériel et Procédures"
  },
  
  "loi-2": {
    id: "loi-2",
    type: "loi",
    number: "2", 
    title: "Les étuis de tournoi",
    content: `
Un étui de tournoi est un récipient dans lequel les cartes sont placées de façon à ce que chaque joueur puisse retirer sa main sans voir les cartes des autres joueurs.

L'étui est marqué pour indiquer :
- Le numéro de la donne
- La position du donneur
- La vulnérabilité

*Référence : Loi 1 (Le jeu de cartes), Loi 7 (Contrôle de l'étui et des cartes)*
    `,
    references: ["loi-1", "loi-7"],
    section: "Matériel et Procédures"
  },

  "loi-7": {
    id: "loi-7",
    type: "loi", 
    number: "7",
    title: "Contrôle de l'étui et des cartes",
    content: `
**A. Place de l'étui**

L'étui reste sur la table jusqu'à ce que le jeu soit terminé.

**B. Retirer les cartes de l'étui**

Chaque joueur retire ses cartes de la poche appropriée de l'étui et les compte pour vérifier qu'il en a treize.

**C. Remettre les cartes dans l'étui**

À la fin du jeu, chaque joueur remet ses cartes dans la poche appropriée de l'étui.

**D. Responsabilité pour ces procédures**

Chaque joueur est responsable de s'assurer que ses cartes sont remises dans la bonne poche.

*Voir : Loi 2 (Les étuis de tournoi), Loi 13 (Nombre incorrect de cartes), Loi 14 (Cartes manquantes)*
    `,
    references: ["loi-2", "loi-13", "loi-14"],
    section: "Matériel et Procédures"
  },

  "loi-13": {
    id: "loi-13",
    type: "loi",
    number: "13",
    title: "Nombre incorrect de cartes", 
    content: `
**A. Aucune déclaration faite**

Si un joueur a un nombre incorrect de cartes et qu'aucune déclaration n'a été faite, l'arbitre doit rectifier la situation.

**B. Découvert pendant les annonces ou le jeu**

Si l'irrégularité est découverte pendant la période des annonces ou du jeu, voir Loi 14 pour les cartes manquantes.

**C. Carte en trop**

Si un joueur a une carte en trop, cette carte est retirée au hasard et remise dans l'étui non utilisé.

**D. Jeu terminé**

Si l'irrégularité n'est découverte qu'après la fin du jeu, voir Loi 79 (Marque établie).

*Références : Loi 1 (Le jeu de cartes), Loi 14 (Cartes manquantes), Loi 79 (Marque établie)*
    `,
    references: ["loi-1", "loi-14", "loi-79"],
    section: "Irrégularités"
  },

  "loi-14": {
    id: "loi-14", 
    type: "loi",
    number: "14",
    title: "Carte(s) manquante(s)",
    content: `
**A. Main constatée incomplète avant le début du jeu**

Si une main est constatée incomplète avant le début du jeu, la ou les cartes manquantes sont recherchées.

**B. Main constatée incomplète par la suite**

Si l'irrégularité est découverte par la suite, la carte manquante est considérée comme ayant appartenu à la main déficiente pendant toute la durée du jeu.

**C. Information provenant de la restitution d'une carte**

Aucune information ne peut être tirée de la restitution d'une carte à une main déficiente.

*Voir : Loi 7 (Contrôle de l'étui), Loi 13 (Nombre incorrect de cartes), Loi 16 (Informations autorisées)*
    `,
    references: ["loi-7", "loi-13", "loi-16"],
    section: "Irrégularités"
  },

  "article-34": {
    id: "article-34",
    type: "article",
    number: "34", 
    title: "Remplacement de joueurs",
    content: `
**Principe général**

Un joueur peut être remplacé dans les conditions définies ci-après.

**Conditions de remplacement**

Le remplacement doit être autorisé par l'organisme responsable et respecter les règles de l'Indice de Compétition.

**Procédure**

La demande de remplacement doit être faite selon les modalités prévues à l'Article 33.

**Limitations**

Certaines limitations s'appliquent selon le stade de la compétition (voir Article 38 pour le stade comité).

*Références : Article 33 (Modification d'équipe), Article 38 (Stade comité), Article 27 (Indice de Compétition)*
    `,
    references: ["article-33", "article-38", "article-27"],
    section: "Compétitions par Quatre"
  }
};

export const mockConversations = [
  {
    id: 1,
    type: "user",
    message: "Que faire si un joueur a 14 cartes au lieu de 13 ?",
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: 2, 
    type: "assistant",
    message: "Cette situation est couverte par la **Loi 13 - Nombre incorrect de cartes**.\n\nSi un joueur a une carte en trop :\n- La carte excédentaire est retirée au hasard\n- Elle est remise dans l'étui non utilisé\n- L'arbitre doit rectifier la situation\n\nPour plus de détails, consultez la Loi 13 section C.",
    timestamp: new Date(Date.now() - 295000),
    references: ["loi-13"]
  },
  {
    id: 3,
    type: "user", 
    message: "Et si on découvre le problème après la fin du jeu ?",
    timestamp: new Date(Date.now() - 200000)
  },
  {
    id: 4,
    type: "assistant",
    message: "Si l'irrégularité n'est découverte qu'après la fin du jeu, il faut appliquer la **Loi 79 - Marque établie**.\n\nDans ce cas, la marque obtenue reste généralement valable, sauf circonstances exceptionnelles déterminées par l'arbitre.",
    timestamp: new Date(Date.now() - 195000),
    references: ["loi-79", "loi-13"]
  }
];

export const mockSearchResults = [
  {
    id: "loi-13",
    title: "Loi 13 - Nombre incorrect de cartes",
    snippet: "Si un joueur a un nombre incorrect de cartes...",
    relevance: 0.95
  },
  {
    id: "loi-14", 
    title: "Loi 14 - Carte(s) manquante(s)",
    snippet: "Si une main est constatée incomplète...",
    relevance: 0.87
  },
  {
    id: "loi-7",
    title: "Loi 7 - Contrôle de l'étui et des cartes", 
    snippet: "Chaque joueur retire ses cartes de la poche appropriée...",
    relevance: 0.72
  }
];

