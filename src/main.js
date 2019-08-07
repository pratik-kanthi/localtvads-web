import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import vuetify from './plugins/vuetify';
import './plugins';
import './vue9_components/filters';
import { store } from './store';
import './scss/styles.scss';

Vue.config.productionTip = false;
Vue.config.GOOGLE_BUCKET_ENDPOINT = window.bucketendpoint;

new Vue({
	vuetify,
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
