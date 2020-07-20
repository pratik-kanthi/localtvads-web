import axios from 'axios';
import VueCookies from 'vue-cookies';

let $http;
export const init = router => {
    $http = axios.create({
        baseURL: window.endpoint
    });
    let token = VueCookies.get('token');
    let user = localStorage.getItem('user');
    $http.defaults.headers.common['Content-Type'] = 'application/json';
    $http.defaults.headers.get['Accepts'] = 'application/json';
    if (!token && user) {
        localStorage.removeItem('user');
    }
    $http.interceptors.request.use(
        config => {
            config.headers['Authorization'] = 'bearer ' + VueCookies.get('token');
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    $http.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            if (error.response && error.response.status) {
                switch (error.response.status) {
                case 401: {
                    localStorage.removeItem('user');
                    VueCookies.remove('token');
                    window.location.href = '/index.html';
                    break;
                }
                case 403: {
                    router.push('/forbidden');
                    break;
                }
                }
            }
            return Promise.reject(error.response);
        }
    );
    return $http;
};
export const query = (resource, params) => {
    return $http
        .get(`${resource}`, {
            params: params
        })
        .catch(error => {
            return Promise.reject(error);
        });
};
export const get = (resource, id = '') => {
    let _url = resource;
    if (id) {
        _url += '/' + id;
    }
    return $http.get(_url).catch(error => {
        throw error;
    });
};
export const count = (resource, params) => {
    return $http.get(`${resource}/count`, params).catch(error => {
        throw error;
    });
};
export const post = (resource, body, params) => {
    return $http
        .post(`${resource}`, body, {
            params
        })
        .catch(error => {
            throw error;
        });
};
export const update = (resource, id, params) => {
    return $http.put(`${resource}/${id}`, params).catch(error => {
        throw error;
    });
};
export const put = (resource, params) => {
    return $http.put(`${resource}`, params).catch(error => {
        throw error;
    });
};
export const remove = (resource, params) => {
    return $http
        .delete(`${resource}`, {
            params
        })
        .catch(error => {
            throw error;
        });
};
export const search = (resource, page, size, projection, populate, filters, sort, text) => {
    return $http
        .post(
            `api/search/${resource}`, {
                filters,
                projection,
                populate,
                sort
            }, {
                params: {
                    page,
                    size,
                    text
                }
            }
        )
        .catch(error => {
            throw error;
        });
};
export {
    $http
};