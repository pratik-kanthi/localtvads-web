<template>
    <div>
        <v-btn large color="#4285f4" class="mt-5 white--text text-capitalize font-weight-bold" @click="googleAuth()" block depressed>
            <img src="@/assets/images/google.png" />
            <span v-if="type === 'Login'">Login with Google</span>
            <span v-if="type === 'Register'">Sign up with Google</span>
        </v-btn>
    </div>
</template>

<script>
    import instance from '@/api';
    import {User} from '@/models/User';

    export default {
        name: "Google",
        props: ['api','type'],
        data() {
            return {
                profile: '',
                gapi: ''
            };
        },
        methods: {
            googleAuth() {
                this.loadGAPIScript('https://apis.google.com/js/api.js').then(() => {
                    const gapi = window.gapi;
                    if (!gapi) {
                        return;
                    }
                    this.gapi = gapi;
                    gapi.load('client:auth2', () => {
                        this.$store.state.auth.loader = true;
                        gapi.client.init({
                            apiKey: window.google.apiKey,
                            clientId: window.google.clientId,
                            scope: 'https://www.googleapis.com/auth/userinfo.profile'
                        }).then(() => {
                            gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
                            this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                        });
                    });
                });
            },
            loadGAPIScript(gapiUrl) {
                return new Promise(function (resolve) {
                    var script = document.createElement('script');
                    script.src = gapiUrl;
                    script.onreadystatechange = script.onload = function () {
                        var interval = setInterval(function () {
                            if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                                clearInterval(interval);
                                resolve()
                            }
                        }, 100)
                    };
                    document.getElementsByTagName('head')[0].appendChild(script)
                })
            },
            updateSigninStatus(isSignedIn) {
                if (isSignedIn) {
                    let profile = this.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
                    let body = {
                        ID: profile.getId(),
                        Name: profile.getName(),
                        ImageUrl: profile.getImageUrl(),
                        Email: profile.getEmail(),
                        token: this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(),
                        AuthorisationScheme: 'Google'
                    };
                    instance.post(this.api, body).then((result) => {
                        this.$cookies.set('token', result.data.TokenString, (result.data.iat - Math.floor(Date.now()/1000) + 's'));
                        delete result.data.TokenString;
                        localStorage.setItem('user', JSON.stringify(result.data));
                        this.$store.dispatch('loginSuccess');
                        this.$store.state.auth.loader = false;
                        this.$store.commit('DIALOG', false);
                        // this.gapi.auth2.getAuthInstance().signOut();
                    });
                } else {
                    this.gapi.auth2.getAuthInstance().signIn();
                }
            }
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