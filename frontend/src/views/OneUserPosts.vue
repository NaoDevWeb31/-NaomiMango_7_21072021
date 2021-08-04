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
                            Mes Posts
                        </h1>
                    </v-col>
                </section>
                <PostsNav/>
                <section class="row d-flex flex-column">
                    <!-- SI PAS DE POSTS -->
                    <v-col v-if="posts.length === 0">
                        <p class="text-center mx-auto my-15 text-h5 text-sm-h4">Aucun post trouvé !</p>
                    </v-col>
                    <!-- POSTS -->
                    <article class="col-12 mt-3" v-for="post in posts" :key="post.id">
                        <v-card width="600" class="mx-auto rounded-lg">
                            <v-list-item class="px-0 py-0">
                                <v-list-item-content class="px-0 py-0">
                                    <!-- LIGNE 1 -->
                                    <div class="px-5 py-1">
                                        <v-card-actions class="d-flex justify-space-between align-center">
                                            <v-btn color="red" aria-label="Modifier ce post" @click.stop="dialogUpdatePostUp(post.title, post.description, post.image_url, post.id)">
                                                <v-icon>mdi-file-document-edit</v-icon>
                                                <span class="ml-1 d-none d-sm-inline">Modifier</span>
                                            </v-btn>
                                            <v-btn color="red" aria-label="Supprimer ce post" @click="deletePost(post.id)">
                                                <v-icon>mdi-delete</v-icon>
                                                <span class="ml-1 d-none d-sm-inline">Supprimer</span>
                                            </v-btn>
                                        </v-card-actions>
                                    </div>
                                    <v-divider class="red lighten-4 mb-1"></v-divider>
                                    <!-- LIGNE 2 -->
                                    <div class="px-5 py-1 text-overline">Publié par {{ post.first_name }} {{ post.last_name }} | Le {{ formatCreationDate(post.creation_date) }}</div>
                                    <v-divider class="red lighten-4 mb-3"></v-divider>
                                    <!-- LIGNE 3 -->
                                    <router-link class="router-link black--text" :to="{ name : 'OnePost', params: { id: post.id }}">
                                        <div class="px-5 py-2 text-h5">{{ post.title }}</div>
                                        <div class="px-5 py-2">{{ post.description }}</div>
                                        <div class="px-5 pt-3 pb-5 d-flex justify-center">
                                            <v-img :src="post.image_url" contain width="200" :alt="getImageAlt(post.id, post.image_url)"/>
                                        </div>
                                    </router-link>
                                    <v-divider class="mb-0 red lighten-4"></v-divider>
                                    <!-- LIGNE 4 -->
                                    <div class="d-flex flex-md-row align-center mb-1">
                                        <div class="px-2 text-body-1">
                                            <!-- SI PAS DE LIKE -->
                                            <v-btn text icon aria-label="Liker ce post" class="btn-opinion" color="green darken-2" v-if="post.likesNumber > 0">
                                                <v-icon>mdi-thumb-up</v-icon>
                                            </v-btn>
                                            <!-- SI LIKE -->
                                            <v-btn text icon aria-label="Liker ce post" class="btn-opinion" color="green lighten-2" v-else>
                                                <v-icon>mdi-thumb-up</v-icon>
                                            </v-btn>
                                            {{ post.likesNumber }}
                                        </div>
                                        <v-divider vertical class="red lighten-4"></v-divider>
                                        <div class="pl-2 text-body-1">
                                            <!-- SI PAS DE DISLIKE -->
                                            <v-btn text icon aria-label="Disliker ce post" class="btn-opinion" color="red accent-4" v-if="post.dislikesNumber > 0">
                                                <v-icon>mdi-thumb-down</v-icon>
                                            </v-btn>
                                            <!-- SI DISLIKE -->
                                            <v-btn text icon aria-label="Disliker ce post" class="btn-opinion" color="red lighten-3" v-else>
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
                                                <span class="text-h5 mb-2">Modifier votre post</span>
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
                    </article>
                </section>
            </v-main>
        </v-container>
    </div>
</template>

<script>
import HeaderLogged from '../components/HeaderLogged.vue'
import PostsNav from '../components/PostsNav.vue'
import axios from 'axios'

export default {
    name: "OneUserPosts",
    components: {
        HeaderLogged,
        PostsNav,
    },
    data() {
        return {
            //Par défaut
            accedAccount: false, // Accès non autorisé à cette page
            posts: [],
            dialogUpdatePost: false,
            valid: true,
            title: '',
            description: '',
            image: '',
            titleRules: [
                v => /^[A-Za-z\d\séÉèÈêÊàÀâÂôÔëËçÇùÙûÛîÎïÏ&!-',:]{2,70}$/.test(v) || "Titre incorrect !",
                v => v.length <= 70 || '70 caractères maximum !',
            ],
            descriptionRules: [
                v => /^[a-zA-Z\d\séÉèÈêÊàÀâÂôÔëËçÇùÙûÛîÎïÏ&-_',!?:""«».]{10,320}$/.test(v) || "Description incorrect !",
                v => v.length <= 320 || '320 caractères maximum !',
            ],
            imageRules: [
                value => !value || value.size < 3000000 || "L'image ne doit pas dépasser 3 MB !",
            ],
        }
    },
    created(){
        // Vérifier que l'utilisateur est bien connecté avant d'avoir accès à cette page
        this.connectedUser()
    },
    beforeMount() {
        // Si l'utilisateur a accès à cette page (est connecté)
        if (this.accedAccount === true) {
            this.getUserPosts();
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
        getUserPosts(){
            const token = JSON.parse(localStorage.user).token; // Récupèrer le token du localStorage
            axios.get(`http://localhost:3000/api/posts/user`, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                this.posts = res.data; // Tous les posts de l'utilisateur
                console.log("Les posts de l'utilisateur " + this.posts[0].user_id + " sont bien affichés !");
            })
        },
        getImageAlt(postId, postImageURL){
            this.posts.id = postId;
            // Récupérer le nom de l'image qui sera le texte alternatif
            this.posts.image_url = postImageURL;
            console.log(postImageURL);
            if (postImageURL !== ""){
                const lastUnderscore = postImageURL.lastIndexOf("_");
                const lastSlash = postImageURL.lastIndexOf("/") + 1;
                const imageAlt = postImageURL.slice(lastSlash, lastUnderscore).split("_").join(" ");
                return imageAlt
            }
        },
        dialogUpdatePostUp(postTitle, postDescription, postImageUrl, postId){
            // Récupérer les anciennes données du post
            this.posts.title = postTitle;
            this.posts.description = postDescription;
            this.posts.image_url = postImageUrl;
            this.posts.id = postId;
            // Activer la boîte de dialogue
            this.dialogUpdatePost = true;
            // Afficher les anciennes données du post
            this.title = postTitle
            this.description = postDescription;
            this.image = postImageUrl;
        },
        updatePost(){
            // Les données nécessaires
            const postId = this.posts.id;
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

    .btn-opinion{
        pointer-events: none;
    }

</style>