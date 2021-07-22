<template>
  <div class="home">
    <v-container>
      <Header/>
      <v-row class="text-center">
        <v-col cols="12">
          <!-- LOGO -->
          <v-img :src="require('../assets/icon-left-font.png')" class="my-3" contain height="200"/>
        </v-col>

        <!-- TITRE -->
        <v-col class="mb-2">
          <h1 class="display-2 font-weight-bold mb-3">
            Bienvenue sur le réseau interne de Groupomania !
          </h1>
          <p class="headline font-weight-regular">
            Échangez en toute liberté entre collègues !
            <br>Partagez et commentez vos GIFs.
          </p>
        </v-col>
      </v-row>
      <v-row class="text-center mb-4">
        <!-- BOUTON INSCRIPTION -->
        <v-col cols="6">
          <router-link to="/signup">
            <v-btn x-large color="red">
              <span class="mr-2">Inscrivez-vous</span>
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </router-link>
        </v-col>
        <!-- BOUTON CONNEXION -->
        <v-col cols="6">
          <router-link to="/login">
            <v-btn x-large color="red">
              <span class="mr-2">Connectez-vous</span>
              <v-icon>mdi-login-variant</v-icon>
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Header from '../components/Header.vue'

  export default {
    name: 'Home',
    components: {
      Header
    },
  }
</script>
