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
            return import(/* webpackChunkName: "post-login" */ '@/webapp/views/profile/Profile');
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
            return import(/* webpackChunkName: "post-login" */ '@/webapp/views/profile/MyAds');
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
        path: '/plandetails',
        name: 'AdPlanDetails',
        component: () => {
            return import(/* webpackChunkName: "post-login" */ '@/webapp/views/profile/AdPlanDetails');
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
        path: '/my-addons',
        name: 'MyAddons',
        component: () => {
            return import(/* webpackChunkName: "post-login" */ '@/webapp/views/profile/MyAddons');
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
            return import(/* webpackChunkName: "booking-flow" */ '@/webapp/views/booking-flow/BookingFlow');
        },
        props: true
    },
    {
        path: '/addons',
        name: 'Addons',
        component: () => {
            return import(/* webpackChunkName: "post-login" */ '@/webapp/views/addons/Addons.vue');
        }
    },
    {
        path: '/transactions',
        name: 'Transactions',
        component: () => {
            return import(/* webpackChunkName: "post-login" */ '@/webapp/views/profile/Transactions.vue');
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
            if (to.query.token && !store.getters.isLoggedIn) {
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
