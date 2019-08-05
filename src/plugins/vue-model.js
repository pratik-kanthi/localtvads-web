import Vue from 'vue';
import VueModel from '@/vue9_components/plugins/model';

Vue.use(VueModel);
Vue.prototype.$model = VueModel.Model;