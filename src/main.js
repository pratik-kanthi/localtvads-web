import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import './plugins';
import { store } from './store';
import moment from 'moment';
import './e9_components';
import '@/scss/style.scss';
import LoaderModal from './webapp/common/modals/LoaderModal';

window.$ = require('jquery');

Vue.config.productionTip = false;
Vue.prototype.GOOGLE_BUCKET_ENDPOINT = window.bucketendpoint;
Vue.prototype.ENDPOINT = window.endpoint;
Vue.prototype.moment = moment;

Vue.component('LoaderModal', LoaderModal);

new Vue({
	render: (h) => h(App),
	router: router,
	store
}).$mount('#app');
