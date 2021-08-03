# NaomiMango_7_21072021 - Groupomania

### Projet 7 du parcours "Développeur web" d'OpenClassrooms - Créez un réseau social d’entreprise

![Logo](https://raw.githubusercontent.com/NaoDevWeb31/NaomiMango_7_21072021/main/frontend/src/assets/small-banner.png)

## Objectif

Construire un réseau social interne pour les employés de Groupomania. Choisir la fonctionnalité à développer et fournir un MVP pour faciliter les interactions entre collègues dans un cadre plus informel. Développer les parties front-end et back-end de l'application.

## Installation

#### Prérequis

- Node
- `npm`
- Vue CLI
- MySQL

#### Projet Groupomania

Cloner ou télécharger le repository, puis :

- Base de données MySQL

  - Ouvrir le terminal à partir du dossier du projet
  - Se connecter à MySQL en exécutant `mysql -h localhost -u root -p`
  - Taper le mot de passe
  - Créer la base de données du projet en exécutant `CREATE DATABASE groupomania_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  - Utiliser cette base de données en exécutant `USE groupomania_db;`
  - Importer le fichier groupomania_db.sql en exécutant `SOURCE groupomania_db.sql;`
  - Créer un fichier `.env` dans lequel il faut ajouter les 4 variables `DB_` en suivant l'exemple du fichier `.env.example`
  - Renseigner l'hôte, l'utilisateur, le mot de passe et le nom de base de données

- Lancement du Backend

  - Ouvrir un autre terminal et se déplacer dans le dossier "backend"
  - Exécuter `npm install`
  - Créer un fichier `.env` dans lequel il faut ajouter `SESSION_SECRET` en suivant l'exemple comme dans le fichier `.env.example`
  - Lui donner une valeur
  - Exécuter `npm start`

- Lancement du Frontend

  - Ouvrir un autre terminal et se déplacer dans le dossier "frontend"
  - Exécuter `npm install`
  - Exécuter `npm serve`

#### Application Groupomania

Se rendre sur http://localhost:8080 via le navigateur

## Instructions

- Carte blanche concernant la forme du projet
- Choisir la fonctionnalité à développer
- Développer la première version de l'application
- Utiliser le framework Front-End de son choix (React, Vue, Angular, Ember, Meteor, Aurelia…)

#### Les 2 fonctionnalités proposées

- 9GAG : pour partager et commenter des gifs avec d’autres collègues

- Reddit : pour écrire et/ou partager des articles avec les collègues sur des sujets qui les intéressent

## Contraintes techniques

- Le client doit utiliser une base de données relationnelles qui se manipule avec le langage SQL pour le stockage de données
- S’assurer que l’utilisateur puisse :
  - requêter les données requises depuis SQL
  - soumettre ces changements à la base de données SQL
- Les données de connexion doivent également être sécurisées
- Faire en sorte que :
  - la web app puisse se connecter et se déconnecter à l’application
  - la session de l’utilisateur persiste pendant qu’il est connecté
- Le projet doit être codé en Javascript
- Les pages devront respecter les standards WCAG

## Fonctionnalités

#### Périmètre du projet

- La présentation des fonctionnalités doit être simple
- La création d’un compte doit être simple et possible depuis un smartphone
- Le profil doit contenir très peu d’informations pour que sa complétion soit rapide
- La suppression du compte doit être possible
- L’accès à un forum où les salariés publient :
  - des contenues multimédias doit être présent
  - des textes doit être présent
- Les utilisateurs doivent pouvoir facilement repérer les dernières participations des employés (rôle utilisateur => adminRole 1)
- Le/la chargé de communication Groupomania doit pouvoir modérer les interactions entre salariés (rôle modérateur => adminRole 2)

#### Technologies utilisées

|        Technologies         |
| :-------------------------: |
| Framework frontend : Vue.js |
| Framework backend : Express |
|  Serveur backend : NodeJS   |
|   Base de données : MySQL   |

## Instructions

Pour plus de détails sur les instructions de ce projet :

- [Spécifications]()
