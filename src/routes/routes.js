import Home from '@/webapp/home/Home';
// import Login from '@/webapp/common/Auth/Login';
// import Register from '@/webapp/common/Auth/Register';
// import BookAd from '@/webapp/common/BookAd';

export const routes = [
	{
		path: '',
		name: 'Home',
		component: Home
	},
	{
		path: '*',
		redirect: '/'
	}
];
