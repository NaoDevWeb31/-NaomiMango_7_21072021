<template>
    <div class="header">
        <!-- BARRE DE NAVIGATION -->
        <v-app-bar
        app
        color="red"
        dark
        >
        <!-- LOGO -->
            <router-link to="../">
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
            <!-- BOUTON INSCRIPTION -->
                <div class="d-flex align-center">
                    <v-btn v-on:click="deconnect()" color="dark">
                        Se déconnecter
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
            location.href = '../';
        }
    },
}
</script>