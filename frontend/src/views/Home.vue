<template>
    <v-container class="bg-img fill-height">
      <Header/>
      <v-main>
        <v-row class="text-center">
          <!-- TITRE -->
          <v-col class="py-16 mt-md-10">
            <h1 class="text-h5 text-sm-h4 text-md-h3 font-weight-bold mt-10 mt-sm-16 mb-3">
              Bienvenue sur le réseau interne de Groupomania !
            </h1>
            <h2 class="text-body-1 text-sm-h6 text-sm-h5 font-weight-regular mt-5">
              Échangez en toute liberté entre collègues !
              <br>Partagez et commentez vos GIFs.
            </h2>
          </v-col>
        </v-row>
        <v-row class="text-center d-flex flex-column align-center flex-sm-row">
          <!-- BOUTON INSCRIPTION -->
          <v-col cols="12" sm="6">
            <v-btn x-large color="red" @click="goSignUp()">
              <span class="mr-2">Inscrivez-vous</span>
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </v-col>
          <!-- BOUTON CONNEXION -->
          <v-col cols="12" sm="6">
            <v-btn x-large color="red" @click="goLogin()">
              <span class="mr-2">Connectez-vous</span>
              <v-icon>mdi-login-variant</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-main>
    </v-container>
</template>

<script>
import Header from '../components/Header.vue'

  export default {
    name: 'Home',
    components: {
      Header
    },
    methods: {
      goSignUp(){
        this.$router.push('/signup')
      },
      goLogin(){
        this.$router.push('/login')
      }
    },
  }
</script>

<style lang="scss">
  
  .bg-img{
      background-image: url("../assets/icon.png");
      background-position: 50% 50%;
      background-attachment: fixed;
      background-size: 50%;
      min-height: 35rem;
  }

</style>