import axios from 'axios';
import VueCookies from 'vue-cookies';
import router from '@/routes';

const instance = axios.create({
	baseURL: window.endpoint
});

let token = VueCookies.get('token');
let user = localStorage.getItem('user');
instance.defaults.headers.common['Content-Type'] = 'application/json';
instance.defaults.headers.get['Accepts'] = 'application/json';

if (!token && user) {
	localStorage.removeItem('user');
}

instance.interceptors.request.use(
	function(config) {
		config.headers['Authorization'] = 'bearer ' + VueCookies.get('token');
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	function(response) {
		return response;
	},
	(error) => {
		if (error.response && error.response.status) {
			switch (error.response.status) {
				case 403: {
					this.$store.dispatch('logout');
					router.go('/login');
					break;
				}
			}
		}
		return Promise.reject(error.response);
	}
);

export default instance;
