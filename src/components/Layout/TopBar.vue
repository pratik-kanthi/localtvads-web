<template>
    <v-app-bar height="60px" color="#FF6500" :src="backgroundImage" flat app class="pl-4 pr-4">
        <router-link to="/">
            <img :src="logoUrl" width="72px" />
        </router-link>
        <v-toolbar-title class="ml-6 white--text font-weight-bold body-1">low cost, local TV airtime</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold" v-if="isLoggedIn">My Campaigns</v-btn>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold" v-if="isLoggedIn">My Ads</v-btn>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold">FAQs</v-btn>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold" v-if="!isLoggedIn" @click="chooseAuth('login')">Log in</v-btn>
        <v-btn class="text-capitalize mr-4 ml-4 font-weight-bold body-1 primary-text" v-if="!isLoggedIn" @click="chooseAuth('register')">Register</v-btn>
        <v-avatar v-if="isLoggedIn && (!$store.state.user || !$store.state.user.Owner.ImageUrl)" color="white" class="mr-4 ml-4">
            <span class="primary-text headline">{{$store.state.user.Owner.Title[0]}}</span>
        </v-avatar>
        <v-avatar v-else-if="isLoggedIn">
            <img :src="getImageUrl" :alt="$store.state.user.Owner.Title">
        </v-avatar>
        <v-btn v-if="isLoggedIn" @click="logout">Logout</v-btn>
        <div class="text-center">
            <v-dialog v-model="getShowDialog" width="500" persistent>
                <div class="user-login-model">
                    <div class="links">
                        <ul>
                            <li :class="{'active' : active === 'register'}"><a @click="goToComponent('register')">Register</a></li>
                            <li :class="{'active' : active === 'login'}"><a @click="goToComponent('login')">Login</a></li>
                        </ul>
                    </div>
                    <div class="content">
                        <div class="content-area">
                            <keep-alive>
                                <component :is="currentComponent" @loginSucces="close"></component>
                            </keep-alive>
                            
                            <center><v-btn text @click="close" color="primary" class="mt-6 pl-0 text-capitalize">Continue as guest</v-btn></center>
                        </div>
                        <div class="overlay" v-if="$store.state.auth.loader"></div>
                        <v-dialog v-model="$store.state.auth.loader" persistent width="300">
                            <v-card color="primary" dark>
                                <v-card-text>Please stand by while we authenticate<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear></v-card-text>
                            </v-card>
                        </v-dialog>
                    </div>
                </div>
            </v-dialog>
        </div>
    </v-app-bar>
</template>

<script>
    import Login from "@/components/Auth/Login";
    import Register from "@/components/Auth/Register";
    import Vue from "vue";

    export default {
        name: "TopBar",
        components: {
            Login,
            Register
        },
        data() {
            return {
                backgroundImage: require('@/assets/images/pattern.svg'),
                logoUrl: require('@/assets/images/logo-white.svg'),
                component: {
                    login: Login,
                    register: Register
                },
                currentComponent: Login,
                active: 'login',
            }
        },
        methods: {
            chooseAuth(name) {
                this.$store.commit('DIALOG', true);
                this.goToComponent(name);
            },
            close() {
                this.$store.commit('DIALOG', false);
            },
            goToComponent(name) {
                this.currentComponent = this.component[name];
                this.active = name;
            },
            logout() {
                this.$store.dispatch('logout');
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isLoggedIn;
            },
            getUser() {
                return this.$store.getters.getUser;
            },
            getShowDialog() {
                return this.$store.getters.getShowDialog;
            },
            getImageUrl() {
                return Vue.config.GOOGLE_BUCKET_ENDPOINT + this.$store.state.user.Owner.ImageUrl;
            }
        }
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
                    background-color: #fff;
                    display: inline-block;
                    width: 50%;
                    text-align: center;
                    padding: 16px;
                    border: 1px solid #ddd;
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
                        border: none;
                        height: 64px;
                        margin-top: 0;
                        line-height: 32px;
                    }
                }
            }
        }
        .content {
            position: relative;
            background-color: #fff;
            padding: 32px 64px;
            height: 590px;
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
    .primary-text {
        color: #FF6500 !important;
    }
</style>