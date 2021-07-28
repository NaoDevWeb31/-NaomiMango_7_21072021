// Import des packages dans le contrôleur
const mysql = require("mysql"); // Interagir avec une base de données MySQL en Node
const jwt = require("jsonwebtoken"); // Créer des tokens et les vérifie
const fs = require("fs"); // Accède aux fonctions qui permettent de modifier le système de fichiers

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

    // Préparer la requête SQL pour créer un post
    let sql = "INSERT INTO posts (user_id, title, description, image_url) VALUES (?, ?, ?, ?);";
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
    // Préparer la requête SQL pour récupérer tous les posts
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
            // Préparer la requête SQL pour le nombre de posts
            sql = "SELECT COUNT(*) FROM posts;";
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

exports.getOneUserPosts = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    console.log(userId);

    // Préparer la requête SQL pour récupérer les posts d'un utilisateur
    let sql = `SELECT   posts.user_id, 
                        users.last_name, 
                        users.first_name, 
                        posts.id, 
                        posts.creation_date , 
                        posts.title, 
                        posts.description, 
                        posts.image_url 
                FROM posts 
                JOIN users ON posts.user_id = users.id 
                WHERE posts.user_id = ? 
                ORDER BY posts.creation_date DESC;`;
    // Insérer les valeurs du corps de la requête GET dans la requête SQL
    let inserts = [userId];
    // Assembler la requête d'insertion SQL finale
    sql = mysql.format(sql, inserts);
    // Effectuer la requête auprès de la base de données
    db.query(sql, function (error, posts){
        if (error) {
            console.log("Posts introuvables : " + error)
            return res.status(400).json({ error : "Erreur, posts introuvables !" })
        } else {
            console.log(posts);
            return res.status(200).json(posts)
        }
    })
}

exports.getOnePost = (req, res, next) => {
    const postId = req.params.id;

    // Préparer la requête SQL pour récupérer un post
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
                WHERE posts.id = ?;`;
    // Insérer les valeurs du corps de la requête GET dans la requête SQL
    let inserts = [postId];
    // Assembler la requête d'insertion SQL finale
    sql = mysql.format(sql, inserts);
    // Effectuer la requête auprès de la base de données
    db.query(sql, function (error, post){
        if (error) {
            console.log("Post introuvable : " + error)
            return res.status(400).json({ error : "Erreur, post introuvable !" })
        } else {
            console.log("Post " + post[0].id + " de l'utilisateur " + post[0].user_id + " trouvé !");
            return res.status(200).json(post)
        }
    })
}

exports.modifyPost = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const postId = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    let imageUrl = "";

    // Préparer la requête SQL pour récupérer l'image
    let imageSql = "SELECT image_url FROM posts WHERE id = ?;";
    // Préparer la requête SQL pour supprimer le post
    let postSql = "UPDATE posts SET title = ?, description = ?, image_url = ? WHERE id = ? AND user_id = ?;";
    // Insérer les valeurs du corps de les requêtes PUT dans la requête SQL
    let imageInserts = [postId];
    let postInserts = [title, description, imageUrl, postId, userId];
    // Assembler les requêtes d'insertion SQL finales
    imageSql = mysql.format(imageSql, imageInserts);
    postSql = mysql.format(postSql, postInserts);
    
    // Effectuer la requête auprès de la base de données
    // S'il y a une image
    if (req.file){
        db.query(imageSql, function (error, image) {
            if (error) {
                console.log("Tentative de suppression de l'image du post échouée : " + error)
                return res.status(400).json({ error: "Tentative de suppression de l'image du post échouée !" })
            } else {
                if (image[0].image_url !== ""){
                    // Utiliser le segment "/images/" de notre URL d'image pour extraire le nom du fichier à supprimer
                    const filename = image[0].image_url.split("/images/")[1];
                    // Passer comme paramètres le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
                    fs.unlink(`images/${filename}`, () => {
                    });
                }
                console.log("Image supprimé !");
            }
        })
        imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    }
    //Qu'il y ait une image ou pas
    db.query(postSql, function (error, post) {
        if (error){
            console.log("Échec de modification du post : " + error)
            return res.status(400).json({ error: "Échec de modification du post !" });
        } else {
            console.log(post);
            console.log("Post " + postId + " de l'utilisateur " + userId + " modifié !")
            return res.status(200).json({ message: "Le post a été modifié avec succès !" })
        }
    });
};

exports.deletePost = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const postId = req.params.id;

    // Préparer la requête SQL pour récupérer l'image
    let imageSql = "SELECT image_url FROM posts WHERE id = ?;";
    // Préparer la requête SQL pour supprimer le post
    let postSql = "DELETE FROM posts WHERE id = ? AND user_id = ?;";
    // Insérer les valeurs du corps de les requêtes DELETE dans la requête SQL
    let imageInserts = [postId];
    let postInserts = [postId, userId];
    // Assembler les requêtes d'insertion SQL finales
    imageSql = mysql.format(imageSql, imageInserts);
    postSql = mysql.format(postSql, postInserts);
    // Effectuer la requête auprès de la base de données
    db.query(imageSql, function (error, image) {
        if (error) {
            console.log("Tentative de suppression de l'image du post échouée : " + error)
            return res.status(400).json({ error: "Tentative de suppression de l'image du post échouée !" })
        } else {
            if (image[0].image_url !== ""){
                // Utiliser le segment "/images/" de notre URL d'image pour extraire le nom du fichier à supprimer
                const filename = image[0].image_url.split("/images/")[1];
                // Passer comme paramètres le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
                fs.unlink(`images/${filename}`, () => {
                });
            }
            console.log("Image supprimé !");
            db.query(postSql, function (error, post) {
                if (error) {
                    console.log("Tentative de suppression du post échouée : " + error)
                    return res.status(400).json({ error: "Tentative de suppression du post échouée !" })
                } else {
                    console.log("Post supprimé !")
                    return res.status(200).json({ message: "Post supprimé !" })
                }
            });
        }
    });
}