import Vue from 'vue';
import Vuex from 'vuex';
import VueCookies from 'vue-cookies';
import VueRouter from 'vue-router';
import { stat } from 'fs';

Vue.use(Vuex);

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';
const DIALOG = 'DIALOG';
const DIALOG_CHOSEN = 'DIALOG_CHOSEN';

export const store = new Vuex.Store({
	state: {
		isAuth: !!VueCookies.get('token'), // state to check whether user has logged in
		user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '',
		auth: {
			showDialog: false,
			loader: false,
			defaultChosen: ''
		}
	},
	mutations: {
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
		}
	}
});
