import Home from '@/webapp/views/home/Home';
import CreateVideoAd from '@/webapp/views/create-ad/CreateVideoAd';
import ChoosePlan from '@/webapp/views/booking-flow/ChoosePlan.vue';
import { store } from '@/store';
import BookingFlow from "../webapp/views/booking-flow/BookingFlow";

export const routes = [
	{
		path: '',
		name: 'Home',
		component: Home
	},
	{
		path: '/choose-plan',
		name: 'ChoosePlan',
		component: ChoosePlan
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
		path: '*',
		redirect: '/'
	}
];
