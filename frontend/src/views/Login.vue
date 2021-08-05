<template>
  <v-container>
    <Header/>
    <v-main>
      <!-- TITRE -->
      <section class="row text-center my-4">
          <v-col cols="12">
            <h1 class="text-h4 text-sm-h3 font-weight-regular">
              Connectez-vous à votre compte !
            </h1>
          </v-col>
      </section>
      <!-- FORMULAIRE CONNEXION -->
      <section class="row mx-0">
        <v-col cols="12" class="d-sr-only">
          <h2 class="text-center mx-auto text-h6 text-sm-h5">Formulaire de connexion</h2>
        </v-col>
        <v-card raised class="my-4 mx-5 mx-sm-auto" width="30rem">
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="email" ref="email" :rules="emailRules" label="E-mail (*)" type="email" required prepend-icon="mdi-at" color="black"></v-text-field>
              <v-text-field v-model="password" ref="password" :rules="passwordRules" label="Mot de passe (*)" type="password" required prepend-icon="mdi-lock-outline" color="black"></v-text-field>
              <div class="my-1 text-right">Champs requis (*)</div>
              <v-divider class="mt-9"></v-divider>
              <v-card-actions>
                <v-btn :disabled="!valid" color="success" class="mr-4 mt-3" @click="login()">Connexion</v-btn>
              </v-card-actions>
            </v-form>
        </v-card-text>
        </v-card>
      </section>
    </v-main>
  </v-container>
</template>

<script>
import Header from '../components/Header.vue'
import axios from "axios"

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
    methods: {
        // Fonction permettant à l'utilisateur de se connecter
        login() {
          const email = this.$refs.email.value;
          const password = this.$refs.password.value;
          axios.post("http://localhost:3000/api/auth/login",{
            // Données à envoyer
            email, password
            },
            // En-têtes de requêtes
            {
            headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
            // Si l'inscription a bien été effectuée
            if (response.status === 200){
                const user = {
                    token: response.data.token,
                    userId: response.data.userId,
                    firstName: response.data.firstName,
                    adminRole: response.data.adminRole
                }
                localStorage.setItem('user', JSON.stringify(user));
                alert("Félicitation ! Vous êtes maintenant connecté !")
                this.$router.push('/account')
            }
          })
          .catch(error => {
            console.log(error);
            alert("Erreur lors de la connexion")
          })
        }
    },
  }
</script>
