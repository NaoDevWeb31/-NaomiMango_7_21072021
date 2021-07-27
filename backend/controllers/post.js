// Import des packages dans le contrôleur
const mysql = require("mysql"); // Interagir avec une base de données MySQL en Node
const jwt = require("jsonwebtoken"); // Créer des tokens et les vérifie

// Import de la configuration de la base de données dans le contrôleur
const db = require("../database/db-config");

exports.createPost = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const title = req.body.title;
    const description = req.body.description;
    let imageUrl = "";
    // S'il y a une image
    if (req.file){
        imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    }
    // Préparer la requête SQL pour récupérer un utilisateur
    let sql = "INSERT INTO posts (user_id, title, description, image_url) VALUES (?, ?, ?, ?)";
    // Insérer les valeurs du corps de la requête POST dans la requête SQL
    let inserts = [userId, title, description, imageUrl];
    // Assembler la requête d'insertion SQL finale
    sql = mysql.format(sql, inserts);
    // Effectuer la requête auprès de la base de données
    db.query(sql, function (error, post){
        if (error){
            console.log("Échec de création du post : " + error)
            return res.status(400).json({ error: "Échec de création du post !" });
        } else {
            console.log("Post " + post.id + " de l'utilisateur " + post.user_id + " créé !")
            return res.status(201).json({ message: "Le nouveau post a été créé avec succès !" })
            
        }
    })
};

exports.getAllPosts = (req, res, next) => {
    // Préparer la requête SQL pour récupérer un utilisateur
    let sql = `SELECT   posts.id, 
                        posts.user_id, 
                        posts.creation_date ,
                        posts.title, 
                        posts.description, 
                        posts.image_url, 
                        users.last_name, 
                        users.first_name
                FROM posts 
                JOIN users ON posts.user_id = users.id 
                ORDER BY posts.creation_date DESC;`;
    // Effectuer la requête auprès de la base de données
    db.query(sql, function (error, posts){
        if (error) {
            console.log("Posts introuvables : " + error)
            return res.status(400).json({ error : "Erreur, posts introuvables !" })
        } else {
            console.log(posts);
            sql = "SELECT COUNT(*) FROM posts";
            // Effectuer la requête auprès de la base de données
            db.query(sql, function (error, numberOfPosts){
                if (error){
                    console.log("Posts introuvables : " + error)
                    return res.status(400).json({ error : "Erreur, posts introuvables !" })
                } else {
                    console.log("Nombre de posts: " + numberOfPosts);
                    return res.status(200).json([posts, numberOfPosts])
                }
            })
        }
    })
}