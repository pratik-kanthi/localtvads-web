import Vue from 'vue';
import Router from 'vue-router';
import {
    routes
} from './routes';

Vue.use(Router);

export default new Router({
    routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return window.scrollTo({
                top: document.querySelector(to.hash).offsetTop - 80,
                behavior: 'smooth'
            });
        } else if (savedPosition) {
            return savedPosition;
        } else {
            return {
                x: 0,
                y: 0
            };
        }
    }
});