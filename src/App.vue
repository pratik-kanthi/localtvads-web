<template>
  <div id="app">
    <web-header></web-header>
    <router-view></router-view>
    <web-footer></web-footer>
  </div>
</template>

<script>
import Header from './webapp/layout/Header';
import Footer from './webapp/layout/Footer';

export default {
  name: 'app',
  components: {
    webHeader: Header,
    webFooter: Footer
  }
}
</script>

<style lang="scss">
#app {
  color: $body-text;
  font-family: $font-family-body;
  font-size: $base-font-size;
  line-height: $line-height-base;
  font-weight: 400;
  height: 100%;
  background-color: $body-background;

}
</style>
