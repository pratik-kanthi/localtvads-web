import Login from '@/components/Auth/Login';
import Register from '@/components/Auth/Register';

export const routes = [
    {
        path: '',
        name: 'Register',
        component: Register
    },
    {
        path: '*',
        redirect: '/'
    }
];