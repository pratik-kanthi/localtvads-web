<template>
 <v-app-bar height="60px" color="#FF6500" :src="backgroundImage" class="" flat app>
  <v-app-bar-nav-icon class="ml-4" width="72px">
   <v-img :src="logoUrl" width="72px" />
  </v-app-bar-nav-icon>
  <v-toolbar-title class="ml-2 white--text body-1">low cost, local TV airtime</v-toolbar-title>
  <v-spacer></v-spacer>
  <v-btn text class="white--text text-capitalize subtitle-1 font-weight-regular">My Campaigns</v-btn>
  <v-btn text class="white--text text-capitalize subtitle-1 font-weight-regular">My Ads</v-btn>
  <v-btn text class="white--text text-capitalize subtitle-1 font-weight-regular">FAQ's</v-btn>
  <v-btn text class="white--text text-capitalize subtitle-1 font-weight-regular">Log in</v-btn>
  <v-btn class="text-capitalize">Register</v-btn>
 </v-app-bar>
</template>

<script>
export default {
 name: "TopBar",
 data() {
  return {
   backgroundImage: require('@/assets/images/pattern.svg'),
   logoUrl: require('@/assets/images/logo-white.svg')
  }
 },
}
</script>

<style lang="sass" scoped>
 
</style>


