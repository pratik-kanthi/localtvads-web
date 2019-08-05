import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
	icons: {
		iconfont: 'mdi'
	},
	theme: {
		primary: '#FF6500',
		secondary: '#4C4C4C',
		error: '#4C4C4C',
		warning: '#FF8F46',
		info: '#319FF0',
		success: '#52CB3C'
	}
});
