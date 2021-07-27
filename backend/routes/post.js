const express = require("express");
// Créer le routeur
const router = express.Router();

// Import du middleware d'authentification dans le routeur
const auth = require("../middleware/auth");
// Import du middleware multer dans le routeur
const multer = require("../middleware/multer-config");
// Import du modèle dans le routeur
const postCtrl = require("../controllers/post");

// Import des contrôleurs
router.get("/", auth, postCtrl.getAllPosts);
router.post("/", auth, multer, postCtrl.createPost);

// Permettre l'export du routeur sur d'autres fichiers
module.exports = router;