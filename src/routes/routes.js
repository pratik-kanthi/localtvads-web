import Login from '@/components/Auth/Login';

export const routes = [
    {
        path: '',
        name: 'Login',
        component: Login
    },
    {
        path: '*',
        redirect: '/'
    }
];