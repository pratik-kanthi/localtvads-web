import Home from '@/webapp/views/home/Home';
import CreateVideoAd from '@/webapp/views/create-ad/CreateVideoAd';
import { store } from '@/store';
import BookingFlow from "../webapp/views/booking-flow/BookingFlow";

export const routes = [
	{
		path: '',
		name: 'Home',
		component: Home
	},
	{
		path: '/booking-flow',
		name: 'BookingFlow',
		component: BookingFlow
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
		path: '/resetpassword',
		name: 'ResetPassword',
		component: Home,
		beforeEnter: (to, from, next) => {
			if (to.query.token) {
				next();
			} else {

				next(false);
			}
		}
	},
	{
		path: '/forgotpassword',
		name: 'ForgotPassword',
		component: Home
	},
	{
		path: '*',
		redirect: '/'
	}
];
