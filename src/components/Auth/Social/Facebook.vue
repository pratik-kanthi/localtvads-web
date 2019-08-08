<template>
    <v-btn large color="#3b5998" class="mt-5 white--text text-capitalize font-weight-bold" block @click="login()" depressed>
        <img :src="fbIcon" alt="facebook"/>
        <span v-if="type === 'Login'">Login with Facebook</span>
        <span v-if="type === 'Register'">Sign up with Facebook</span>
        <v-snackbar :top="true" v-model="isError" color="orange">{{errMessage}}</v-snackbar>
    </v-btn>
</template>

<script>
    import instance from '@/api';
    export default {
        name: "Facebook",
        props: ['api', 'type'],
        data() {
            return {
                fbIcon: require('@/assets/images/facebook.png'),
                isError: false,
                errMessage: ''
            }
        },
        methods: {
             onSignInSuccess(token) {
                FB.api('/me?fields=name,email,picture&token=' + token.accessToken, async (profile) => {
                    let body = {
                        Name: profile.name,
                        ImageUrl: profile.picture ? profile.picture.data.url : undefined,
                        Email: profile.email,
                        token: token.accessToken,
                        AuthorisationScheme: 'Facebook'
                    };
                    try {
                        this.isError = false;
                        let result = await instance.post(this.api, body);
                        this.$cookies.set('token', result.data.TokenString, (result.data.iat - Math.floor(Date.now()/1000) + 's'));
                        delete result.data.TokenString;
                        localStorage.setItem('user', JSON.stringify(result.data));
                        this.$store.dispatch('loginSuccess');
                    } catch (ex) {
                        this.isError = true;
                        this.errMessage = ex.data && ex.data.message ? ex.data.message: 'Some error occurred';
                        this.$store.state.auth.loader = false;
                    }
                })
            },
            onSignInError(error) {
                console.log('Cancelled', error)
            },
            login() {
                this.$store.state.auth.loader = true;
                FB.login((response) => {
                    if (response.status === 'connected') {
                        this.onSignInSuccess(response.authResponse);
                    } else {
                        this.onSignInError();
                        this.$store.state.auth.loader = false;
                    }
                }, {scope: 'public_profile,email'});
            }
        },
        created() {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: window.facebook.appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.8'
                });
            };
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    }
</script>

<style scoped lang="scss">
    img {
        position: absolute;
        left: 0;
        width: 24px;
        top: -4px;
    }
    .v-btn {
        padding: 0 12px !important;
    }
</style>