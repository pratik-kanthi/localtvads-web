<template>
  <v-app>
    <top-bar></top-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import TopBar from './components/Layout/TopBar';
export default {
  name: 'App',
  components: {
    TopBar
  },
  data: () => ({
    //
  }),
};
</script>
