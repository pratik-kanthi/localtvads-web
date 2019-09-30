import Home from '@/webapp/views/home/Home';
import BookingFlow from '@/webapp/views/booking-flow/BookingFlow';
export const routes = [
	{
		path: '',
		name: 'Home',
		component: Home
	},
	{
		path: '/booking-flow',
		name: 'BookingFlow',
		component: (resolve) => {
			require.ensure(
				[ '@/webapp/views/booking-flow/BookingFlow' ],
				() => {
					resolve(require('@/webapp/views/booking-flow/BookingFlow'));
				},
				'booking-flow'
			);
		}
	},
	{
		path: '*',
		redirect: '/'
	}
];
