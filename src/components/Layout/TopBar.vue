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
  <v-btn text class="white--text text-capitalize subtitle-1 font-weight-bold" v-if="!isLoggedIn">Log in</v-btn>
  <v-btn class="text-capitalize mr-4 ml-4 btn-primary font-weight-bold body-1" @click="dialog=true" v-if="!isLoggedIn">Register</v-btn>
  <div class="text-center">
        <v-dialog v-model="dialog" width="500" persistent>
         <v-tabs v-model="active" centered grow slider-color="white" background-color="transparent" hide-slider height="48px">
          <v-tab v-for="tab in tabs" :key="tab.name" class="text-capitalize font-weight-bold subtitle-1 btn-primary">{{tab.name}}</v-tab>
         </v-tabs>
         <v-tabs-items v-model="active">
         <v-tab-item>
          <v-card class="register">
           <v-card-title>Sign up to Local TV Ads</v-card-title>
           <v-card-text>
            <Register></Register>
            <v-btn text @click="dialog=false" class="mt-6 pl-0">Close</v-btn>
           </v-card-text>
          </v-card>
         </v-tab-item>
         <v-tab-item>
          <div class="login">
          <h3>Login to Local TV Ads</h3>
            <Login></Login>
          </div>
         </v-tab-item>
         </v-tabs-items>
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
   active: null,
   tabs: [{
    name: 'Register',
   }, {
    name: 'Login',
   }]
  }
 },
 computed: {
     isLoggedIn() {
         return this.$store.getters.isLoggedIn
     }
 }
}
</script>

<style scoped lang="css">
 .btn-primary {
  color: #FF6500 !important;
 }
 .register {
  padding: 32px 48px;
 }
 .login {
  padding: 32px 48px;
 }
 .v-tab {
  border-bottom: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  background-color: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin-left: 2px;
 }
 .v-tab--active {
  border: none !important;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
 }
</style>


