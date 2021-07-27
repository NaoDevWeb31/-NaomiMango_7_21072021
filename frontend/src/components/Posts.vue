<template>
    <v-row class="d-flex flex-column">
        <!-- SI PAS DE POSTS -->
        <v-col v-if="posts.length === 0">
            <p class="text-center mx-auto my-15 text-h4">Le forum est vide !</p>
        </v-col>
        <!-- POST -->
        <v-col cols="12" class="mt-3" v-for="post in posts" :key="post.id">
            <v-card width="500" class="mx-auto rounded-lg">
                <v-list-item five-line class="px-0 py-0">
                    <v-list-item-content class="px-0 py-0">
                        <div class="px-5 py-1 text-overline">Publié par {{ post.first_name }} {{ post.last_name }} | Le {{ formatCreationDate(post.creation_date) }}</div>
                        <v-divider class="red lighten-4 mb-3"></v-divider>
                        <router-link class="router-link black--text" :to="{ name : 'OnePost', params: { id: post.id }}">
                            <div class="px-5 py-2 text-h5">{{ post.title }}</div>
                            <div class="px-5 py-2">{{ post.description }}</div>
                            <div class="px-5 pt-3 pb-5 d-flex justify-center">
                                <v-img :src="post.image_url" cover width="200"/>
                            </div>
                        </router-link>
                        <v-divider class="mb-0 red lighten-4"></v-divider>
                        <div class="d-flex flex-md-row align-center mb-1">
                            <div class="px-2 text-body-1">
                                <v-btn text icon color="black lighten-2">
                                    <v-icon color="green">mdi-thumb-up</v-icon>
                                </v-btn>
                                Nombre de Like
                            </div>
                            <v-divider vertical class="red lighten-4"></v-divider>
                            <div class="pl-2 text-body-1">
                                <v-btn text icon color="black lighten-2">
                                    <v-icon color="red darken-1">mdi-thumb-down</v-icon>
                                </v-btn>
                                Nombre de Dislike
                            </div>
                            <v-divider vertical class="red lighten-4 ml-4"></v-divider>
                            <div class="px-2 text-body-1">Commentaires (Nombre de commentaire)</div>
                        </div>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import axios from 'axios'

export default {
    name: "Posts",
    data() {
        return {
            posts: [],

        }
    },
    mounted() {
        this.getAllPosts()
    },
    methods: {
        getAllPosts(){
            const token = JSON.parse(localStorage.user).token;
            axios.get("http://localhost:3000/api/posts", {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                this.posts = res.data[0]; // Tous les posts
            })
        },
        formatCreationDate(date){
            const event = new Date(date);
            const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return event.toLocaleDateString('fr-FR', options); // Ex: 26 juillet 2021, 16:37
        }
    },
}
</script>