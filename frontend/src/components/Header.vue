<template>
    <div class="header">
        <!-- BARRE DE NAVIGATION -->
        <v-app-bar app color="red" dark>
        <!-- LOGO -->
            <router-link to="/">
                <div class="d-flex align-center">
                    <v-img
                    alt="Logo de l'entreprise Groupomania version blanche"
                    class="shrink mr-2"
                    contain
                    src="../assets/icon-left-font-monochrome-white.png"
                    transition="scale-transition"
                    width="100"
                    />
                <div class="black--text font-weight-medium ml-2 d-sr-only">Page d'accueil</div>
                </div>
            </router-link>
            <v-spacer></v-spacer>
            <!-- BOUTON PAGE PRÉCEDÉNTE -->
            <div class="mr-6" v-if="rightLocation() == true">
                <v-btn @click="getPreviousPage()" aria-label="Naviguer vers la page précédente">
                    <v-icon>mdi-arrow-left</v-icon>
                    <span class="d-none d-sm-inline ml-1">Page précédente</span>
                </v-btn>
            </div>
            <!-- BOUTON PAGE ACCOUNT -->
            <div v-if="accedAccount">
                <v-btn @click="getAccountPage()" aria-label="Aller sur mon compte">
                    <v-icon>mdi-account</v-icon>
                    <span class="d-none d-sm-inline ml-2">Mon Compte</span>
                </v-btn>
            </div>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            // Par défaut, accès non autorisé à cette page
            accedAccount: false,
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
            }
        },
        rightLocation(){
            var isRightLocation = false;
            const currentLocationURL = location.href;
            //Pages qui n'ont pas besoin du bouton "Page précédente"
            const signupPageUrl = "http://localhost:8080/signup";
            const loginPageUrl = "http://localhost:8080/login"
            
            if (currentLocationURL == signupPageUrl){
                isRightLocation = true;
            }
            if (currentLocationURL == loginPageUrl){
                isRightLocation = true;
            }
            return isRightLocation
        },
        getPreviousPage(){
            this.$router.push('/')
        },
        getAccountPage(){
            this.$router.push('/account')
        },
    },
}
</script>