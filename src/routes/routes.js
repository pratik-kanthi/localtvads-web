import Home from '@/webapp/views/home/Home';
import Profile from '@/webapp/views/profile/Profile';
import ForgotPassword from '@/webapp/common/modals/ForgotPassword';
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
		path: '/forgotpassword',
		name: 'ForgotPassword',
		component: ForgotPassword
	},
	{
		path: '*',
		redirect: '/'
	}
];
