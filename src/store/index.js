import Vue from 'vue';
import Vuex from 'vuex';
import VueCookies from 'vue-cookies';

Vue.use(Vuex);

const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";

export const store = new Vuex.Store({
    state: {
        isLoggedIn: !!VueCookies.get('token'),                // state to check whether user has logged in
        user: localStorage.getItem('user')
    },
    mutations: {
        [LOGIN_SUCCESS] (state) {
            state.isLoggedIn = true
        },
        [LOGOUT](state) {
            state.isLoggedIn = false;
            localStorage.removeItem('user');
            VueCookies.remove('token');
        }
    },
    actions: {
        loginSuccess ({ commit }) {
            commit(LOGIN_SUCCESS);
        },
        logout({ commit }) {
            VueCookies.remove("token");
            if(state.user.AuthorisationScheme === 'Facebook') {
                FB.logout();
            }
            commit(LOGOUT);
        }
    },
    getters: {
        isLoggedIn: state => {
            return state.isLoggedIn;
        },
        getUser: state => {
            return state.user;
        }
    }
});
