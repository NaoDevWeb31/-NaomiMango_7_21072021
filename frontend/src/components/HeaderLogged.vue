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
            <router-link to=".">
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
        }
    },
}
</script>