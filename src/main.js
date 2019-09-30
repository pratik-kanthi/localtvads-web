import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import './plugins';
import { store } from './store';
import moment from 'moment';
import './e9_components';
import '@/scss/style.scss';

window.$ = require('jquery');

Vue.config.productionTip = false;
Vue.prototype.GOOGLE_BUCKET_ENDPOINT = window.bucketendpoint;
Vue.prototype.ENDPOINT = window.endpoint;
Vue.prototype.moment = moment;

new Vue({
	render: (h) => h(App),
	router: router,
	store
}).$mount('#app');
