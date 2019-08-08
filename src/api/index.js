import Vue from 'vue';
import axios from 'axios';
import VueCookies from 'vue-cookies';
import router from 'vue-router';

const instance = axios.create({
	baseURL: window.endpoint
});

instance.defaults.headers.common['Content-Type'] = 'application/json';
instance.defaults.headers.get['Accepts'] = 'application/json';
instance.defaults.headers.common['Authorization'] = VueCookies.get('token');

instance.interceptors.request.use(
	function(config) {
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
					router.push('/login');
					break;
				}
			}
		}
		return Promise.reject(error.response);
	}
);

export default instance;
