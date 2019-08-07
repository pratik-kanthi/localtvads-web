<template>
    <v-form v-model="valid">
        <v-text-field v-model="user.email" :rules="rules.email" label="Email ID" required></v-text-field>
        <v-text-field v-model="user.password" :append-icon="show ? 'visibility' : 'visibility_off'"
                      :rules="rules.password" :type="show ? 'text' : 'password'" name="password" label="Password"
                      hint="Enter your password" counter @click:append="show = !show"></v-text-field>
        <v-btn :disabled="!valid" color="primary" class="mt-4 text-capitalize" @click="login" large block>
            Login
        </v-btn>
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
                try {
                    this.$store.state.auth.loader = true;
                    let result = await instance.post('api/auth/clientlogin', this.user);
                    this.$cookies.set('token', result.data.TokenString, (result.data.iat - Math.floor(Date.now() / 1000) + 's'));
                    delete result.data.TokenString;
                    localStorage.setItem('user', JSON.stringify(result.data));
                    this.$store.dispatch('loginSuccess');
                    this.$store.state.auth.loader = false;
                    this.$store.commit('DIALOG', false);
                } catch (ex) {

                }

            }
        }
    }
</script>

<style scoped>

</style>