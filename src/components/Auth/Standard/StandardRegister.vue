<template>
    <v-form v-model="valid">
        <v-text-field v-model="user.Name" :rules="rules.name" :counter="20" label="Full Name" required></v-text-field>
        <v-text-field v-model="user.Email" :rules="rules.email" label="Email ID" required></v-text-field>
        <v-text-field v-model="user.Password" :append-icon="'visibility'" :rules="rules.password" :type="'password'" name="password" label="Password" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="register">
            Register
        </v-btn>
    </v-form>
</template>

<script>
    import instance from "@/api";

    export default {
        name: "StandardRegister",
        data() {
            return {
                valid: false,
                user: {
                    Name: '',
                    Email: '',
                    Password: '',
                    AuthorisationScheme: 'Standard'
                },
                show1: false,
                rules: {
                    name: [
                        v => !!v || 'Name is required',
                        v => /^[A-Za-z]+$/.test(v) || 'Name must contain only alphabets',
                        v => v.length <= 20 || 'Name must be less than 20 characters'
                    ],
                    email: [
                        v => !!v || 'E-mail is required',
                        v => /.+@.+/.test(v) || 'Email ID must be valid',
                    ],
                    password: [
                        v => !!v || 'Password is required',
                        v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(v) || 'Password must contain at least 8 characters with 1 uppercase, 1 lowercase, 1 number'
                    ]
                }
            }
        },
        methods: {
            async register(){
                try {
                    let result = await instance.post('api/auth/clientregister', this.user);
                } catch (ex) {

                }
            }
        }
    }
</script>

<style scoped>

</style>