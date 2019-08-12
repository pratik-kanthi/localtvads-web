import Vue from 'vue';
import App from './App.vue';
// import Vuetify from './plugins/vuetify';
import router from './routes';
// import './plugins';
import './less/styles.less';
// import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;

new Vue({
	router,
	render: (h) => h(App)
}).$mount('#app');
