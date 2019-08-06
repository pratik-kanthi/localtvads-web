import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify);

export default new Vuetify({
	icons: {
		iconfont: 'md'
	},
	theme: {
		themes: {
			light: {
				primary: '#FF6500',
				secondary: '#4C4C4C'
			}
		}
	}
});
