<template>
  <v-container>
    <Header/>
    <!-- TITRE -->
    <v-row class="text-center my-4">
        <v-col cols="12">
          <h1 class="display-2 font-weight-bold">
            Connectez-vous à votre compte !
          </h1>
        </v-col>
    </v-row>
    <!-- FORMULAIRE CONNEXION -->
    <v-row>
      <v-card raised class="my-4 mx-auto pt-5" width="30rem" height="17rem">
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field v-model="email" :rules="emailRules" label="E-mail (*)" type="email" required prepend-icon="mdi-at" color="black"></v-text-field>
            <v-text-field v-model="password" :rules="passwordRules" label="Mot de passe (*)" type="password" required prepend-icon="mdi-lock-outline" color="black"></v-text-field>
            <div class="my-1 text-right">Champs requis (*)</div>
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Connexion</v-btn>
          </v-form>
      </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Header from '../components/Header.vue'

  export default {
    name: 'Login',
    components: {
      Header
    },
    data: () => ({
      valid: true,
      email: '',
      password: '',
      emailRules: [
        v => !!v || 'Veuillez renseigner votre adresse e-mail !',
        v => /^[a-zA-Z0-9&^_¨-]+(?:.[a-zA-Z0-9&^_¨-]+)@[a-zA-Z]+[.](?:[a-z]{2,3})$/.test(v) || 'Adresse e-mail incorrecte !',
      ],
      passwordRules: [
        v => !!v || 'Veuillez renseigner votre mot de passe!',
      ],
    }),
  }
</script>
