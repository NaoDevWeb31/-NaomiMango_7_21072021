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
                <section class="row my-2">
                    <v-col>
                        <h1 class="text-center text-h4 text-sm-h3">
                            Bienvenue sur le Forum !
                        </h1>
                    </v-col>
                </section>
                <PostsNav/>
                <Posts/>
            </v-main>
        </v-container>
    </div>
</template>

<script>
import HeaderLogged from '../components/HeaderLogged.vue'
import Posts from '../components/Posts.vue'
import PostsNav from '../components/PostsNav.vue'

export default {
    name: "Forum",
    components: {
        HeaderLogged,
        PostsNav,
        Posts,
    },
    data(){
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
    },
}
</script>

