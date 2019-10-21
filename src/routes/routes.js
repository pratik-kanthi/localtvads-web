import Home from '@/webapp/views/home/Home';
import Profile from '@/webapp/views/profile/Profile';
import ResetPassword from '@/webapp/common/modals/ResetPassword';
import Transactions from '@/webapp/views/profile/Transactions.vue';
import CreateAd from '@/webapp/views/create-ad/CreateAd.vue';
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
        path: '/create-ad',
        name: 'CreateAd',
        component: CreateAd
    },
    {
        path: '/my-transactions',
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
