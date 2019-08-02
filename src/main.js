import Vue from 'vue'
import App from './App.vue'
import router from './routes';
import vuetify from './plugins/vuetify';
import './plugins';
import {store} from './store';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
