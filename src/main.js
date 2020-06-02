import '@/config';
import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import { store } from './store';
import moment from 'moment';
import './e9_components';
import '@/scss/style.scss';
import LoaderModal from './webapp/common/modals/LoaderModal';

window.$ = require('jquery');
window.google = {
    apiKey: '20k8iF8V4pJnjAwrhQqexEq2',
    clientId: '955842204870-l42aal4di5env4ud2t31m4ici46l70lf.apps.googleusercontent.com'
};
window.facebook = {
    appId: '639711399851969'
};

Vue.config.productionTip = false;
Vue.prototype.GOOGLE_BUCKET_ENDPOINT = window.bucketendpoint;
Vue.prototype.ENDPOINT = window.endpoint;
Vue.prototype.moment = moment;

Vue.component('LoaderModal', LoaderModal);

new Vue({
    render: h => h(App),
    router: router,
    store
}).$mount('#app');

import './plugins';
