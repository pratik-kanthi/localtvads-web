import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import './less/styles.less';
import 'vuetify/dist/vuetify.min.css';
import './plugins';
import { store } from './store';
import moment from 'moment';

Vue.config.productionTip = false;
Vue.prototype.GOOGLE_BUCKET_ENDPOINT = window.bucketendpoint;
Vue.prototype.moment = moment;

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
