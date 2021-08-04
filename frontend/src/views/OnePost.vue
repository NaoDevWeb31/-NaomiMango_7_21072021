<template>
    <div>
    <!-- Si l'utilisateur n'est pas bien connecté -->
        <v-main v-if="!accedAccount">
            <p class="display-1 text-center mx-auto" width="100%">Accès non autorisé !</p>
        </v-main>
    <!-- Si l'utilisateur est bien connecté -->
        <v-container class="fill-height" fluid v-if="accedAccount">
            <HeaderLogged/>
            <v-main class="container fluid fill-height">
                <!-- TITRE -->
                <section class="row my-2">
                    <v-col>
                        <h1 class="text-center text-h4 text-sm-h3">
                            Bienvenue sur le Forum !
                        </h1>
                    </v-col>
                </section>
                <PostsNav/>
                <section class="row d-flex flex-column">
                    <!-- SI PAS DE POSTS -->
                    <v-col v-if="post == 0">
                        <p class="text-center mx-auto my-15 text-h5 text-sm-h4">Aucun post trouvé !</p>
                    </v-col>
                    <!-- SI POST -->
                    <article class="col-12 mt-3" v-if="post !== 0" :key="post.id">
                        <!-- POST -->
                        <v-card width="600" class="mx-auto rounded-lg">
                            <v-list-item class="px-0 py-0">
                                <v-list-item-content class="px-0 py-0">
                                    <!-- LIGNE 1 -->
                                    <div v-if="sessionUserId === post.user_id || sessionUserRole === 2">
                                        <div class="px-5 py-1">
                                            <v-card-actions class="d-flex justify-space-between align-center">
                                                <v-btn color="red" aria-label="Modifier ce post" @click.stop="dialogUpdatePostUp(post.title, post.description, post.image_url, post.id)" v-if="sessionUserId === post.user_id">
                                                    <v-icon>mdi-file-document-edit</v-icon>
                                                    <span class="ml-1 d-none d-sm-inline">Modifier</span>
                                                </v-btn>
                                                <v-btn color="red" aria-label="Supprimer ce post" @click="deletePost(post.id)" v-if="sessionUserId === post.user_id || sessionUserRole === 2">
                                                    <v-icon>mdi-delete</v-icon>
                                                    <span class="ml-1 d-none d-sm-inline">Supprimer</span>
                                                </v-btn>
                                            </v-card-actions>
                                        </div>
                                        <v-divider class="red lighten-4 mb-1"></v-divider>
                                    </div>
                                    <!-- LIGNE 2 -->
                                    <div class="px-5 py-1 text-overline">Publié par {{ post.first_name }} {{ post.last_name }} | Le {{ formatCreationDate(post.creation_date) }}</div>
                                    <v-divider class="red lighten-4 mb-3"></v-divider>
                                    <!-- LIGNE 3 -->
                                    <div class="px-5 py-2 text-h5">{{ post.title }}</div>
                                    <div class="px-5 py-2">{{ post.description }}</div>
                                    <div class="px-5 pt-3 pb-5 d-flex justify-center">
                                        <v-img :src="post.image_url" contain width="200" :alt="imageAlt"/>
                                    </div>
                                    <v-divider class="mb-0 red lighten-4"></v-divider>
                                    <!-- LIGNE 4 -->
                                    <div class="d-flex flex-md-row align-center mb-1">
                                        <div class="px-2 text-body-1">
                                            <v-btn text icon aria-label="Liker ce post" :color="likeColor.color" @click="modifyLike()">
                                                <v-icon>mdi-thumb-up</v-icon>
                                            </v-btn>
                                            {{ post.likesNumber }}
                                        </div>
                                        <v-divider vertical class="red lighten-4"></v-divider>
                                        <div class="pl-2 text-body-1">
                                            <v-btn text icon aria-label="Disliker ce post" :color="dislikeColor.color" @click="modifyDislike()">
                                                <v-icon>mdi-thumb-down</v-icon>
                                            </v-btn>
                                            {{ post.dislikesNumber }}
                                        </div>
                                        <v-divider vertical class="red lighten-4 ml-4"></v-divider>
                                        <div class="px-2 text-body-1">
                                            <v-icon class="d-inline d-sm-none">mdi-comment</v-icon>
                                            <span class="d-none d-sm-inline">Commentaires </span>
                                            ({{post.commentsNumber}})
                                        </div>
                                    </div>
                                    <!-- DIALOGUE DE MODIFICATION DE POST -->
                                    <v-dialog v-model="dialogUpdatePost" persistent max-width="600px">
                                        <v-card>
                                            <v-card-title class="d-flex justify-center">
                                                <span class="text-h5 mb-2">Modifier votre post :</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-form ref="form" v-model="valid" >
                                                    <v-text-field v-model="title" ref="title" :rules="titleRules" counter="70" label="Titre du post (*)" type="text" prepend-icon="mdi-format-title" color="black" outlined clearable clear-icon="mdi-eraser" auto-grow></v-text-field>
                                                    <v-textarea v-model="description" ref="description" :rules="descriptionRules" counter="320" label="Description du post (*)" type="text" prepend-icon="mdi-text" color="black" outlined clearable clear-icon="mdi-eraser" auto-grow></v-textarea>
                                                    <v-file-input v-model="image" ref="image" :rules="imageRules" accept="image/gif" label="Image du post" type="file" filled prepend-icon="mdi-camera" show-size color="black"></v-file-input>
                                                </v-form>
                                                <small>Champs requis (*)</small>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="blue darken-1" aria-label="Annuler la modification du post" text @click="dialogUpdatePost = false">
                                                    Annuler
                                                </v-btn>
                                                <v-btn color="green darken-1" aria-label="Valider la modification du post" text :disabled="!valid" @click="updatePost()">
                                                    Valider
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card>
                        <!-- BLOC DE COMMENTAIRES -->
                        <section class="comment comment--sm comment--xs comment--xss comment--xsss mx-auto pa-3 rounded-b-xl d-flex flex-column blue-grey lighten-3">
                            <!-- SI PAS DE COMMMENTAIRES -->
                            <div v-if="comments == 0">
                                <p class="text-center mx-auto mt-1 mb-3">Aucun commentaire trouvé !</p>
                            </div>
                            <!-- COMMENTAIRE -->
                            <v-card width="550" class="mx-auto rounded-lg mb-3" v-for="comment in comments" :key="comment.id">
                                <v-list-item class="px-0 py-0">
                                    <v-list-item-content class="px-0 py-0">
                                        <!-- LIGNE 1 -->
                                        <div v-if="sessionUserId === comment.user_id || sessionUserRole === 2">
                                            <div class="px-5">
                                                <v-card-actions class="d-flex justify-space-between align-center">
                                                    <v-btn color="red" aria-label="Modifier ce commentaire" @click.stop="dialogUpdateCommentUp(comment.content, comment.id)" v-if="sessionUserId === comment.user_id">
                                                        <v-icon dense>mdi-comment-edit</v-icon>
                                                        <span class="ml-1 d-none d-sm-inline">Modifier</span>
                                                    </v-btn>
                                                    <v-btn color="red" aria-label="Supprimer ce commentaire" @click="deleteComment(comment.id)" v-if="sessionUserId === comment.user_id || sessionUserRole === 2">
                                                        <v-icon dense>mdi-delete</v-icon>
                                                        <span class="ml-1 d-none d-sm-inline">Supprimer</span>
                                                    </v-btn>
                                                </v-card-actions>
                                            </div>
                                            <v-divider class="red lighten-4"></v-divider>
                                        </div>
                                        <!-- LIGNE 2 -->
                                        <div class="px-5 py-0 text-overline">Publié par {{ comment.first_name }} {{ comment.last_name }} | Le {{ formatCreationDate(comment.creation_date) }}</div>
                                        <v-divider class="red lighten-4 mb-3"></v-divider>
                                        <!-- LIGNE 3 -->
                                        <div class="px-5 mb-3">{{ comment.content }}</div>
                                        <!-- DIALOGUE DE MODIFICATION DE COMMENTAIRE -->
                                        <v-dialog v-model="dialogUpdateComment" persistent max-width="600px">
                                            <v-card>
                                                <v-card-title class="d-flex justify-center">
                                                    <span class="text-h5 mb-3">Modifier votre commentaire :</span>
                                                </v-card-title>
                                                <v-card-text class="pb-0">
                                                    <v-form ref="form" v-model="valid" >
                                                        <v-textarea rows="1" v-model="updatedComment" ref="updatedComment" :rules="commentRules" counter="320" label="Le commentaire (*)" type="text" prepend-icon="mdi-comment-text" color="black" outlined clearable clear-icon="mdi-eraser" auto-grow></v-textarea>
                                                    </v-form>
                                                    <small>Champs requis (*)</small>
                                                </v-card-text>
                                                <v-card-actions class="pt-0">
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="blue darken-1" aria-label="Annuler la modification du commentaire" text @click="dialogUpdateComment = false">
                                                        Annuler
                                                    </v-btn>
                                                    <v-btn color="green darken-1" aria-label="Valider la modification du commentaire" text :disabled="!valid" @click="updateComment()">
                                                        Valider
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                            <!-- COMMENTER -->
                            <v-card width="550" class="mx-auto rounded-lg mb-3 d-flex justify-space-between">
                                <v-card-text class="pb-1">
                                        <v-form ref="form" v-model="valid" >
                                            <v-textarea rows="1" v-model="comment" ref="comment" :rules="commentRules" counter="320" label="Écrire un commentaire" type="text" color="black" outlined clearable clear-icon="mdi-eraser" auto-grow></v-textarea>
                                        </v-form>
                                </v-card-text>
                                <v-card-actions class="pa-0 pb-4 mr-1">
                                        <v-btn :disabled="!valid" aria-label="Créer le commentaire" color="green" icon @click="createComment()">
                                            <v-icon>mdi-send</v-icon>
                                        </v-btn>
                                </v-card-actions>
                            </v-card>
                        </section>
                    </article>
                </section>
            </v-main>
        </v-container>
    </div>
</template>

<script>
import HeaderLogged from '../components/HeaderLogged.vue'
import PostsNav from '../components/PostsNav.vue'
import jwt from "jsonwebtoken"
import axios from 'axios'

export default {
    name: "OnePost",
    components: {
        HeaderLogged,
        PostsNav,
    },
    data() {
        return {
            //Par défaut
            accedAccount: false, // Accès non autorisé à cette page
            sessionUserId: 0,
            sessionUserRole: 0,
            post: [],
            imageAlt: "",
            comments: [],
            likeColor: [],
            dislikeColor: [],
            dialogUpdatePost: false,
            dialogUpdateComment: false,
            valid: true,
            title: '',
            titleRules: [
                v => /^[A-Za-z\d\séÉèÈêÊàÀâÂôÔëËçÇùÙûÛîÎïÏ&!-',:]{2,70}$/.test(v) || "Titre incorrect !",
                v => v.length <= 70 || '70 caractères maximum !',
            ],
            description: '',
            descriptionRules: [
                v => /^[a-zA-Z\d\séÉèÈêÊàÀâÂôÔëËçÇùÙûÛîÎïÏ&-_',!?:""«».]{10,320}$/.test(v) || "Description incorrect !",
                v => v.length <= 320 || '320 caractères maximum !',
            ],
            image: '',
            imageRules: [
                value => !value || value.size < 3000000 || "L'image ne doit pas dépasser 3 MB !",
            ],
            comment: '',
            commentRules: [
                v => /^[a-zA-Z\d\séÉèÈêÊàÀâÂôÔëËçÇùÙûÛîÎïÏ&-_',!?:""«».]{10,320}$/.test(v) || "Commentaire incorrect !",
                v => v.length <= 320 || '320 caractères maximum !',
            ],
            updatedComment: '',
        }
    },
    created(){
        // Vérifier que l'utilisateur est bien connecté avant d'avoir accès à cette page
        this.connectedUser()
    },
    beforeMount() {
        // Si l'utilisateur a accès à cette page (est connecté)
        if (this.accedAccount === true) {
            const token = JSON.parse(localStorage.user).token; // Récupèrer le token du localStorage
            let decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Décoder ce token en le vérifiant
            this.sessionUserId = decodedToken.userId; // l'ID de l'user pour la session = l'user Id décodé
            this.sessionUserRole = decodedToken.adminRole; // le rôle de l'user pour la session = le rôle admin décodé
            this.getOnePost();
            this.getComments();
        }
    },
    methods: {
        connectedUser(){
            // Si l'user n'est pas stocké dans le localStorage
            if (localStorage.user == undefined){
                this.accedAccount = false;
                console.log("Accès non autorisé !")
            } else { // Si l'user est bien stocké dans le localStorage
                this.accedAccount = true;
                console.log("Accès autorisé à l'utilisateur !");
            }
        },
        getOnePost(){
            const postId = this.$route.params.id;
            const token = JSON.parse(localStorage.user).token;
            
            axios.get(`http://localhost:3000/api/posts/${postId}`, {headers: {Authorization: 'Bearer ' + token}})
            .then(res => {
                if (res.data[0] === undefined){
                    this.post = 0
                } else {
                    this.post = res.data[0]; // Le post
                    if(this.post.opinion === null || this.post.opinion === 1) {// Pas d'opinion OU opinion annulée
                        this.likeColor = { color: "green lighten-2" };
                        this.dislikeColor = { color: "red lighten-3" };
                    }
                    if(this.post.opinion === 2) {// Post liké
                        this.likeColor = { color: "green darken-2" };
                        this.dislikeColor = { color: "red lighten-3" };
                    }
                    if(this.post.opinion === -2) {// Post disliké
                        this.likeColor = { color: "green lighten-2" };
                        this.dislikeColor = { color: "red accent-4" };
                    }
                    console.log("Le post " + this.post.id + " est bien affiché !");

                    // Récupérer le nom de l'image qui sera le texte alternatif
                    const image = this.post.image_url;
                    const lastUnderscore = image.lastIndexOf("_");
                    const lastSlash = image.lastIndexOf("/") + 1;
                    this.imageAlt = image.slice(lastSlash, lastUnderscore).split("_").join(" ");
                }
            })
        },
        dialogUpdatePostUp(postTitle, postDescription, postImageUrl, postId){
            // Récupérer les données du post
            this.post.title = postTitle;
            this.post.description = postDescription;
            this.post.image_url = postImageUrl;
            this.post.id = postId;
            // Activer la boîte de dialogue
            this.dialogUpdatePost = true;
            // Afficher les anciennes données du post
            this.title = postTitle
            this.description = postDescription;
            this.image = postImageUrl;
        },
        updatePost(){
            // Les données nécessaires
            const postId = this.post.id;
            const token = JSON.parse(localStorage.user).token;
            //Les données à envoyer
            const userId = this.sessionUserId;
            const title = this.title;
            const description = this.description;
            const image = this.image;

            // Récupérer l'extension de l'image quand il y en a une
            if (image !== ""){
                var fileName = image.name;
                var lastDot = fileName.lastIndexOf(".") + 1;
                var extensionFile = fileName.slice(lastDot, fileName.length).toLowerCase();
            }

            if (extensionFile == "gif" || image === undefined || image === ""){
                const formDataPost = new FormData();
                // Ajouter des nouvelles paires clé/valeur
                formDataPost.append("postId", postId);
                formDataPost.append("userId", userId);
                formDataPost.append("title", title);
                formDataPost.append("description", description);
                formDataPost.append("image", image);

                for (var pair of formDataPost.entries()) {
                    console.log(pair[0]+ ', ' + pair[1]); 
                }

                axios.put(`http://localhost:3000/api/posts/${postId}`,
                // Données à envoyer
                    formDataPost
                ,
                // En-têtes de requête
                {
                    headers: {
                    'Authorization': 'Bearer ' + token
                    }
                })
                
                .then(res => {
                    if (res.status === 200){
                        alert(res.data.message);
                        this.dialogUpdatePost = false;
                        location.reload()
                    }
                })
                .catch(error => {
                    console.log(error.response.data.error);
                    alert(error.response.data.error);
                    setTimeout(function(){location.reload()}, 60000)
                });
            } else {
                alert("❗ Attention\nSeules les images au format GIF sont autorisées !")
            }
        },
        deletePost(id){
            const postId = id;
            const token = JSON.parse(localStorage.user).token;
            axios.delete(`http://localhost:3000/api/posts/${postId}`, {headers: {Authorization: 'Bearer ' + token}})
            .then((res) => {
                if(res.status === 200) {
                    alert(res.data.message);
                    this.$router.push('/account/forum')
                }
            })
            .catch(error => {
                console.log(error.response.data.error);
                alert(error.response.data.error);
            })
        },
        modifyLike(){
            const token = JSON.parse(localStorage.user).token;
            //Récupérer les données du post à envoyer
            const userId = this.sessionUserId;
            const postId = this.post.id;
            const userOpinion = this.post.opinion;
            if (userOpinion === 2){// Post déjà liké => souhaite l'annuler
                const opinion = 1;
                const alreadyRated = true;

                axios.post(`http://localhost:3000/api/posts/${postId}/opinion`,{
                // Données à envoyer
                    userId, postId, opinion, alreadyRated
                },
                // En-têtes de requêtes
                {
                    headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
                })
                .then(response => {
                    this.post.opinion = 1; // Like annulé
                    this.post.likesNumber --;
                    this.likeColor = { color: "green lighten-2" };
                    console.log(response.data.message);
                })
            } else {
                if (userOpinion === null){// Post jamais liké auparavant => souhaite liker
                    const opinion = 2;
                    const alreadyRated = false;

                    axios.post(`http://localhost:3000/api/posts/${postId}/opinion`,{
                        // Données à envoyer
                        userId, postId, opinion, alreadyRated
                    },
                        // En-têtes de requêtes
                    {
                        headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
                    })
                    .then(response => {
                        this.post.opinion = 2; // Post liké
                        this.post.likesNumber ++;
                        this.likeColor = { color: "green darken-2" };
                        console.log(response.data.message);
                    })
                }
                if (userOpinion === 1){// Post déjà liké/disliké auparavant puis annulé => souhaite liker
                const opinion = 2;
                const alreadyRated = true;

                    axios.post(`http://localhost:3000/api/posts/${postId}/opinion`,{
                        // Données à envoyer
                        userId, postId, opinion, alreadyRated
                    },
                        // En-têtes de requêtes
                    {
                        headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
                    })
                    .then(response => {
                        this.post.opinion = 2; // Post liké
                        this.post.likesNumber ++;
                        this.likeColor = { color: "green darken-2" };
                        console.log(response.data.message);
                    })
                }
                if (userOpinion === -2){// Post déjà disliké auparavant => souhaite liker
                const opinion = 2;
                const alreadyRated = true;

                    axios.post(`http://localhost:3000/api/posts/${postId}/opinion`,{
                        // Données à envoyer
                        userId, postId, opinion, alreadyRated
                    },
                        // En-têtes de requêtes
                    {
                        headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
                    })
                    .then(response => {
                        this.post.opinion = 2; // Post liké
                        this.post.dislikesNumber --;
                        this.post.likesNumber ++;
                        this.dislikeColor = { color: "red lighten-3" };
                        this.likeColor = { color: "green darken-2" };
                        console.log(response.data.message);
                    })
                }
            }
        },
        modifyDislike(){
            const token = JSON.parse(localStorage.user).token;
            //Récupérer les données du post à envoyer
            const userId = this.sessionUserId;
            const postId = this.post.id;
            const userOpinion = this.post.opinion;
            if (userOpinion === -2){// Post déjà disliké => souhaite l'annuler
                const opinion = 1;
                const alreadyRated = true;

                axios.post(`http://localhost:3000/api/posts/${postId}/opinion`,{
                // Données à envoyer
                    userId, postId, opinion, alreadyRated
                },
                // En-têtes de requêtes
                {
                    headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
                })
                .then(response => {
                    this.post.opinion = 1; // Dislike annulé
                    this.post.dislikesNumber --;
                    this.dislikeColor = { color: "red lighten-3" };
                        console.log(response.data.message);
                })
            } else {
                if (userOpinion === null){// Post jamais disliké auparavant => souhaite disliker
                    const opinion = -2;
                    const alreadyRated = false;

                    axios.post(`http://localhost:3000/api/posts/${postId}/opinion`,{
                        // Données à envoyer
                        userId, postId, opinion, alreadyRated
                    },
                        // En-têtes de requêtes
                    {
                        headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
                    })
                    .then(response => {
                        this.post.opinion = -2; // Post disliké
                        this.post.dislikesNumber ++;
                        this.dislikeColor = { color: "red accent-4" };
                        console.log(response.data.message);
                    })
                }
                if (userOpinion === 1){// Post déjà liké/disliké auparavant puis annulé => souhaite disliker
                const opinion = -2;
                const alreadyRated = true;

                    axios.post(`http://localhost:3000/api/posts/${postId}/opinion`,{
                        // Données à envoyer
                        userId, postId, opinion, alreadyRated
                    },
                        // En-têtes de requêtes
                    {
                        headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
                    })
                    .then(response => {
                        this.post.opinion = -2; // Post disliké
                        this.post.dislikesNumber ++;
                        this.dislikeColor = { color: "red accent-4" };
                        console.log(response.data.message);
                    })
                }
                if (userOpinion === 2){// Post déjà liké auparavant => souhaite disliker
                const opinion = -2;
                const alreadyRated = true;

                    axios.post(`http://localhost:3000/api/posts/${postId}/opinion`,{
                        // Données à envoyer
                        userId, postId, opinion, alreadyRated
                    },
                        // En-têtes de requêtes
                    {
                        headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
                    })
                    .then(response => {
                        this.post.opinion = -2; // Post disliké
                        this.post.likesNumber --;
                        this.post.dislikesNumber ++;
                        this.likeColor = { color: "green lighten-2" };
                        this.dislikeColor = { color: "red accent-4" };
                        console.log(response.data.message);
                    })
                }
            }
        },
        getComments(){
            const postId = this.$route.params.id;
            const token = JSON.parse(localStorage.user).token;
            
            axios.get(`http://localhost:3000/api/posts/${postId}/comments`, {headers: {Authorization: 'Bearer ' + token}})
            .then(res => {
                if (res.data[0] === undefined){
                    this.comments = 0
                } else {
                    this.comments = res.data; // Les commentaires
                    
                    console.log("Les commentaires du post " + this.post.id + " sont bien affichés !");
                }
            })
        },
        createComment(){
            const token = JSON.parse(localStorage.user).token;
            //Les données à envoyer
            const userId = this.sessionUserId;
            const postId = this.post.id;
            const content = this.$refs.comment.value;

            axios.post(`http://localhost:3000/api/posts/${postId}/comments`,{
                // Données à envoyer
                    userId, postId, content
                },
                // En-têtes de requêtes
                {
                    headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
                })
                .then(response => {
                    // Si la connexion a bien été effectuée
                    if (response.status === 201){
                        this.comments = response.data; // Le commentaire
                        alert(response.data.message)
                        location.reload()
                    }
                })
                .catch(error => {
                    console.log(error.response.data.error);
                    alert(error.response.data.error)
                })
        },
        dialogUpdateCommentUp(commentContent, commentId){
            // Récupérer les données du commentaires
            this.comments.content = commentContent;
            this.comments.id = commentId;
            // Activer la boîte de dialogue
            this.dialogUpdateComment = true;
            // Afficher les anciennes données du commentaire
            this.updatedComment = commentContent
        },
        updateComment(){
            // Les données nécessaires
            const commentId = this.comments.id;
            const token = JSON.parse(localStorage.user).token;
            //Les données à envoyer
            const content = this.updatedComment;

            axios.put(`http://localhost:3000/api/posts/comments/${commentId}`,{
                // Données à envoyer
                    commentId, content
                },
                // En-têtes de requêtes
                {
                    headers: {Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'}
                })
                .then(response => {
                    if (response.status === 200){
                        alert(response.data.message);
                        this.dialogUpdateComment = false;
                        location.reload()
                    }
                })
                .catch(error => {
                    console.log(error.response.data.error);
                    alert(error.response.data.error)
                })
        },
        deleteComment(id){
            const commentId = id;
            const token = JSON.parse(localStorage.user).token;
            axios.delete(`http://localhost:3000/api/posts/comments/${commentId}`, {headers: {Authorization: 'Bearer ' + token}})
            .then((res) => {
                if(res.status === 200) {
                    alert(res.data.message);
                    location.reload()
                }
            })
            .catch(error => {
                console.log(error.response.data.error);
                alert(error.response.data.error);
            })
        },
        formatCreationDate(date){
            const event = new Date(date);
            const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return event.toLocaleDateString('fr-FR', options); // Ex: 26 juillet 2021, 16:37
        }
    }
}
</script>

<style lang="scss">

    .comment{
        width: 15rem;
        &--xsss{
            @media (min-width: 380px) and (max-width: 459px) {
                width: 20rem;
            }
        }
        &--xss{
            @media (min-width: 460px) and (max-width: 549px) {
                width: 25rem;
            }
        }
        &--xs{
            @media (min-width: 550px) and (max-width: 649px) {
                width: 30rem;
            }
        }
        &--sm{
            @media (min-width: 650px) {
                width: fit-content;
            }
        }
    }
    
</style>