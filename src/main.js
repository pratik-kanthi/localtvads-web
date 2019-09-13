import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import './less/styles.less';
import 'vuetify/dist/vuetify.min.css';
window.$ = require('jquery');
import './plugins';
import { store } from './store';
import moment from 'moment';
import './e9_components';

Vue.config.productionTip = false;
Vue.prototype.GOOGLE_BUCKET_ENDPOINT = window.bucketendpoint;
Vue.prototype.ENDPOINT = window.endpoint;
Vue.prototype.moment = moment;

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
