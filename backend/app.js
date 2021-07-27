// Import de packages dans l'appli
const express = require("express");
require("dotenv").config(); // Charge les variables d'environnement d'un fichier ".env" dans "process.env." (masque les infos de connexion à MongoDB Atlas)
const path = require("path"); // Accède au path de notre serveur

// Import des routeurs dans l'appli
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post")

// Créer l'appli
const app = express();

// Middleware des Headers
app.use((req, res, next) => {
    // Accèder à notre API depuis n'importe quelle origine
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    // Envoyer des requêtes avec les méthodes mentionnées
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// Extraire et analyser les objets JSON des requêtes POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utiliser le gestionnaire de routage pour gérer le sous-dosser "images" de manière statique à chaque fois qu'elle reçoit une requête vers la route "/images"
app.use("/images", express.static(path.join(__dirname, "images")));

// Utiliser du routeur "user" pour toutes les requêtes vers "/api/auth" dans l'appli
app.use("/api/auth", userRoutes);
// Utiliser du routeur "post" pour toutes les requêtes vers "/api/posts" dans l'appli
app.use("/api/posts", postRoutes);

// Permettre l'export de l'appli sur d'autres fichiers
module.exports = app;