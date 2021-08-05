<template>
    <v-container class="fill-height" fluid>
        <!-- Si l'utilisateur n'est pas bien connecté -->
        <p v-if="!accedAccount" class="display-1 text-center mx-auto" width="100%">Accès non autorisé !</p>
        
        <!-- Si l'utilisateur est bien connecté -->
        <HeaderLogged v-if="accedAccount"/>
        <v-main>
            <section v-if="accedAccount" class="row">
                <v-col class="my-2">
                    <h1 class="text-h3 text-sm-h2 text-center">Mon Profil</h1>
                </v-col>
            </section>
            <section v-if="accedAccount" class="row mx-3 mx-sm-auto d-flex flex-column flex-sm-row justify-center">
                <v-card raised class="pa-4 mx-auto" width="40rem" >
                    <h2 class="v-card__title">
                        Informations personnelles de l'utilisateur :
                    </h2>
                    <v-divider></v-divider>
                    <v-card-text>
                        <!-- NOM -->
                        <v-row class="d-flex flex-column align-center flex-sm-row justify-space-between">
                            <v-col cols="6" sm="3">
                                <p class="black--text text-center text-sm-left data grey lighten-3">Nom</p>
                            </v-col>
                            <v-col cols="12" sm="9">
                                <p class="black--text data grey lighten-1 text-center">{{ userProfile.lastName }}</p>
                            </v-col>
                        </v-row>
                        <!-- PRÉNOM -->
                        <v-row class="d-flex flex-column align-center flex-sm-row justify-space-between">
                            <v-col cols="6" sm="3">
                                <p class="black--text text-center text-sm-left data grey lighten-3">Prénom</p>
                            </v-col>
                            <v-col cols="12" sm="9">
                                <p class="black--text data grey lighten-1 text-center">{{ userProfile.firstName }}</p>
                            </v-col>
                        </v-row>
                        <!-- EMAIL -->
                        <v-row class="d-flex flex-column align-center flex-sm-row justify-space-between">
                            <v-col cols="6" sm="3">
                                <p class="black--text text-center text-sm-left data grey lighten-3">E-mail</p>
                            </v-col>
                            <v-col cols="12" sm="9">
                                <p class="black--text data grey lighten-1 text-center">{{ userProfile.email }}</p>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="d-flex justify-end mt-3">
                        <v-btn color="red" @click="deleteUser()" aria-label="Supprimer mon compte">Supprimer mon compte</v-btn>
                    </v-card-actions>
                </v-card>
            </section>
        </v-main>
    </v-container>
</template>

<script>
import HeaderLogged from '../components/HeaderLogged.vue'
import axios from "axios"
import jwt from "jsonwebtoken"

export default {
    name: 'Profile',
    components: {
        HeaderLogged,
    },
    data() {
        return {
            //Par défaut
            accedAccount: false, // Accès non autorisé à cette page
            sessionUserId: 0,
            sessionUserRole: 0,
            userProfile: [],
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
            this.getUserProfile();
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
        getUserProfile(){
            // l'ID de l'user pour la session
            const userId = this.sessionUserId;
            const token = JSON.parse(localStorage.user).token;
            axios.get(`http://localhost:3000/api/auth/users/${userId}`, {headers: {Authorization: 'Bearer ' + token}})
            .then(res => {
                this.userProfile = res.data; // Infos de l'user
            })
        },
        deleteUser(){
            if (confirm("❗ ALERTE ❗\nLa suppression d'un compte est définitive.\nConfirmez-vous la suppression de votre compte ?")) {
                // l'ID de l'user pour la session
                const userId = this.sessionUserId;
                const token = JSON.parse(localStorage.user).token;
                axios.delete(`http://localhost:3000/api/auth/users/${userId}`, {headers: {Authorization: 'Bearer ' + token}})
                .then(res => {
                    // Si l'inscription a bien été effectuée
                    if (res.status === 200){
                        localStorage.removeItem('user');
                        alert(res.data.message);
                        this.$router.push('/')
                    }
                })
                .catch(error => {
                    console.log(error.response.data.error);
                    alert(error.response.data.error);
                    location.reload()
                })
            }
        }
    },
}
</script>

<style lang="scss">

.data {
    font-size: 1.3rem ;
    border: 1px grey solid;
    border-radius: 1rem;
    padding: 1rem;
}

</style>