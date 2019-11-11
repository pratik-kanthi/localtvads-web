<template>
    <div>
        <div v-if="!isEmailConfirmed">
            <Facebook :api="api" :type="'Login'"></Facebook>
        </div>
        <div v-if="!isEmailConfirmed">
            <Google :api="api" :type="'Login'"></Google>
        </div>
        <div v-if="!isEmailConfirmed" class="separater text-center">
            <span class="content">or log in with email address</span>
        </div>
        <div v-else class="text-center mb16">
            <span class="content p0">Your email address has been verified. Please login to continue.</span>
        </div>
        <form name="loginform">
            <div class="form-group">
                <input type="email" v-model="user.email" class="form-control" placeholder="Email" />
            </div>
            <div class="form-group">
                <input type="password" v-model="user.password" class="form-control" placeholder="Password" />
            </div>
            <div class="mb16 lh16">
                <a class="pointer underline" @click="toggleForgotPassword">Forgot Password?</a>
            </div>
            <button class="btn btn-primary btn-full" @click="login" :disabled="!isValid || isAuthLoader">Login</button>
            <LoaderModal :showloader="isAuthLoader" message="Please stand by while we authenticate..."></LoaderModal>
            <div class="alert alert-danger text-center mt16" v-if="errMessage">
                {{ errMessage }}
            </div>
        </form>
    </div>
</template>

<script>
import Google from '@/webapp/common/auth/Google';
import Facebook from '@/webapp/common/auth/Facebook';
import LoaderModal from '@/webapp/common/modals/LoaderModal';

import instance from '@/api/login';
import { mapGetters } from 'vuex';

export default {
    name: 'Login',
    props: ['isEmailConfirmed'],
    components: { Facebook, Google, LoaderModal },
    data() {
        return {
            api: 'api/auth/clientsociallogin',
            errMessage: '',
            show: false,
            user: {
                email: '',
                password: ''
            },
            showForgotPasswordModal: false
        };
    },
    methods: {
        toggleForgotPassword() {
            this.$store.commit('DIALOG', false);
            this.$store.commit('FORGOT_PASSWORD', true);
        },
        async login() {
            this.errMessage = '';
            this.$store.commit('LOGIN_LOADER', true);
            try {
                let result = await instance.post('api/auth/clientlogin', this.user);
                this.$cookies.set(
                    'token',
                    result.data.TokenString,
                    result.data.iat - Math.floor(Date.now() / 1000) + 's'
                );
                delete result.data.TokenString;
                localStorage.setItem('user', JSON.stringify(result.data));
                this.$store.dispatch('loginSuccess');
                this.$emit('close');
            } catch (err) {
                this.$store.commit('LOGIN_LOADER', false);
                this.errMessage = err && err.data ? err.data.message : '';
            }
        }
    },
    computed: {
        isValid() {
            let flag = true;
            if (!this.user.email) {
                flag = false;
            }
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.user.email)) {
                flag = false;
            }
            if (!this.user.password) {
                flag = false;
            }
            return flag;
        },
        ...mapGetters(['isAuthLoader'])
    }
};
</script>

<style scoped lang="scss">
    .separater {
        border-top: 1px solid #ddd;
        margin: 16px 0;
        line-height: 20px;

        .content {
            background: #fff;
            padding: 12px;
            font-size: 12px;
            color: #333 !important;
            position: relative;
            top: -12px;

            .pointer {
                cursor: pointer;
            }

            p.underline {
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>