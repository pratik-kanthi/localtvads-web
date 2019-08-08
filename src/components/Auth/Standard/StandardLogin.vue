<template>
    <v-form v-model="valid">
        <v-text-field v-model="user.email" :rules="rules.email" label="Email ID" required></v-text-field>
        <v-text-field v-model="user.password" :append-icon="show ? 'visibility' : 'visibility_off'"
                      :rules="rules.password" :type="show ? 'text' : 'password'" name="password" label="Password"
                      hint="Enter your password" counter @click:append="show = !show"></v-text-field>
        <v-btn :disabled="!valid" color="primary" class="mt-4 text-capitalize" @click="login" large block depressed>
            Login
        </v-btn>
        <v-alert class="mt-4" dense outlined type="error" v-if="errMessage" depressed>{{errMessage}}</v-alert>
    </v-form>
</template>

<script>
    import instance from "@/api";

    export default {
        name: "StandardLogin",
        data() {
            return {
                valid: false,
                user: {
                    email: '',
                    password: ''
                },
                show: false,
                errMessage: '',
                rules: {
                    email: [
                        v => !!v || 'E-mail is required',
                        v => /.+@.+/.test(v) || 'Email ID must be valid',
                    ],
                    password: [
                        v => !!v || 'Password is required'
                    ]
                }
            }
        },
        methods: {
            async login() {
                this.errMessage = '';
                this.$store.state.auth.loader = true;
                try {
                    let result = await instance.post('api/auth/clientlogin', this.user);
                    this.$cookies.set('token', result.data.TokenString, (result.data.iat - Math.floor(Date.now() / 1000) + 's'));
                    delete result.data.TokenString;
                    localStorage.setItem('user', JSON.stringify(result.data));
                    this.$store.dispatch('loginSuccess');
                } catch (err) {
                    this.$store.state.auth.loader = false;
                    this.errMessage = err.data ? err.data.message : '';
                }
            }
        }
    }
</script>

<style scoped>

</style>