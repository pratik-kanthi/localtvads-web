<template>
    <nav>
        <div class="container-fluid">
            <div class="nav-bar row">
                <div class="col-lg-2">
                    <div class="logo-wrapper pl48">
                        <router-link tag="a" to="/">
                            <img src="@/assets/images/new_logo.png" alt="logo" class="logo" />
                        </router-link>
                    </div>
                </div>
                <div class="col-lg-8">
                    <ul class="menu" :class="{ 'nav-menu': showMenu }">
                        <li @click="toggleMenu">
                            <router-link tag="a" to="/#book-now">Book Now</router-link>
                        </li>
                        <li @click="toggleMenu">
                            <router-link tag="a" to="/#overview">Overview</router-link>
                        </li>
                        <li @click="toggleMenu">
                            <router-link tag="a" to="/#how-it-works">How It Works</router-link>
                        </li>
                        <li @click="toggleMenu">
                            <router-link tag="a" to="/#create-ad">About Local TV</router-link>
                        </li>
                        <li @click="toggleMenu">
                            <router-link tag="a" to="/#contact">Contact us</router-link>
                        </li>
                    </ul>
                </div>
                <div class="col-lg-2 auth-parent">
                    <ul class="auth-wrapper" :class="{ 'nav-menu': showMenu }">
                        <li v-if="!isLoggedIn">
                            <a @click="chooseAuth('login')">Login</a>
                        </li>
                        <li v-if="!isLoggedIn">
                            <a class="btn btn-white btn-sm" @click="chooseAuth('register')">Register</a>
                        </li>

                        <li v-if="isLoggedIn" class="profile-wrapper">
                            <a class="profile" @click="toggleProfile(undefined)" v-click-outside="closeProfile">
                                <div v-if="$store.state.user.Owner && !$store.state.user.Owner.ImageUrl" class="text">
                                    {{ $store.state.user.Owner.Title[0] }}
                                </div>
                                <img v-else-if="$store.state.user.Owner && $store.state.user.Owner.ImageUrl" class="picture" :src="getImageUrl" :alt="$store.state.user.Owner.Title" />
                            </a>
                            <transition name="list">
                                <ul class="" :class="{ 'profile-menu': showProfile }">
                                    <span @click="toggleSubMenu">
                                        <router-link tag="li" to="/profile">
                                            <div><i class=" material-icons mt-icon-sub pr8">person_outline</i>My Account</div>
                                        </router-link>
                                    </span>
                                    <span @click="toggleSubMenu">
                                        <router-link tag="li" to="/ads">
                                            <div><i class=" material-icons mt-icon-sub pr8">video_library</i>My Ads</div></router-link
                                        >
                                    </span>
                                    <span @click="toggleSubMenu">
                                        <router-link tag="li" to="/assets">
                                            <div><i class=" material-icons mt-icon-sub pr8">collections</i>My Assets</div></router-link
                                        >
                                    </span>
                                    <span @click="toggleSubMenu">
                                        <router-link tag="li" to="/transactions">
                                            <div><i class=" material-icons mt-icon-sub pr8">receipt_long</i>Transactions</div></router-link
                                        >
                                    </span>

                                    <li class="b-t black" @click="logout">
                                        <a>Logout</a>
                                    </li>
                                </ul>
                            </transition>
                        </li>
                    </ul>
                </div>
                <div class="navbar-toggle d-sm-block d-lg-none" @click="toggleMenu">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </div>
            </div>
        </div>
        <div v-if="$store.state.auth.defaultChosen">
            <AuthModal @closed="$store.state.auth.defaultChosen = null"></AuthModal>
        </div>
        <div>
            <ForgotPassword v-if="forgotPassword"></ForgotPassword>
        </div>
    </nav>
</template>

<script>
import AuthModal from '@/webapp/common/modals/AuthModal';
import ForgotPassword from '@/webapp/common/modals/ForgotPassword';

import { mapGetters, mapState } from 'vuex';

export default {
    name: 'Header',
    components: {
        AuthModal,
        ForgotPassword
    },
    data() {
        return {
            showMenu: false,
            showProfile: false
        };
    },
    methods: {
        closeProfile() {
            this.showProfile = false;
        },
        chooseAuth(name) {
            this.$store.commit('DIALOG_CHOSEN', name);
        },
        logout() {
            this.$store.dispatch('logout');
            this.$router.push('/', () => {});
            this.showProfile = false;
        },
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        toggleSubMenu() {
            this.toggleMenu();
            this.toggleProfile();
        },
        toggleProfile() {
            this.showProfile = !this.showProfile;
        }
    },
    computed: {
        ...mapGetters(['isLoggedIn', 'getUser']),
        ...mapState(['forgotPassword']),
        getImageUrl() {
            return this.GOOGLE_BUCKET_ENDPOINT + this.$store.state.user.Owner.ImageUrl;
        }
    }
};
</script>

<style lang="scss" scoped>
nav {
    min-height: 80px;

    @media (max-width: 990px) {
        min-height: 56px;
    }
}

.container-fluid {
    background-color: $brand-primary;
    position: fixed;
    z-index: 5;
}

.nav-bar {
    min-height: 80px;
    z-index: 4;

    /* iPad Pro Portrait */
    @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        padding-right: 32px !important;
    }

    .logo-wrapper {
        width: 128px;
        line-height: 78px;

        @media (max-width: 990px) {
            width: 88px;
            padding-left: 16px !important;
        }

        .logo {
            max-width: 100%;
            max-height: 100%;
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
        margin: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        li {
            float: left;
            line-height: 78px;
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

                .list-item {
                    display: inline-block;
                    margin-right: 10px;
                }
                .list-enter-active,
                .list-leave-active {
                    transition: all 1s;
                }
                .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
                    opacity: 0;
                    transform: translateY(30px);
                }

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
                        position: absolute;
                        right: 0;
                        z-index: 1;
                        display: block;
                        @include list-unstyled();
                        background-color: $white;
                        color: $brand-primary;
                        margin-top: -8px;
                        padding: 0;
                        width: 220px;
                        border-radius: 6px;
                        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
                        height: auto;
                        overflow: auto;

                        li {
                            color: $black;
                            background-color: $white;
                            line-height: initial;
                            width: 100%;
                            text-align: left;
                            cursor: pointer;
                            padding: 16px 24px;

                            .material-icons {
                                color: $brand-primary !important;
                            }

                            &:hover {
                                background-color: $brand-primary !important;
                                color: $white;

                                .material-icons {
                                    color: $white !important;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .navbar-toggle {
        position: absolute;
        right: 16px;
        top: 22px;
        cursor: pointer;

        .icon-bar {
            background-color: #fff !important;
            display: block;
            width: 22px;
            height: 2px;
            border-radius: 1px;
            margin-bottom: 4px;
        }
    }

    @media (max-width: 990px) {
        min-height: 56px;
        padding: 0;

        .logo-wrapper {
            width: 100%;
            height: 32px;
            line-height: 50px;
        }

        ul.menu {
            display: none;

            &.nav-menu {
                display: block;
                margin-top: 24px;

                li {
                    float: none !important;
                    line-height: 40px;
                }
            }
        }

        ul.auth-wrapper {
            display: none;
            margin-bottom: 10px;

            &.nav-menu {
                display: block;
                float: none;

                li {
                    float: none;
                    line-height: 48px;

                    &.profile-wrapper {
                        text-align: left;

                        .profile {
                            display: block;
                        }

                        .profile-menu {
                            margin-top: 14px;
                            position: initial;
                        }
                    }
                }
            }
        }
    }

    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
        padding: 0;
    }

    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
        .auth-parent {
            padding: 0 15px 0 0;

            ul.auth-wrapper {
                li {
                    margin-right: 23px;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }
    }
}
</style>
