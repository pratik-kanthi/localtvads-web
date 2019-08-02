import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	icons: {
		iconfont: 'mdi'
	},
	theme: {
		primary: '#FF6500',
		secondary: '#4C4C4C',
		white: '#fff'
	}
});
