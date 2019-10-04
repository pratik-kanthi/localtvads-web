<template>
    <div class="mb16">
        <button class="btn btn-google" @click="googleAuth">
            <img src="@/assets/images/google.png" alt="google" />
            <span v-if="type === 'Login'">Login with Google</span>
            <span v-if="type === 'Register'">Sign up with Google</span>
        </button>
    </div>
</template>

<script>
    import instance from "@/api";

    export default {
        name: "Google",
        props: ["api", "type"],
        data() {
            return {
                errMessage: "",
                gapi: "",
                isError: false,
                profile: ""
            };
        },
        methods: {
            googleAuth() {
                this.loadGAPIScript("https://apis.google.com/js/api.js").then(() => {
                    const gapi = window.gapi;
                    if (!gapi) {
                        return;
                    }
                    this.gapi = gapi;
                    gapi.load("client:auth2", () => {
                        this.$store.commit('LOGIN_LOADER', true);
                        gapi.client.init({
                            apiKey: window.google.apiKey,
                            clientId: window.google.clientId,
                            scope: "https://www.googleapis.com/auth/userinfo.profile"
                        });
                        gapi.auth2
                            .getAuthInstance()
                            .grantOfflineAccess({
                                redirect_uri: "postmessage",
                                approval_prompt: "force"
                            })
                            .then(
                                () => {
                                    gapi.auth2
                                        .getAuthInstance()
                                        .isSignedIn.listen(this.updateSigninStatus);
                                    this.updateSigninStatus(
                                        gapi.auth2.getAuthInstance().isSignedIn.get()
                                    );
                                },
                                () => {
                                    this.$store.commit('LOGIN_LOADER', false);
                                }
                            );
                    });
                });
            },
            loadGAPIScript(gapiUrl) {
                return new Promise((resolve) => {
                    let script = document.createElement("script");
                    script.src = gapiUrl;
                    script.onreadystatechange = script.onload = () => {
                        let interval = setInterval(() => {
                            if (
                                !script.readyState ||
                                /loaded|complete/.test(script.readyState)
                            ) {
                                clearInterval(interval);
                                resolve();
                            }
                        }, 100);
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                });
            },
            async updateSigninStatus(isSignedIn) {
                if (isSignedIn) {
                    let profile = this.gapi.auth2
                        .getAuthInstance()
                        .currentUser.get()
                        .getBasicProfile();
                    let body = {
                        ID: profile.getId(),
                        Name: profile.getName(),
                        ImageUrl: profile.getImageUrl(),
                        Email: profile.getEmail(),
                        token: this.gapi.auth2
                            .getAuthInstance()
                            .currentUser.get()
                            .getAuthResponse(),
                        AuthorisationScheme: "Google"
                    };
                    try {
                        this.isError = false;
                        let result = await instance.post(this.api, body);
                        this.$cookies.set(
                            "token",
                            result.data.TokenString,
                            result.data.iat - Math.floor(Date.now() / 1000) + "s"
                        );
                        delete result.data.TokenString;
                        localStorage.setItem("user", JSON.stringify(result.data));
                        this.$store.dispatch("loginSuccess");
                    } catch (err) {
                        if (err.status === 409) {
                            this.$swal({
                                title: "Error",
                                text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                                type: "warning",
                                confirmButtonColor: "#ff6500"
                            });
                        } else if (err.status === 404) {
                            this.$swal({
                                title: "Error",
                                text: "Account not found. Would you like to create one?",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#ff6500",
                                confirmButtonText: "Yes",
                                cancelButtonColor: "#ccc",
                                cancelButtonText: "No"
                            }).then(async isConfirm => {
                                if (isConfirm.value) {
                                    this.$store.commit('LOGIN_LOADER', true);
                                    try {
                                        let result = await instance.post('api/auth/clientsocialregister', body);
                                        this.$cookies.set(
                                            "token",
                                            result.data.TokenString,
                                            result.data.iat - Math.floor(Date.now() / 1000) + "s"
                                        );
                                        delete result.data.TokenString;
                                        localStorage.setItem("user", JSON.stringify(result.data));
                                        this.$store.dispatch("loginSuccess");
                                        this.$store.commit('LOGIN_LOADER', false);
                                    } catch (err) {
                                        this.$swal({
                                            title: 'Error',
                                            text: err.error,
                                            type: 'warning',
                                            confirmButtonColor: "#ff6500",
                                        });
                                        console.error(err);
                                    }
                                }
                            });
                        }
                        this.isError = true;
                        this.errMessage = err && err.data && err.data.message ? err.data.message : "Some error occurred";
                        this.$store.commit('LOGIN_LOADER', false);
                        console.error(err);
                    }
                } else {
                    this.gapi.auth2.getAuthInstance().signIn();
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .btn-google {
        width: 100%;
        background-color: #4285f4;
        color: #ffffff;
        border: none;
        text-transform: capitalize;
        position: relative;
        font-weight: 500 !important;
        height: 42px;
        margin-bottom: 20px;
        &:hover {
            background: #4285f4;
            color: #fff;
        }
    }

    img {
        position: absolute;
        width: 24px;
        left: 8px;
        top: 8px;
    }
</style>