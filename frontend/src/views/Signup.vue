<template>
    <v-container>
        <Header/>
        <!-- TITRE -->
        <v-row class="text-center my-4">
            <v-col cols="12">
                <h1 class="display-2 font-weight-bold">
                    Créez un nouveau compte !
                </h1>
            </v-col>
        </v-row>
        <!-- FORMULAIRE INSCRIPTION -->
        <v-row>
            <v-card raised class="my-4 mx-auto" width="30rem">
                <v-card-text>
                    <v-form ref="form" v-model="valid">
                        <v-text-field v-model="lasttName" :rules="lastNameRules" label="Nom de famille" type="text" prepend-icon="mdi-account-outline" color="black"></v-text-field>
                        <v-text-field v-model="firstName" :rules="firstNameRules" label="Prénom" type="text" prepend-icon="mdi-account-outline" color="black"></v-text-field>
                        <v-text-field v-model="email" :rules="emailRules" label="E-mail (*)" type="email" required prepend-icon="mdi-at" color="black"></v-text-field>
                        <v-text-field v-model="password" :rules="passwordRules" label="Mot de passe (*)" type="password" required prepend-icon="mdi-lock-outline" color="black"></v-text-field>
                        <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules" label="Confirmer votre mot de passe (*)" type="password" required prepend-icon="mdi-lock-outline" color="black"></v-text-field>
                        <div class="my-1 text-right">Champs requis (*)</div>
                        <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Inscription</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
import Header from '../components/Header.vue'

export default {
    name: 'Signup',
    components: {
        Header
    },
    data: () => ({
        valid: true,
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        confirmPassword: '',
        lastNameRules: [
            v => /^[A-Za-zéÉèÈêÊàÀôÔëËçîÎ'-]{2,20}$/.test(v) || "Nom de famille incorrect !",
        ],
        firstNameRules: [
            v => /^[A-Za-zéÉèÈêÊàÀôÔëËçîÎ'-]{2,20}$/.test(v) || "Prénom incorrect !",
            ],
        emailRules: [
            v => !!v || 'Veuillez renseigner votre adresse e-mail !',
            v => /^[a-zA-Z0-9&^_¨-]+(?:.[a-zA-Z0-9&^_¨-]+)@[a-zA-Z]+[.](?:[a-z]{2,3})$/.test(v) || 'Adresse e-mail incorrecte !',
        ],
        passwordRules: [
            v => !!v || 'Veuillez renseigner votre mot de passe!',
        ],
        confirmPasswordRules: [
            v => !!v || 'Veuillez renseigner votre mot de passe!',
        ],
    }),
}
</script>
