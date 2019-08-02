import axios from "axios";
import VueCookies from 'vue-cookies'

const instance = axios.create({
  baseURL: 'http://localhost:8080/'
});

instance.defaults.headers.common['Content-Type'] = 'application/json';
instance.defaults.headers.get['Accepts'] = 'application/json';
instance.defaults.headers.common['Authorization'] = VueCookies.get('token');


export default instance;
