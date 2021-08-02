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
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    // Préparer la requête SQL pour récupérer tous les posts
    let postSql =`SELECT   posts.user_id, 
                            users.last_name, 
                            users.first_name, 
                            posts.id, 
                            posts.creation_date ,
                            posts.title, 
                            posts.description, 
                            posts.image_url,
                            (SELECT COUNT(if(post_id = posts.id, 1, NULL)) 
                                FROM comments 
                                WHERE post_id = posts.id
                            ) 
                            AS commentsNumber, 
                            (SELECT COUNT(if(opinion = 2, 1, NULL)) 
                                FROM likes 
                                WHERE post_id = posts.id
                            ) AS likesNumber, 
                            (SELECT COUNT(if(opinion = -2, 1, NULL)) 
                                FROM likes 
                                WHERE post_id = posts.id
                            ) AS dislikesNumber, 
                            (SELECT opinion FROM likes WHERE user_id = ? AND posts.id = likes.post_id) AS opinion 
                    FROM posts 
                    JOIN users ON posts.user_id = users.id 
                    ORDER BY posts.creation_date DESC;`;
    // Insérer les valeurs du corps de la requête GET dans la requête SQL
    let inserts = [userId];
    // Assembler la requête d'insertion SQL finale
    postSql = mysql.format(postSql, inserts);
    // Effectuer la requête auprès de la base de données
    db.query(postSql, function (error, posts){
        if (error) {
            console.log("Posts introuvables : " + error)
            return res.status(400).json({ error : "Erreur, posts introuvables !" })
        } else {
            // Préparer la requête SQL pour le nombre de posts
            let countSql = `SELECT COUNT(*) FROM posts;`;
            // Effectuer la requête auprès de la base de données
            db.query(countSql, function (error, numberOfPosts){
                if (error){
                    console.log("Posts introuvables : " + error)
                    return res.status(400).json({ error : "Erreur, posts introuvables !" })
                } else {
                    console.log("Nombre de posts: " + JSON.stringify(numberOfPosts));
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

    // Préparer la requête SQL pour récupérer les posts d'un utilisateur
    let sql = `SELECT   posts.user_id, 
                        users.last_name, 
                        users.first_name, 
                        posts.id, 
                        posts.creation_date , 
                        posts.title, 
                        posts.description, 
                        posts.image_url ,
                        (SELECT COUNT(if(post_id = posts.id, 1, NULL)) 
                            FROM comments 
                            WHERE post_id = posts.id
                        ) 
                        AS commentsNumber, 
                        (SELECT COUNT(if(opinion = 2, 1, NULL)) 
                            FROM likes 
                            WHERE post_id = posts.id
                        ) AS likesNumber, 
                        (SELECT COUNT(if(opinion = -2, 1, NULL)) 
                            FROM likes 
                            WHERE post_id = posts.id
                        ) AS dislikesNumber, 
                        (SELECT opinion FROM likes WHERE user_id = ? AND posts.id = likes.post_id) AS opinion 
                FROM posts 
                JOIN users ON posts.user_id = users.id 
                WHERE posts.user_id = ? 
                ORDER BY posts.creation_date DESC;`;
    // Insérer les valeurs du corps de la requête GET dans la requête SQL
    let inserts = [userId, userId];
    // Assembler la requête d'insertion SQL finale
    sql = mysql.format(sql, inserts);
    // Effectuer la requête auprès de la base de données
    db.query(sql, function (error, posts){
        if (error) {
            console.log("Posts introuvables : " + error)
            return res.status(400).json({ error : "Erreur, posts introuvables !" })
        } else {
            console.log("Les " + posts.length + " posts de l'utilisateur " + userId + " ont été trouvés !");
            return res.status(200).json(posts)
        }
    })
}

exports.getOnePost = (req, res, next) => {
    const postId = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    // Préparer la requête SQL pour récupérer un post
    let sql = `SELECT   posts.user_id, 
                        users.last_name, 
                        users.first_name, 
                        posts.id, 
                        posts.creation_date, 
                        posts.title, 
                        posts.description, 
                        posts.image_url, 
                        (SELECT COUNT(if(post_id = posts.id, 1, NULL)) 
                            FROM comments 
                            WHERE post_id = posts.id
                        ) AS commentsNumber, 
                        (SELECT COUNT(if(opinion = 2, 1, NULL)) 
                            FROM likes 
                            WHERE post_id = posts.id
                        ) AS likesNumber, 
                        (SELECT COUNT(if(opinion = -2, 1, NULL)) 
                            FROM likes 
                            WHERE post_id = posts.id
                        ) AS dislikesNumber, 
                        (SELECT opinion FROM likes WHERE user_id = ? AND posts.id = likes.post_id) AS opinion 
                FROM posts 
                JOIN users ON posts.user_id = users.id 
                WHERE posts.id = ?;`;
    // Insérer les valeurs du corps de la requête GET dans la requête SQL
    let inserts = [userId, postId];
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
    //Récupérer les données envoyées
    const postId = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const postImage = req.file;
    //Futur URL s'il y a une image
    let imageUrl = "";
    // S'il y a une nouvelle image dans la requête
    if (postImage){
        imageUrl = `${req.protocol}://${req.get("host")}/images/${postImage.filename}`;
    }
    // Préparer la requête SQL pour récupérer l'image
    let imageSql = "SELECT image_url FROM posts WHERE id = ?;";
    // Préparer la requête SQL pour modifier le post
    let postSql = `UPDATE posts SET title = ?, description = ?, image_url = ? WHERE id = ?;`;
    // Insérer les valeurs du corps de les requêtes PUT dans la requête SQL
    let imageInserts = [postId];
    let postInserts = [title, description, imageUrl, postId];
    // Assembler les requêtes d'insertion SQL finales
    imageSql = mysql.format(imageSql, imageInserts);
    postSql = mysql.format(postSql, postInserts);
    
    // Effectuer la requête auprès de la base de données
    db.query(imageSql, function (error, image) {
        if (error) {
            console.log("Tentative de suppression de l'image du post échouée : " + error)
            return res.status(400).json({ error: "Tentative de suppression de l'image du post échouée !" })
        } else {
            let formerImageURL = image[0].image_url;// URL de l'ancienne image récupérée s'il y en a une
            if (formerImageURL !== ""){ // Supprimer l'ancienne image du post
                // Utiliser le segment "/images/" de notre URL d'image pour extraire le nom du fichier à supprimer
                const filename = formerImageURL.split("/images/")[1];
                // Passer comme paramètres le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
                fs.unlink(`images/${filename}`, () => {
                });
                console.log("Image supprimé !");
            } else {
                console.log("Pas d'image à supprimer !");
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
        }
    })
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
            let imageUrl = image[0].image_url;
            if (imageUrl !== ""){
                // Utiliser le segment "/images/" de notre URL d'image pour extraire le nom du fichier à supprimer
                const filename = imageUrl.split("/images/")[1];
                // Passer comme paramètres le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
                fs.unlink(`images/${filename}`, () => {
                });
                console.log("Image supprimé !");
            } else {
                console.log("Pas d'image à supprimer !");
            }
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

exports.getOnePostComments = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const postId = req.params.id;

    // Préparer la requête SQL pour récupérer un post
    let sql = `SELECT   comments.id, 
                        users.last_name,
                        users.first_name, 
                        user_id, 
                        post_id, 
                        comments.creation_date, 
                        content 
                FROM comments
                JOIN users ON comments.user_id = users.id
                WHERE post_id = ? 
                ORDER BY comments.creation_date DESC;`;
    // Insérer les valeurs du corps de la requête GET dans la requête SQL
    let inserts = [postId];
    // Assembler la requête d'insertion SQL finale
    sql = mysql.format(sql, inserts);
    // Effectuer la requête auprès de la base de données
    db.query(sql, function (error, comments){
        if (error) {
            console.log("Commentaires introuvables : " + error)
            return res.status(400).json({ error : "Erreur, commentaires introuvables !" })
        } else {
            console.log("Commentaires du post " + postId + " de l'utilisateur " + userId + " trouvés !");
            return res.status(200).json(comments)
        }
    })
}

exports.createComment = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const postId = req.body.postId;
    const content = req.body.content;
    // Préparer la requête SQL pour créer un post
    let sql = "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?);";
    // Insérer les valeurs du corps de la requête POST dans la requête SQL
    let inserts = [userId, postId, content];
    // Assembler la requête d'insertion SQL finale
    sql = mysql.format(sql, inserts);
    // Effectuer la requête auprès de la base de données
    db.query(sql, function (error, comment){
        if (error){
            console.log("Échec de création du commentaire : " + error)
            return res.status(400).json({ error: "Échec de création du commentaire !" });
        } else {
            console.log("Commentaire " + comment.id + " de l'utilisateur " + comment.user_id + "pour le post " + comment.post_id + " créé !")
            return res.status(201).json({ message: "Le nouveau commentaire a été créé avec succès !" })
            
        }
    })
};

exports.modifyComment = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    //Récupérer les données envoyées
    const commentId = req.params.id;
    const content = req.body.content;
    // Préparer la requête SQL pour modifier le commentaire
    let sql = `UPDATE comments SET content = ? WHERE id = ?;`;
    // Insérer les valeurs du corps de la requête PUT dans la requête SQL
    let inserts = [content, commentId];
    // Assembler la requête d'insertion SQL finale
    sql = mysql.format(sql, inserts);
    
    // Effectuer la requête auprès de la base de données
    db.query(sql, function (error, comment) {
        if (error){
            console.log("Échec de modification du commentaire : " + error)
            return res.status(400).json({ error: "Échec de modification du commentaire !" });
        } else {
            console.log(comment);
            console.log("Commentaire " + commentId + " de l'utilisateur " + userId + " modifié !")
            return res.status(200).json({ message: "Le commentaire a été modifié avec succès !" })
        }
    });
};

exports.deleteComment = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const commentId = req.params.id;

    // Préparer la requête SQL pour supprimer le post
    let sql = "DELETE FROM comments WHERE id = ? AND user_id = ?;";
    // Insérer les valeurs du corps de la requête DELETE dans la requête SQL
    let inserts = [commentId, userId];
    // Assembler la requête d'insertion SQL finale
    sql = mysql.format(sql, inserts);
    // Effectuer la requête auprès de la base de données
    
    db.query(sql, function (error, comment) {
        if (error) {
            console.log("Tentative de suppression du commentaire échouée : " + error)
            return res.status(400).json({ error: "Tentative de suppression du commentaire échouée !" })
        } else {
            console.log("Commentaire supprimé !")
            return res.status(200).json({ message: "Commentaire supprimé !" })
        }
    });
}

exports.ratePost = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const postId = req.body.postId;
    const opinion = req.body.opinion;
    const alreadyRated = req.body.alreadyRated;

    switch (opinion) {
        case 1: // Like/dislike annulé
            try {
                // Préparer la requête SQL pour annuler un like ou dislike sur un post
                let sql = `UPDATE likes SET opinion = 1 WHERE post_id = ? AND user_id = ?;`;
                // Insérer les valeurs du corps de la requête POST dans la requête SQL
                let inserts = [postId, userId];
                // Assembler la requête d'insertion SQL finale
                sql = mysql.format(sql, inserts);
                // Effectuer la requête auprès de la base de données
                db.query(sql, function (error, opinion){
                    if (error){
                        console.log("Échec de modification de l'opinion (annulé) : " + error)
                        return res.status(400).json({ error: "Échec de modification de l'opinion (annulé) !" });
                    } else {
                        console.log("Opinion annulée sur le post " + postId + " par l'utilisateur " + userId + " !")
                        return res.status(200).json({ message: "Opinion annulée !" })
                    }
                })
            } catch (error) {
                return res.status(400).json({ error: "Échec de modification de l'opinion (annulé) !" });
            }
            break;
        case 2: // Like
            try {
                if (alreadyRated){
                    // Préparer la requête SQL pour liker un post
                    let sql = `UPDATE likes SET opinion = 2 WHERE post_id = ? AND user_id = ?;`;
                    // Insérer les valeurs du corps de la requête POST dans la requête SQL
                    let inserts = [postId, userId];
                    // Assembler la requête d'insertion SQL finale
                    sql = mysql.format(sql, inserts);
                    // Effectuer la requête auprès de la base de données
                    db.query(sql, function (error, opinion){
                        if (error){
                            console.log("Échec de modification de l'opinion (like) : " + error)
                            return res.status(400).json({ error: "Échec de modification de l'opinion (like) !" });
                        } else {
                            console.log("Post " + postId + " liké par l'utilisateur " + userId + " !")
                            return res.status(200).json({ message: "Post liké !" })
                        }
                    })
                } else {
                    // Préparer la requête SQL pour liker un post
                    let sql = `INSERT INTO likes (post_id, user_id, opinion) VALUES (?, ?, 2);`;
                    // Insérer les valeurs du corps de la requête POST dans la requête SQL
                    let inserts = [postId, userId];
                    // Assembler la requête d'insertion SQL finale
                    sql = mysql.format(sql, inserts);
                    // Effectuer la requête auprès de la base de données
                    db.query(sql, function (error, opinion){
                        if (error){
                            console.log("Échec de modification de l'opinion (like) : " + error)
                            return res.status(400).json({ error: "Échec de modification de l'opinion (like) !" });
                        } else {
                            console.log("Post " + postId + " liké par l'utilisateur " + userId + " !")
                            return res.status(200).json({ message: "Post liké !" })
                        }
                    })
                }
            } catch (error) {
                return res.status(400).json({ error: "Échec de modification de l'opinion (like) !" });
            }
            break;
        case -2: // Dislike
            try {
                if (alreadyRated){
                    // Préparer la requête SQL pour disliker un post
                    let sql = `UPDATE likes SET opinion = -2 WHERE post_id = ? AND user_id = ?;`;
                    // Insérer les valeurs du corps de la requête POST dans la requête SQL
                    let inserts = [postId, userId];
                    // Assembler la requête d'insertion SQL finale
                    sql = mysql.format(sql, inserts);
                    // Effectuer la requête auprès de la base de données
                    db.query(sql, function (error, opinion){
                        if (error){
                            console.log("Échec de modification de l'opinion (dislike) : " + error)
                            return res.status(400).json({ error: "Échec de modification de l'opinion (dislike) !" });
                        } else {
                            console.log("Post " + postId + " disliké par l'utilisateur " + userId + " !")
                            return res.status(200).json({ message: "Post disliké !" })
                        }
                    })
                } else {
                    // Préparer la requête SQL pour disliker un post
                    let sql = `INSERT INTO likes (post_id, user_id, opinion) VALUES (?, ?, -2);`;
                    // Insérer les valeurs du corps de la requête POST dans la requête SQL
                    let inserts = [postId, userId];
                    // Assembler la requête d'insertion SQL finale
                    sql = mysql.format(sql, inserts);
                    // Effectuer la requête auprès de la base de données
                    db.query(sql, function (error, opinion){
                        if (error){
                            console.log("Échec de modification de l'opinion (dislike) : " + error)
                            return res.status(400).json({ error: "Échec de modification de l'opinion (dislike) !" });
                        } else {
                            console.log("Post " + postId + " disliké par l'utilisateur " + userId + " !")
                            return res.status(200).json({ message: "Post disliké !" })
                        }
                    })
                }
            } catch (error) {
                return res.status(400).json({ error: "Échec de modification de l'opinion (dislike) !" });
            }
            break;
    }
}