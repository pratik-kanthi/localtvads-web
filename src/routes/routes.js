import Home from '@/views/Home/Home';
import Login from '@/components/Auth/Login';
import Register from '@/components/Auth/Register';
import BookAd from '@/components/BookAd';

export const routes = [
	{
		path: '',
		name: 'Home',
		component: Home
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/register',
		name: 'Register',
		component: Register
	},
	{
		path: '*',
		redirect: '/'
	}
];
