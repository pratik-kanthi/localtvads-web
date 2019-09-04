import Home from '@/webapp/views/home/Home';
import CreateVideoAd from '@/webapp/views/create-ad/CreateVideoAd';
import {store} from '@/store'

export const routes = [
    {
        path: '',
        name: 'Home',
        component: Home
    },
    {
        path: '/create-ad',
        name: 'CreateVideoAd',
        component: CreateVideoAd,
        beforeEnter: (to, from, next) => {
            if (store.getters.isLoggedIn) {
                next();
            } else {
                store.commit('DIALOG', true);
                next(false);
            }
        }
    },
    {
        path: '*',
        redirect: '/'
    }
];
