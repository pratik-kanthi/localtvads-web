<template>
    <div>
        <v-btn left color="#4285f4" class="mt-5 white--text text-capitalize font-weight-bold" @click="googleAuth()" block><span><v-img :src="googleIcon" max-width="24px" style="margin-left:-104px" /></span> Sign up with Google</v-btn>
    </div>
</template>

<script>
    import instance from '@/api';

    export default {
        name: "Google",
        data() {
            return {
                googleIcon: require('@/assets/images/google.png'),
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
                        gapi.client.init({
                            apiKey: '20k8iF8V4pJnjAwrhQqexEq2',
                            clientId: '955842204870-l42aal4di5env4ud2t31m4ici46l70lf.apps.googleusercontent.com',
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
                    instance.post('api/socialauth', body).then((result) => {
                        this.$cookies.set('token', result.data.TokenString, (result.data.iat - Math.floor(Date.now()/1000) + 's'));
                        delete result.data.TokenString;
                        localStorage.setItem('user', JSON.stringify(result.data));
                        this.$store.dispatch('loginSuccess');
                    });
                } else {
                    this.gapi.auth2.getAuthInstance().signIn();
                }
            }
        }
    }
</script>

<style scoped>

</style>