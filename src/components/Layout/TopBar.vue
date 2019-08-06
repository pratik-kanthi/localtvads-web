<template>
    <v-app-bar height="60px" color="#FF6500" :src="backgroundImage" flat app>
        <v-app-bar-nav-icon class="ml-4" width="72px">
            <v-img :src="logoUrl" width="72px" />
        </v-app-bar-nav-icon>
        <v-toolbar-title class="ml-2 white--text font-weight-bold body-1">low cost, local TV airtime</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold" v-if="isLoggedIn">My Campaigns</v-btn>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold" v-if="isLoggedIn">My Ads</v-btn>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold">FAQ's</v-btn>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold" v-if="!isLoggedIn" @click="chooseAuth('login')">Log in</v-btn>
        <v-btn class="text-capitalize mr-4 ml-4 btn-primary font-weight-bold body-1" v-if="!isLoggedIn" @click="chooseAuth('register')">Register</v-btn>
        <v-avatar v-if="isLoggedIn" color="white" class="mr-4 ml-4"><img v-if="userImageUrl" :src="userImageUrl" alt="avtar"><span class="btn-primary headline">Y</span></v-avatar>
        <div class="text-center">
            <v-dialog v-model="dialog" width="500" persistent>
                <div class="user-login-model">
                    <div class="links">
                        <ul>
                            <li :class="{'active' : active === 'register'}"><a @click="goToComponent('register')">Register</a></li>
                            <li :class="{'active' : active === 'login'}"><a @click="goToComponent('login')">Login</a></li>
                        </ul>
                    </div>
                    <div class="content">
                        <div class="register">
                            <keep-alive>
                                <component :is="currentComponent"></component>
                            </keep-alive>
                            <v-btn text @click="close" class="mt-6 pl-0">Close</v-btn>
                        </div>
                    </div>
                </div>
            </v-dialog>
        </div>
    </v-app-bar>
</template>

<script>
    import Login from "@/components/Auth/Login";
    import Register from "@/components/Auth/Register";
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
                dialog: false,
                component: {
                    login: Login,
                    register: Register
                },
                currentComponent: Login,
                active: 'login',
                userImageUrl: '',
            }
        },
        methods: {
            chooseAuth(name) {
                this.dialog = true;
                this.goToComponent(name);
            },
            close() {
                this.dialog = false;
            },
            goToComponent(name) {
                this.currentComponent = this.component[name];
                this.active = name;
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.getters.isLoggedIn
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
            background-color: #fff;
            padding: 32px 64px;
            height: 550px;
        }
    }
</style>