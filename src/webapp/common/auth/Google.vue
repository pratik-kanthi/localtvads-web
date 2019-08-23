<template>
    <div class="mb16">
        <button class="btn btn-google" @click="googleAuth">
            <img src="@/assets/images/google.png" alt="google"/>
            <span v-if="type === 'Login'">Login with Google</span>
            <span v-if="type === 'Register'">Sign up with Google</span>
        </button>
    </div>
</template>

<script>
    import instance from '@/api';

    export default {
        name: "Google",
        props: ['api','type'],
        data() {
            return {
                profile: '',
                gapi: '',
                isError: false,
                errMessage: ''
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
            async updateSigninStatus(isSignedIn) {
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
                } else {
                    this.gapi.auth2.getAuthInstance().signIn();
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .btn-google {
        width: 100%;
        background-color: #4285f4;
        color: #ffffff;
        border: none;
        text-transform: capitalize;
        position: relative;
        font-weight: 500 !important;
        &:hover {
            background:  #4285f4; color: #fff;
        }
    }
    img {
        position: absolute;
        width: 24px;
        left: 8px;
        top: 8px;
    }
</style>