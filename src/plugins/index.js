import Vue from 'vue';
import VueCookies from 'vue-cookies';
import io from 'socket.io-client';
import VueAgile from 'vue-agile';
import VueCarousel from 'vue-carousel';
import { ModalPlugin } from 'bootstrap-vue';
import { TablePlugin } from 'bootstrap-vue';
import { PaginationPlugin } from 'bootstrap-vue';
import { TabsPlugin, CardPlugin, InputGroupPlugin, FormSelectPlugin, FormGroupPlugin, FormRadioPlugin } from 'bootstrap-vue';
import VScrollLock from 'v-scroll-lock';
import VueSweetalert2 from 'vue-sweetalert2';
import VueAnalytics from 'vue-analytics';
import VueTelInput from 'vue-tel-input';

Vue.use(VueCookies);
Vue.prototype.io = io;
Vue.use(VueAgile);
Vue.use(VueCarousel);
Vue.use(ModalPlugin);
Vue.use(TablePlugin);
Vue.use(TabsPlugin);
Vue.use(InputGroupPlugin);
Vue.use(PaginationPlugin);
Vue.use(FormSelectPlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormRadioPlugin);
Vue.use(CardPlugin);
Vue.use(VScrollLock);
Vue.use(VueSweetalert2);
Vue.use(VueTelInput);

Vue.use(VueAnalytics, {
    id: 'UA-166794218-1',
    checkDuplicatedScript: true
});
