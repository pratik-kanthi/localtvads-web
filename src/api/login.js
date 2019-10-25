import axios from 'axios';
import VueCookies from 'vue-cookies';

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
    (config) => {
        config.headers['Authorization'] = 'bearer ' + VueCookies.get('token');
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error.response);
    }
);

export default instance;
