-- CRÉATION DE LA TABLE DES UTILISATEURS --
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  -- ID de l'utilisateur
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- Date de création de l'utilisateur
  `creation_date` TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  -- Nom de l'utilisateur
  `last_name` VARCHAR(50) NOT NULL,
  -- Prénom de l'utilisateur
  `first_name` VARCHAR(30) NOT NULL,
  -- Email de l'utilisateur UNIQUE (éviter les doublons)
  `email` VARCHAR(70) NOT NULL UNIQUE,
  -- Mot de passe de l'utilisateur
  `password` VARCHAR(100) NOT NULL,
  -- Rôle administrateur => Utilisateur 1/Modérateur 2/Administrateur 3
  `admin_role` INT DEFAULT 1,
  -- Clé primaire => ID de l'utilisateur
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;
------------------------------------------------------
-- CRÉATION DE LA TABLE DE PUBLICATIONS --
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  -- ID du post
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- User ID du créateur du post
  `user_id` INT UNSIGNED NOT NULL,
  -- Date de création du post
  `creation_date` creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Titre du post
  `title` VARCHAR(70) NOT NULL,
  -- Description du post
  `description` TEXT NOT NULL,
  -- URL de l'image
  `image_url` TEXT DEFAULT NULL,
  -- Clé primaire => ID du post
  PRIMARY KEY (`id`),
  -- Index simple sur la colonne "user_id"
  INDEX `ind_user_id` (`user_id`),
  -- Clé étrangère => User ID du créateur du post (RÉFÉRENCE: la colonne "id" de la table "users")
  CONSTRAINT `fk_posts_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;
------------------------------------------------------
-- CRÉATION DE LA TABLE DE COMMENTAIRES --
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  -- ID du commentaire
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- User ID du créateur du commentaire
  `user_id` INT UNSIGNED NOT NULL,
  -- ID du post commenté
  `post_id` INT UNSIGNED NOT NULL,
  -- Date de création du post
  `creation_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Contenu du commentaire
  `content` TEXT NOT NULL,
  -- Clé primaire => ID du commentaire
  PRIMARY KEY (`id`),
  -- Index simple sur la colonne "user_id"
  INDEX `ind_user_id` (`user_id`),
  -- Index simple sur la colonne "post_id"
  INDEX `ind_post_id` (`post_id`),
  -- Clé étrangère => User ID du créateur du commentaire (RÉFÉRENCE: la colonne "id" de la table "users")
  CONSTRAINT `fk_comments_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  -- Clé étrangère => ID du post commenté (RÉFÉRENCE: la colonne "id" de la table "posts")
  CONSTRAINT `fk_comments_post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;
------------------------------------------------------
-- CRÉATION DE LA TABLE DES LIKES/DISLIKES --
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
  -- ID de l'opinion
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- User ID du créateur de l'opinion
  `user_id` INT UNSIGNED NOT NULL,
  -- ID du post liké/disliké
  `post_id` INT UNSIGNED NOT NULL,
  -- Disliké -2/Annulé 1/Liké 2
  `opinion` INT DEFAULT NULL,
  -- Clé primaire => ID de l'opinion
  PRIMARY KEY (`id`),
  -- Index simple sur la colonne "user_id"
  INDEX `ind_user_id` (`user_id`),
  -- Index simple sur la colonne "post_id"
  INDEX `ind_post_id` (`post_id`),
  -- Clé étrangère => User ID du créateur de l'opinion (RÉFÉRENCE: la colonne "id" de la table "users")
  CONSTRAINT `fk_likes_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  -- Clé étrangère => ID du post liké/disliké (RÉFÉRENCE: la colonne "id" de la table "posts")
  CONSTRAINT `fk_likes_post_id` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;