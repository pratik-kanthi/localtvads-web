import Vue from 'vue';
import Vuex from 'vuex';
import VueCookies from 'vue-cookies';

Vue.use(Vuex);

const LOGIN_LOADER = 'LOGIN_LOADER';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';
const DIALOG = 'DIALOG';
const DIALOG_CHOSEN = 'DIALOG_CHOSEN';
const VIDEO_BEING_UPLOADED = 'VIDEO_BEING_UPLOADED';
const FORGOT_PASSWORD = 'FORGOT_PASSWORD';

export const store = new Vuex.Store({
    state: {
        isAuth: !!VueCookies.get('token'), // state to check whether user has logged in
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '',
        auth: {
            showDialog: false,
            loader: false,
            defaultChosen: ''
        },
        bookingFlow: {
            videoBeingUploaded: false
        },
        forgotPassword: false
    },
    mutations: {
        [LOGIN_LOADER](state, val) {
            state.auth.loader = val;
        },
        [LOGIN_SUCCESS](state) {
            state.auth.showDialog = false;
            state.auth.loader = false;
            state.user = JSON.parse(localStorage.getItem('user'));
            state.isAuth = true;
        },
        [LOGOUT](state) {
            localStorage.removeItem('user');
            VueCookies.remove('token');
            state.isAuth = false;
        },
        [DIALOG](state, val) {
            state.auth.showDialog = val;
        },
        [DIALOG_CHOSEN](state, val) {
            state.auth.showDialog = true;
            state.auth.defaultChosen = val;
        },
        [VIDEO_BEING_UPLOADED](state, val) {
            state.bookingFlow.videoBeingUploaded = val;
        },
        [FORGOT_PASSWORD](state, val) {
            state.forgotPassword = val;
        }
    },
    actions: {
        loginSuccess({ commit }) {
            commit(LOGIN_SUCCESS);
        },
        logout({ commit }) {
            commit(LOGOUT);
        }
    },
    getters: {
        isAuthLoader: (state) => {
            return state.auth.loader;
        },
        isLoggedIn: (state) => {
            return state.isAuth;
        },
        getUser: (state) => {
            return state.user;
        },
        getShowDialog: (state) => {
            return state.auth.showDialog;
        },
        getDefaultChosen: (state) => {
            return state.auth.defaultChosen;
        },
        getIsVideoBeingUploaded: (state) => {
            return state.bookingFlow.videoBeingUploaded;
        }
    }
});
