import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import './less/styles.less';
import 'vuetify/dist/vuetify.min.css';
import './plugins';
import { store } from './store';

Vue.config.productionTip = false;
Vue.config.GOOGLE_BUCKET_ENDPOINT = window.bucketendpoint;

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
