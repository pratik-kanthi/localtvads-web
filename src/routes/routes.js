import { store } from '@/store';

import Home from '@/webapp/views/home/Home';
import ResetPassword from '@/webapp/common/modals/ResetPassword';

export const routes = [
    {
        path: '',
        name: 'Home',
        component: Home
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => {
            import (/* webpackChunkName: "post-login" */'@/webapp/views/profile/Profile');
        },
        beforeEnter: (to, from, next) => {
            if (store.getters.isLoggedIn) {
                next();
            } else {
                next({
                    name: 'Home'
                });
            }
        }
    },
    {
        path: '/ads',
        name: 'MyAds',
        component: () => {
            import (/* webpackChunkName: "post-login" */'@/webapp/views/profile/MyAds');
        },
        beforeEnter: (to, from, next) => {
            if (store.getters.isLoggedIn) {
                next();
            } else {
                next({
                    name: 'Home'
                });
            }
        }
    },
    {
        path: '/booking-flow',
        name: 'BookingFlow',
        component: () => {
            import (/* webpackChunkName: "booking-flow" */'@/webapp/views/booking-flow/BookingFlow');
        }
    },
    {
        path: '/addons',
        name: 'Addons',
        component: () => {
            import (/* webpackChunkName: "post-login" */'@/webapp/views/addons/Addons.vue');
        },
        beforeEnter: (to, from, next) => {
            if (store.getters.isLoggedIn) {
                next();
            } else {
                next({
                    name: 'Home'
                });
            }
        }
    },
    {
        path: '/transactions',
        name: 'Transactions',
        component: () => {
            import (/* webpackChunkName: "post-login" */'@/webapp/views/profile/Transactions.vue');
        },
        beforeEnter: (to, from, next) => {
            if (store.getters.isLoggedIn) {
                next();
            } else {
                next({
                    name: 'Home'
                });
            }
        }
    },
    {
        path: '/resetpassword',
        name: 'ResetPassword',
        component: ResetPassword,
        beforeEnter: (to, from, next) => {
            if (to.query.token) {
                next();
            } else {
                next({
                    name: 'Home'
                });
            }
        }
    },
    {
        path: '*',
        redirect: '/'
    }
];
