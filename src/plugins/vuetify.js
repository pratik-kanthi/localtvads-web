import Vue from 'vue';
import Vuetify, { VDialog } from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify, {
	components: {
		VDialog
	},
	icons: {
		iconfont: 'md'
	},
	theme: {
		primary: '#FF6500',
		secondary: '#4C4C4C'
	}
});
