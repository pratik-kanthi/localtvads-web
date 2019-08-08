<template>
    <v-app-bar height="60px" color="#FF6500" :src="backgroundImage" flat app class="pl-4 pr-4">
        <router-link to="/">
            <img :src="logoUrl" alt="logo" width="72px" />
        </router-link>
        <v-toolbar-title class="ml-6 white--text font-weight-bold body-1">low cost, local TV airtime</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold" v-if="isLoggedIn">My Campaigns</v-btn>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold" v-if="isLoggedIn">My Ads</v-btn>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold">FAQs</v-btn>
        <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold" v-if="!isLoggedIn" @click="chooseAuth('login')">Log in</v-btn>
        <v-btn class="text-capitalize mr-4 ml-4 font-weight-bold body-1 primary--text" v-if="!isLoggedIn" @click="chooseAuth('register')" depressed>Register</v-btn>
        <v-avatar v-if="isLoggedIn && !$store.state.user || ($store.state.user && $store.state.user.Owner && !$store.state.user.Owner.ImageUrl)" color="white" class="mr-4 ml-4">
            <span class="primary-text headline">{{$store.state.user.Owner.Title[0]}}</span>
        </v-avatar>
        <v-menu :offset-x="false" :offset-y="true" :absolute="false" v-else-if="isLoggedIn">
            <template v-slot:activator="{ on }">
                <div v-on="on" class="pointer pt-1 pb-1">
                    <v-avatar class="ml-2">
                        <img :src="getImageUrl" :alt="$store.state.user.Owner.Title">
                    </v-avatar>
                    <strong class="white--text subheading ml-3 middle" v-text="$store.state.user.Owner.Title"></strong>
                    <v-btn icon class="mr-5">
                        <v-icon color="white" large>arrow_drop_down</v-icon>
                    </v-btn>
                </div>
            </template>
            <v-list>
                <v-list-item @click="logout" v-if="isLoggedIn">
                    <v-list-item-title>
                        Logout
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <AuthModal :default="defaultChosen"></AuthModal>
    </v-app-bar>
</template>

<script>
    import Vue from "vue";
    import AuthModal from "../Auth/AuthModal";

    export default {
        name: "TopBar",
        components: {AuthModal},
        data() {
            return {
                backgroundImage: require('@/assets/images/pattern.svg'),
                logoUrl: require('@/assets/images/logo-white.svg'),
                defaultChosen: 'login',
                dropdown: false
            }
        },
        methods: {
            chooseAuth(name) {
                this.$store.commit('DIALOG', true);
                this.defaultChosen = name;
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
                debugger
                return Vue.config.GOOGLE_BUCKET_ENDPOINT + this.$store.state.user.Owner.ImageUrl;
            }
        }
    }
</script>

<style scoped lang="scss">


</style>