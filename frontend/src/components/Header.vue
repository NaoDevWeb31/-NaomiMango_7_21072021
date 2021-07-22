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
        </v-app-bar>
    </div>
</template>

<script>
export default {
    name: "Header",
}
</script>