# NDI-2024

## Description

NDI-2024 est un projet web développé en PHP utilisant le moteur de template **Twig**. Le projet est structuré selon le modèle MVC (Model-View-Controller) pour faciliter l'organisation du code et la gestion des fonctionnalités.

Le but principal de ce projet est de [ajoutez une description spécifique, par exemple : créer un système de gestion de contenu, un site de e-commerce, etc.].

---

## Fonctionnalités

- Organisation en **MVC** pour une séparation claire des responsabilités.
- Utilisation de **Twig** pour le rendu des templates HTML.
- Compatibilité avec des bases de données via PDO.
- Styles personnalisés grâce à **SCSS**.
- Intégration facile d'autres modules ou extensions.

---

## Structure du projet

Voici un aperçu de la structure des fichiers :

NDI-2024/ │ ├── assets/ # Contient les fichiers CSS, JS, images │ ├── css/ │ ├── js/ │ └── images/ │ ├── controller/ # Les contrôleurs pour gérer la logique métier │ ├── Controller.php │ ├── ControllerCaptcha.php │ └── ... │ ├── model/ # Les modèles pour interagir avec la base de données │ ├── Model.php │ └── ... │ ├── templates/ # Les fichiers Twig pour le rendu HTML │ ├── captcha.html.twig │ └── ... │ ├── vendor/ # Dépendances installées via Composer │ ├── composer.json # Déclaration des dépendances PHP ├── README.md # Documentation du projet ├── index.php # Point d'entrée principal de l'application └── .env # Variables d'environnement (base de données, etc.)


---

## Installation

### Prérequis

Avant d'installer le projet, assurez-vous que votre environnement respecte les conditions suivantes :

- PHP >= 7.4
- Composer installé
- Un serveur web local (Apache, Nginx ou équivalent)
- Base de données MySQL ou MariaDB
- Node.js (pour SCSS si nécessaire)

### Étapes d'installation

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/maximeBourciez/NDI-2024.git
   cd NDI-2024
Installer les dépendances PHP avec Composer :

bash
Copy code
composer install
Configurer les variables d'environnement :

Dupliquez le fichier .env.example pour créer .env.
Configurez les informations de connexion à la base de données et les autres paramètres nécessaires.
Configurer votre serveur web :

Pointez le document root vers NDI-2024/index.php.
Compiler les fichiers SCSS (si applicable) :

bash
Copy code
npm install
npm run build-css
Démarrer l'application : Accédez à l'application via votre navigateur à l'URL configurée.

Utilisation
Points d'entrée principaux
index.php : Page principale de l'application.
Les routes ou contrôleurs spécifiques (par exemple : ControllerCaptcha) gèrent des pages ou fonctionnalités spécifiques.
Fonctionnalités clés
Exemple de méthode : FctDegueulasse
Cette méthode exécute plusieurs calculs intensifs et affiche le résultat via un template Twig.

Exemple d'appel :
php
Copy code
$controller = new ControllerCaptcha($twig, $loader);
$controller->FctDegueulasse();
Exemple de Template Twig
Un fichier Twig comme captcha.html.twig peut contenir le HTML suivant pour afficher les résultats :

html
Copy code
<!DOCTYPE html>
<html>
<head>
    <title>Résultat</title>
</head>
<body>
    <h1>Résultat de la fonction dégueulasse</h1>
    <p>{{ resultat }}</p>
</body>
</html>