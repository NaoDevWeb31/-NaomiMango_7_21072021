<template>
    <v-container class="fill-height" fluid>
        <p v-if="!accedAccount" class="display-1 text-center mx-auto" width="100%">Accès non autorisé !</p>
        
        <!-- Si l'utilisateur est bien connecté -->
        <HeaderLogged v-if="accedAccount"/>
        <v-main class="container fluid fill-height pa-3" v-if="accedAccount">
            <section class="row mt-8 my-sm-5">
                <v-col>
                    <h1 class="text-center text-h5 text-sm-h3">
                        Bienvenue sur votre compte
                        <span>{{firstName}}</span> !
                    </h1>
                </v-col>
            </section>
            <section class="row d-flex flex-column flex-sm-row justify-center">
                <!-- CARTE PROFIL -->
                <v-col cols="12" sm="6">
                    <router-link to="/account/profile">
                        <v-card>
                            <v-img class="white--text align-end" max-height="350px" :src="require('../assets/Profile.jpg')" alt="Silhouette du profil d'une femme avec le ciel en fond">
                                <v-card-title class="red py-2 py-sm-4">
                                    <h2 class="headline headline--xs mb-0 text-center h3">Mon Profil</h2>
                                </v-card-title>
                            </v-img>
                        </v-card>
                    </router-link>
                </v-col>
                <!-- CARTE FORUM -->
                <v-col cols="12" sm="6">
                    <router-link to="/account/forum">
                        <v-card>
                            <v-img class="white--text align-end" max-height="350px" :src="require('../assets/Forum.jpg')" alt="Chaises bleues vides en cercle dans un salle ">
                                <v-card-title class="red py-2 py-sm-4">
                                    <h2 class="headline headline--xs mb-0 text-center h3">Forum</h2>
                                </v-card-title>
                            </v-img>
                        </v-card>
                    </router-link>
                </v-col>
            </section>
        </v-main>
    </v-container>
</template>

<script>
import HeaderLogged from '../components/HeaderLogged.vue'

export default {
    name: 'Account',
    components: {
        HeaderLogged,
    },
    data() {
        return {
            // Par défaut, accès non autorisé à cette page
            accedAccount: false,
            firstName: "",
        }
    },
    beforeMount() {
        // Vérifier que l'utilisateur est bien connecté avant d'avoir accès à cette page
        this.connectedUser()
    },
    methods: {
        connectedUser(){
            // Si l'user n'est pas stocké dans le localStorage
            if (localStorage.user === undefined){
                this.accedAccount = false;
                console.log("Accès non autorisé !")
            } else { // Si l'user est bien stocké dans le localStorage
                this.accedAccount = true;
                console.log("Accès autorisé à l'utilisateur !");
                const user = JSON.parse(localStorage.getItem("user"));
                this.firstName = user.firstName; // Retourner le prénom de l'utilisateur
            }
        },
    },
}
</script>

<style lang="scss">

    .v-application .headline--xs{
            @media (max-width: 450px) {
                font-size: 1rem !important;
            }
    }
    
</style>