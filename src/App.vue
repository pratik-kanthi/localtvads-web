<template>
  <div>
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from '@/webapp/layout/Header';
export default {
  name: 'App',
  components: {
    Header
  },
  data: () => ({
    //
  }),
};
</script>

<style lang="less">

</style>