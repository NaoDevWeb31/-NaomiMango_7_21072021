<template>
    <div class="header">
        <!-- BARRE DE NAVIGATION -->
        <v-app-bar
        app
        color="red"
        dark
        >
        <!-- LOGO -->
            <router-link to="/">
                <div class="d-flex align-center">
                    <v-img
                    alt="Logo de l'entreprise Groupomania"
                    class="shrink mr-2"
                    contain
                    src="../assets/icon-left-font-monochrome-white.png"
                    transition="scale-transition"
                    width="100"
                    />
                </div>
            </router-link>
            <v-spacer></v-spacer>
            <!-- BOUTON PAGE -->
            <router-link to="." v-if="rightLocation() == true">
                <div class="mx-6">
                    <v-btn outline>
                        <v-icon>mdi-arrow-left</v-icon>
                        <span class="d-none d-sm-inline ml-1">Page précédente</span>
                    </v-btn>
                </div>
            </router-link>
            <!-- BOUTON INSCRIPTION -->
                <div class="d-flex align-center">
                    <v-btn v-on:click="deconnect()" color="dark">
                        <span class="d-none d-sm-inline mr-1">Se déconnecter</span>
                        <v-icon>mdi-logout-variant</v-icon>
                    </v-btn>
                </div>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    name: "HeaderLogged",
    methods: {
        deconnect(){
            localStorage.clear();
            this.$router.push('/')
        },
        rightLocation(){
            let locationURL = location.href;
            //Page qui n'a pas besoin du headerLogged
            let accountPageUrl = "http://localhost:8080/account";
            
            if (locationURL != accountPageUrl){
                return true
            }
        },//À REVISITER
        notOnePostPage(){
            //Récupérer l'id du post dans l'URL
            let locationURL = location.href;
            let postId = locationURL.split("posts/")[1];
            let postIdNumber = parseInt(postId);
            //Page qui n'a pas besoin du headerLogged
            let postPageUrl = "http://localhost:8080/account/forum/posts/" + postIdNumber;// URL avec id
            
            if (locationURL != postPageUrl){
                return true
            }
        }
    },
}
</script>