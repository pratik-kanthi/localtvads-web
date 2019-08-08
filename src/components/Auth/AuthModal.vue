<template>
    <div class="text-center">
        <v-dialog v-model="getShowDialog" width="500" persistent>
            <div class="user-login-model">
                <div class="links">
                    <ul>
                        <li :class="{'active' : active === 'register'}"><a
                                @click="goToComponent('register')">Register</a></li>
                        <li :class="{'active' : active === 'login'}"><a @click="goToComponent('login')">Login</a></li>
                    </ul>
                </div>
                <div class="content">
                    <div class="content-area">
                        <keep-alive>
                            <component :is="currentComponent" @loginSucces="close"></component>
                        </keep-alive>
                        <center>
                            <v-btn text @click="close" color="primary" class="mt-3 pl-0 text-capitalize">Continue as
                                guest
                            </v-btn>
                        </center>
                    </div>
                    <div class="overlay" v-if="$store.state.auth.loader"></div>
                    <v-dialog v-model="$store.state.auth.loader" persistent width="300">
                        <v-card color="primary" dark>
                            <v-card-text>Please stand by while we authenticate
                                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </div>
            </div>
        </v-dialog>
    </div>
</template>

<script>
    import Login from "@/components/Auth/Login";
    import Register from "@/components/Auth/Register";

    export default {
        name: "AuthModal",
        props: ['active'],
        components: {
            Login,
            Register
        },
        data() {
            return {
                availComponents: {
                    login: Login,
                    register: Register
                }
            }
        },
        methods: {
            close() {
                this.$store.commit('DIALOG', false);
            },
            goToComponent(name) {
                this.active = name;
            }
        },
        computed: {
            getShowDialog() {
                return this.$store.getters.getShowDialog;
            },
            currentComponent() {
                return this.availComponents[this.active];
            }
        },
    }
</script>

<style scoped lang="scss">
    .user-login-model {
        .links {
            ul {
                list-style: none;
                padding-left: 0;
                background-color: transparent;
                height: 64px;

                li {
                    background-color: #EEE;
                    display: inline-block;
                    width: 50%;
                    text-align: center;
                    padding: 16px;
                    height: 48px;
                    vertical-align: text-bottom;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    line-height: 13px;

                    a {
                        text-decoration: none;
                        color: primary;
                        font-weight: bold;
                    }

                    &.active {
                        background-color: #fff;
                        height: 64px;
                        margin-top: 0;
                        line-height: 32px;
                        width: calc(50% - 2px);
                        &:first-child {
                            margin-right: 2px;
                        }
                        &:last-child {
                            margin-left: 2px;
                        }
                    }
                }
            }
        }

        .content {
            position: relative;
            background-color: #fff;
            padding: 32px 64px;
            min-height: 590px;

            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #fff;
                opacity: 0.5;
                z-index: 2;
            }
        }
    }
</style>