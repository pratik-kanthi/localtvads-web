<template>
 <div>
  <v-card flat class="no-radius">
   <v-img :src="backgroundImage" height="300px"></v-img>
  </v-card>
  <v-container class="main-content pt-0 pr-0 pl-0 pb-0">
    <v-tabs v-model="active" background-color="transparent" centered color="white" grow height="56px">
     <v-tab v-for="tab in tabs" :key="tab.name" :to="tab.path">{{tab.name}}</v-tab>
    </v-tabs>
    <BookAd></BookAd>
  </v-container>
 </div>
</template>

<script>
import BookAd from "@/components/BookAd";
export default {
 name: 'Home',
 components: {
   BookAd
 },
 data() {
  return {
   backgroundImage: require('@/assets/images/home-cover.jpg'),
   pattern: require('@/assets/images/pattern.svg'),
   active: 'book-ad',
   tabs: [{
     name: 'Book Your Ad',
     path: 'book-ad'
   }, {
     name: 'Create Ad',
     path: 'create-ad'
   }]
  }
 },
}
</script>

<style lang="css" scoped>
 .no-radius {
  border-radius: 0;
 }
 .main-content {
  position: relative;
  margin-top: -56px;
  color: white;
  background-color: #FF6500;
  border-radius: 4px;
 }
</style>

