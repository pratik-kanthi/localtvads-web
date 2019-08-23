import Home from '@/webapp/views/home/Home';
import CreateVideoAd from '@/webapp/views/create-ad/CreateVideoAd';

export const routes = [
	{
		path: '',
		name: 'Home',
		component: Home
	},
	{
		path: '/create-ad',
		name: 'CreateVideoAd',
		component: CreateVideoAd
	},
	{
		path: '*',
		redirect: '/'
	}
];
