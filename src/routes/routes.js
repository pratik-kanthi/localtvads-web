import Home from '@/webapp/views/home/Home';
import Profile from '@/webapp/views/profile/Profile';
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
