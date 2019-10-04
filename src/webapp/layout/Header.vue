<template>
    <div>
        <div class="container-fluid">
            <div class="nav row">
                <div class="col-sm-2">
                    <div class="logo-wrapper">
                        <router-link tag="a" to="/">
                            <img src="@/assets/images/logo.svg" alt="logo" class="logo">
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-8">
                    <ul class="menu">
                        <li><router-link tag="a" to="#/book-now">Book Now</router-link></li>
                        <li><router-link tag="a" to="/#how-it-works">How it works</router-link></li>
                        <li><router-link tag="a" to="/#offers">Offers</router-link></li>
                        <li><router-link tag="a" to="/#about">About</router-link></li>
                        <li><router-link tag="a" to="/#contact">Contact us</router-link></li>
                    </ul>
                </div>
                <div class="col-sm-2">
                    <ul class="auth-wrapper">
                        <li v-if="!isLoggedIn"><a @click="chooseAuth('login')">Login</a></li>
                        <li v-if="!isLoggedIn"><a class="btn btn-white btn-sm" @click="chooseAuth('register')">Register</a></li>
                        <li v-if="isLoggedIn" class="profile-wrapper">
                            <a class="profile" @click="toggleProfile(undefined)" v-click-outside="closeProfile">
                                <div v-if="$store.state.user.Owner && !$store.state.user.Owner.ImageUrl" class="text">{{$store.state.user.Owner.Title[0]}}</div>
                                <img v-else-if="$store.state.user.Owner && $store.state.user.Owner.ImageUrl" class="picture" :src="getImageUrl" :alt="$store.state.user.Owner.Title" />
                            </a>
                            <ul class="" :class="{'profile-menu': showProfile}">
                                <router-link tag="li" to="profile">My Account</router-link>
                                <li @click="logout">
                                    <a>Logout</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="$store.state.auth.defaultChosen">
            <AuthModal @closed="$store.state.auth.defaultChosen=null"></AuthModal>
        </div>
    </div>

</template>

<script>
    import AuthModal from "@/webapp/common/modals/AuthModal";
    import {mapGetters} from "vuex";

    export default {
    name: "Header",
    components: {
        AuthModal
    },
    data() {
        return {
            showProfile: false
        }
    },
    methods: {
        closeProfile() {
            this.showProfile = false;
        },
        chooseAuth(name) {
            this.$store.commit("DIALOG_CHOSEN", name);
        },
        logout() {
            this.$store.dispatch("logout");
            this.$router.push("/", () => {});
            this.showProfile = false;
        },
        toggleProfile() {
            this.showProfile = !this.showProfile;
        }
    },
    computed: {
        ...mapGetters(["isLoggedIn", "getUser"]),
        getImageUrl() {
            return (
                this.GOOGLE_BUCKET_ENDPOINT + this.$store.state.user.Owner.ImageUrl
            );
        }
    }
}
</script>

<style lang="scss" scoped>
    .container-fluid {
        background-color: $brand-primary;
        border-bottom: 3px solid $white;
    }
    .nav {
        height: 80px;
        padding: 0 35px;
        .logo-wrapper {
            width: 100px;
            height: 56px;
            line-height: 74px;
            .logo {
                max-width: 100%;
                max-height: 100%
            }
        }
        ul.menu {
            @include list-unstyled();
            margin: 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            li {
                float: left;
                margin-right: 40px;
                line-height: 80px;
                color: $white;
                font-size: 16px;
                font-family: $font-family-heading;
                font-weight: 400;
                &:last-child {
                    margin-right: 0;
                }
                a {
                    color: $white;
                }
            }
        }
        ul.auth-wrapper {
            @include list-unstyled();
            float: right;
            li {
                float: left;
                margin-right: 40px;
                line-height: 72px;
                color: $white;
                font-family: $font-family-heading;
                font-weight: 400;
                font-size: 16px;
                &:last-child {
                    margin-right: 0;
                }
                &.profile-wrapper {
                    text-align: right;
                    position: relative;
                    .profile {
                        cursor: pointer !important;
                        display: inline-block;
                        vertical-align: middle;
                        .text {
                            background-color: #fff;
                            width: 48px;
                            height: 48px;
                            text-align: center;
                            line-height: 45px;
                            color: $brand-primary;
                            font-size: 24px;
                            font-weight: 400;
                            border-radius: 50%;
                            border: 2px solid $white;
                        }
                        .picture {
                            width: 48px;
                            height: 48px;
                            border-radius: 50%;
                            border: 2px solid $white;
                        }
                    }
                    ul {
                        display: none;
                        &.profile-menu {
                            position: inherit;
                            z-index: 1;
                            display: block;
                            @include list-unstyled();
                            background-color: $white;
                            color: $brand-primary;
                            margin-top: -8px;
                            padding: 0;
                            width: 162px;
                            border-radius: 6px;
                            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
                            height: 100%;
                            overflow: auto;
                            li {
                                color: $base;
                                background-color: $white;
                                line-height: initial;
                                width: 100%;
                                text-align: left;
                                padding: 10px;
                                cursor: pointer;
                                &:hover {
                                    background-color: $brand-primary;
                                    color: $white;
                                }
                            }
                        }
                    }
                }

            }
        }
    }
</style>
