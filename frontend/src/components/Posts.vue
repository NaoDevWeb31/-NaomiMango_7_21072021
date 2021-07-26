<template>
    <v-row class="d-flex flex-column">
        <!-- SI PAS DE POSTS -->
        <v-col>
            <p class="text-center mx-auto my-15 text-h4">Le forum est vide !</p>
        </v-col>
        <!-- POST -->
        <v-col cols="12" class="mt-3">
            <v-card  width="500" class="mx-auto">
                <v-list-item five-line class="px-0 py-0">
                    <v-list-item-content class="px-0 py-0">
                        <div class="px-5 py-1 text-overline">Publié par Prénom Nom | Le date de création</div>
                        <v-divider horizontal class="red lighten-4"></v-divider>
                        <!-- <router-link class="router-link" :to="{ name : 'OnePublication', params: { id: publication.publicationId }}"> -->
                            <div class="px-5 py-2 text-h5">Titre du post</div>
                            <div class="px-5 py-2">Description du post</div>
                            <div class="px-5 pt-3 pb-5 d-flex justify-center">
                                <v-img :src="require('../assets/Forum.jpg')" cover width="200"/>
                            </div>
                        <!-- </router-link> -->
                        <v-divider class="mb-0 red lighten-4" horizontal></v-divider>
                        <div class="d-flex flex-md-row align-center mb-1">
                            <div class="px-2 text-body-1">
                                <v-btn text icon color="green lighten-2" disabled>
                                    <v-icon color="green">mdi-thumb-up</v-icon>
                                </v-btn>
                                Nombre de Like
                            </div>
                            <v-divider vertical class="red lighten-4"></v-divider>
                            <div class="pl-2 text-body-1">
                                <v-btn text icon color="black lighten-2" disabled>
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
export default {
    name: "Posts",
}
</script>