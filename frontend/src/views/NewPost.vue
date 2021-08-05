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
                            Créez un Nouveau Post
                        </h1>
                    </v-col>
                </section>
                <!-- FORMULAIRE NOUVEAU POST -->
                <section class="row mx-3 mx-sm-auto">
                    <v-col cols="12" class="d-sr-only">
                        <h2 class="text-center mx-auto text-h6 text-sm-h5">Formulaire de création d'un post</h2>
                    </v-col>
                    <v-card outlined elevation="3" class="my-4 mx-auto pt-3" width="30rem">
                        <v-card-text>
                            <v-form ref="form" v-model="valid" >
                                <v-text-field v-model="title" ref="title" :rules="titleRules" counter="70" label="Titre du post (*)" type="text" required prepend-icon="mdi-format-title" color="black" outlined clearable clear-icon="mdi-eraser"></v-text-field>
                                <v-textarea v-model="description" ref="description" :rules="descriptionRules" counter="320" label="Description du post (*)" type="text" prepend-icon="mdi-text" color="black" outlined clearable clear-icon="mdi-eraser" auto-grow></v-textarea>
                                <v-file-input v-model="image" ref="image" :rules="imageRules" accept="image/gif" label="Image du post" type="file" filled prepend-icon="mdi-camera" show-size color="black"></v-file-input>
                                <div class="my-1 text-right">Champs requis (*)</div>
                                <v-divider class="mt-9"></v-divider>
                                <v-card-actions class="d-flex justify-space-between">
                                    <v-btn :disabled="!valid" aria-label="Créer le post" color="success" class="mt-3" @click="createPost()">Créer le post</v-btn>
                                    <v-btn color="red lighten-1" aria-label="Annuler la création du post" dark class="mt-3" @click="backToForum()">Annuler</v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </section>
            </v-main>
        </v-container>
    </div>
</template>

<script>
import HeaderLogged from '../components/HeaderLogged.vue'
import jwt from "jsonwebtoken"
import axios from 'axios'

export default {
    name: "NewPost",
    components: {
        HeaderLogged,
    },
    data() {
        return {
            //Par défaut
            accedAccount: false, // Accès non autorisé à cette page
            sessionUserId: 0,
            sessionUserRole: 0,
            valid: true,
            title: '',
            description: '',
            image: '',
            titleRules: [
                v => !!v || 'Veuillez renseigner un titre !',
                v => /^[A-Za-z\d\séÉèÈêÊàÀâÂôÔëËçÇùÙûÛîÎïÏ&!-',:]{2,70}$/.test(v) || "Titre incorrect !",
                v => v.length <= 70 || '70 caractères maximum !',
            ],
            descriptionRules: [
                v => !!v || 'Veuillez renseigner une description !',
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
            const token = JSON.parse(localStorage.user).token; // Récupèrer le token du localStorage
            let decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Décoder ce token en le vérifiant
            this.sessionUserId = decodedToken.userId; // l'ID de l'user pour la session = l'user Id décodé
            this.sessionUserRole = decodedToken.adminRole; // le rôle de l'user pour la session = le rôle admin décodé
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
        createPost(){
            //Récupérer les données à envoyer
            const userId = this.sessionUserId;
            const title = this.$refs.title.value;
            const description = this.$refs.description.value;
            const image = this.$refs.image.value;
            
            // Récupérer l'extension de l'image quand il y en a une
            if (image !== ""){
                var fileName = image.name;
                var lastDot = fileName.lastIndexOf(".") + 1;
                var extensionFile = fileName.slice(lastDot, fileName.length).toLowerCase();
            }

            if (extensionFile == "gif" || image === undefined || image === ""){
                const formDataPost = new FormData();
                // Ajouter des nouvelles paires clé/valeur 
                formDataPost.append("userId", userId);
                formDataPost.append("title", title);
                formDataPost.append("description", description);
                formDataPost.append("image", image);

                const token = JSON.parse(localStorage.user).token;
                axios.post("http://localhost:3000/api/posts/",
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
                    if (res.status === 201){
                        alert(res.data.message);
                        this.$router.push('/account/forum')
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
        backToForum(){
            this.$router.push('/account/forum')
        }
    }
}
</script>