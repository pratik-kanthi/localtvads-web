import Home from '@/webapp/views/home/Home';
import Profile from '@/webapp/views/profile/Profile';
import MyAds from '@/webapp/views/profile/MyAds';
import ResetPassword from '@/webapp/common/modals/ResetPassword';
import Transactions from '@/webapp/views/profile/Transactions.vue';
import Addons from '@/webapp/views/addons/Addons.vue';
export const routes = [
    {
        path: '',
        name: 'Home',
        component: Home
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/ads',
        name: 'MyAds',
        component: MyAds
    },
    {
        path: '/booking-flow',
        name: 'BookingFlow',
        component: (resolve) => {
            require.ensure(
                ['@/webapp/views/booking-flow/BookingFlow'],
                () => {
                    resolve(require('@/webapp/views/booking-flow/BookingFlow'));
                },
                'booking-flow'
            );
        }
    },
    {
        path: '/addons',
        name: 'Addons',
        component: Addons
    },
    {
        path: '/transactions',
        name: 'Transactions',
        component: Transactions
    },
    {
        path: '/resetpassword',
        name: 'ResetPassword',
        component: ResetPassword,
        beforeEnter: (to, from, next) => {
            if (to.query.token) {
                next();
            } else {
                next(false);
            }
        }
    },
    {
        path: '*',
        redirect: '/'
    }
];
