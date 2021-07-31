<template>
    <v-row class="my-3">
        <v-col>
            <nav>
                <v-card outlined class="rounded-md">
                    <v-list nav class="d-flex flex-column flex-sm-row justify-center text-center py-0 red lighten-3 text-h6 text-uppercase font-weight-medium">
                        <v-list-item class="mb-0">
                            <v-list-item-content>
                                <router-link class="black--text" to="/account/forum">Forum</router-link>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider class="d-sm-none"></v-divider>
                        <v-divider vertical class="d-none d-sm-flex"></v-divider>
                        <v-list-item class="mb-0">
                            <v-list-item-content>
                                <router-link class="black--text" to="/account/forum/create-post">Nouveau post</router-link>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider class="d-sm-none"></v-divider>
                        <v-divider vertical class="d-none d-sm-flex"></v-divider>
                        <v-list-item class="mb-0">
                            <v-list-item-content>
                                <router-link class="black--text" to="/account/forum/posts/user">Mes posts</router-link>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </nav>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "PostsNav",
}
</script>