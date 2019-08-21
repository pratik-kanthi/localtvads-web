<template>
    <div>
        <div class="nav-container">
            <nav>
                <div class="nav-bar">
                    <div class="module left">
                        <img class="logo" src="@/assets/images/logo-white.svg" alt="Local TV Ads">
                        <span class="tagline">low cost, local TV Time</span>
                    </div>
                    <div class="module-group right">
                        <ul class="menu">
                            <li v-if="isLoggedIn"><a>My Campaigns</a></li>
                            <li v-if="isLoggedIn"><a>My Ads</a></li>
                            <li><a>FAQs</a></li>
                            <li v-if="!isLoggedIn"><a @click="chooseAuth('login')">Login</a></li>
                            <li v-if="!isLoggedIn"><button class="btn btn-white" @click="chooseAuth('register')">Register</button></li>
                            <li v-if="isLoggedIn">
                                <a class="profile">
                                    <div v-if="$store.state.user.Owner && !$store.state.user.Owner.ImageUrl" class="text">{{$store.state.user.Owner.Title[0]}}</div>
                                    <img v-else-if="$store.state.user.Owner && $store.state.user.Owner.ImageUrl" class="picture" :src="getImageUrl" :alt="$store.state.user.Owner.Title">
                                </a>
                                <ul class="profile-menu">
                                    <li><a @click="logout">Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
        <AuthModal :active="defaultChosen"></AuthModal>
    </div>
</template>

<script>
import Vue from "vue";
import AuthModal from "@/webapp/common/modals/AuthModal";
export default {
    name: "Header",
    components: {
        AuthModal
    },
    data() {
        return {
            defaultChosen: 'login',
        }
    },
    methods: {
        chooseAuth(name) {
            this.defaultChosen = name;
            this.$store.commit('DIALOG', true);
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
        getImageUrl() {
            return Vue.config.GOOGLE_BUCKET_ENDPOINT + this.$store.state.user.Owner.ImageUrl;
        }
    }
}
</script>

<style lang="less" scoped>
    .nav-container {
        background-color: @brand-primary;
        background-image: url('../../assets/images/pattern.svg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        height: 65px;
        line-height: 65px;
        color: #fff !important;
        padding: 0 32px;
        background-size: cover;
        nav {
            background-color: transparent;
            .nav-bar {
                height: 65px;
                max-height: 65px;
                line-height: 65px;
                border: none;
                .module {
                    padding: 0;
                    height: 65px;
                    .logo {
                        display: inline;
                        max-height: 65%;
                    }
                    .tagline {
                        margin-left: 32px;
                        font-family: @font-family-heading;
                        font-weight: 500;
                        font-size: 16px;
                    }
                }
                .module-group {
                    height: 65px;
                    .module {
                        .menu {
                            width: 100%;
                            height: 65px;
                            li {
                                margin-right: 32px;
                                float: left;
                                a {
                                    font-family: @font-family-heading;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
            }
        }
        
    }
    .menu li a{ font-size: 16px; text-transform: capitalize; font-weight: 500; letter-spacing: 1px; color: #fff; opacity: 1; .transition(0.3s); }
    .menu li .profile {
        cursor: pointer !important;
        .text {
            background-color: #fff;
            width: 48px;
            height: 48px;
            .border-radius(50%);
            text-align:center;
            line-height: 50px;
            color: @brand-primary;
            font-size: 24px;
            font-weight: 400;
        }
        .picture {
            width: 48px;
            height: 48px;
            .border-radius(50%);
        }
        .profile-menu {
            li {
                a {
                    cursor: pointer !important;
                }
            }
        }
    }
</style>
