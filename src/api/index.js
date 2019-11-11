import axios from 'axios';
import VueCookies from 'vue-cookies';

const instance = axios.create({
    baseURL: window.endpoint
});

let token = VueCookies.get('token');
let user = localStorage.getItem('user');
instance.defaults.headers.common['Content-Type'] = '*/*';
instance.defaults.headers.get['Accepts'] = '*/*';

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
        if (error.response && error.response.status) {
            switch (error.response.status) {
            case 401: {
                localStorage.removeItem('user');
                VueCookies.remove('token');
                window.location.href = '/';
                break;
            }
            }
        }
        return Promise.reject(error.response);
    }
);

export default instance;
