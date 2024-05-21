# English version

# Arcadia Zoo

## Description
Discover Arcadia Zoo, your ultimate destination for an immersive experience with wildlife. Explore our zoo located in France, near the Brocéliande Forest, in Brittany, since 1960. Dive into the captivating universe of biodiversity, where each habitat - savannah, jungle, marsh - houses a multitude of fascinating species. Enjoy our premium services, including meticulous health checks performed by our dedicated team of veterinarians, personalized feeding for our resident animals, and a warm family atmosphere. Arcadia Zoo: an exceptional experience for all nature and animal lovers.

## Prerequisites
Before getting started, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (normally included with Node.js)

## Installation
1. Clone the repository:
```bash
    git clone https://github.com/kim-h14/ZooArcadiaFront
    cd ZooArcadiaFront
```

2. Install dependencies:
```bash
    npm install
```

## Configuration
- Create a new file at the root of the project named .env
- Fill the necessary values

## Launching the Application
To start the application locally, use the following command:
```bash
    node server.js
```
The application should be accessible at `http://localhost:3000`

## Test
To run tests, use the following command:
```bash 
    npm test
```

## Troubleshooting
Here are some common issues and their solutions:
- Issue: The server does not start. 
    - Solution: Make sure all dependencies are installed correctly (npm install). Also, ensure that your .env file is properly configured.
- Issue: Database connection error.
    - Solution: Ensure that your MongoDB and PostgreSQL instances are running and that the database URLs in the .env file and databases folder are correct.

## Project Structure
Here is a brief description of the structure of the project's important folders and files:

```bash 
/ZooArcadiaFront
| assets
| databases                 # Database models
│   │-- animalConsultation.js
│   │-- arcadia.sql
│   │-- pgDB.js
| node_modules
│-- /public
│   │-- /dashboards        #html
│   │-- /js
│   │-- |-- /animations
│   │-- |-- /auth
│   │-- |-- /dashboards
│   │-- |-- script.js
│   │-- /pages              #html
│   │-- /Router # Route definitions
│   │-- /index.html 
│-- /scss
│-- /tests
│   │-- login.test.js       
│-- app.js                  # Application entry point
│-- server.js
│-- package.json            # Dependencies and npm scripts
│-- .env                    # Environment variables
│-- README.md               # Project documentation

```


# French version

# Zoo Arcadia

## Description
Découvrez Arcadia Zoo, votre destination incontournable pour une expérience immersive avec la faune sauvage. Explorez notre zoo situé en France, près de la forêt de Brocéliande, en Bretagne, depuis 1960. Plongez dans l'univers captivant de la biodiversité, où chaque habitat - savane, jungle, marais - abrite une multitude d'espèces fascinantes. Profitez de nos services haut de gamme, incluant des contrôles de santé minutieux effectués par notre équipe de vétérinaires dévoués, une alimentation personnalisée pour nos résidents animaux et une ambiance familiale chaleureuse. Arcadia Zoo : une expérience exceptionnelle pour tous les amoureux de la nature et des animaux.

## Prérequis
Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine:
- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/) (normalement inclus avec Node.js)

## Installation
1. Clonez le dépôt:
```bash
    git clone https://github.com/kim-h14/ZooArcadiaFront
    cd ZooArcadiaFront
```

2. Installez les dépences:
```bash
    npm install
```

## Configuration
- Créez un nouveau fichier à la racine du projet qui s'intitule .env
- Remplissez les valeurs nécessaires


## Lancement de l'application
Pour démarrer l'application en local, utilisez la commande suivante:
```bash
    node server.js
```
L'application devrait être accessible à l'adresse `http://localhost:3000`

## Test
Pour exécuter les tests, utilisez la commande suivante:
```bash 
    npm test
```

## Dépannage
Voici quelques problèmes courant et leurs solutions:
- Problème: Le serveur ne démarre pas. 
    - Solution: Vérifiez que toutes les dépendances sont installées correctement (`npm install`). Assurez-vous également que votre fichier .env soit correctement configuré.
- Problème: Erreur de connexion à la base de données
    - Solution: Assurez-vous que vos instances de MongoDB et PostgreSQL sont en cours d'exécution et que les URL des bases de données dans le fichier .env et dans le dossier databases sont correctes.


## Structure du projet:
Voici une brève description de la structure des dossiers et fichiers importants du projet:
```bash
/ZooArcadiaFront
| assets
| databases                 # Modèles de la base de données
│   │-- animalConsultation.js
│   │-- arcadia.sql
│   │-- pgDB.js
| node_modules
│-- /public
│   │-- /dashoboards        #html
│   │-- /js
│   │-- |-- /animations
│   │-- |-- /auth
│   │-- |-- /dashboards
│   │-- |-- script.js
│   │-- /pages              #html
│   │-- /Router # Définitions des routes
│   │-- /index.html 
│-- /scss
│-- /tests
│   │-- login.test.js       
│-- app.js                  # Point d'entrée de l'application
│-- server.js
│-- package.json            # Dépendances et scripts npm
│-- .env                    # Variables d'environnement
│-- README.md               # Documentation du projet

```
