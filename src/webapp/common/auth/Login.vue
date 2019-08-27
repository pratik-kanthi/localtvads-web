<template>
    <div>
        <Google :api="api" :type="'Login'"></Google>
        <Facebook :api="api" :type="'Login'"></Facebook>
        <br class="clearfix">
        <div class="separater text-center">
            <span class="content">or log in with email address</span>
        </div>
        <form name="loginform">
            <div class="form-group">
                <input type="email" v-model="user.email" class="form-control" placeholder="Email">
            </div>
            <div class="form-group">
                <input type="password" v-model="user.password" class="form-control" placeholder="Password">
            </div>
            <button class="btn btn-primary btn-full" @click="login" :disabled="!isValid || $store.state.auth.loader">Login</button>
            <div class="alert alert-danger text-center" v-if="errMessage">
                <small>{{errMessage}}</small>
            </div>
        </form>
    </div>
</template>

<script>
    import Google from "@/webapp/common/auth/Google";
    import Facebook from "@/webapp/common/auth/Facebook";
    import instance from "@/api";
    export default {
        name: 'Login',
        components: {Facebook, Google},
        data(){
            return {
                api: 'api/auth/clientsociallogin',
                user: {
                    email: '',
                    password: ''
                },
                show: false,
                errMessage: ''
            }
        },
        methods: {
            async login() {
                this.errMessage = '';
                this.$store.state.auth.loader = true;
                try {
                    let result = await instance.post('api/auth/clientlogin', this.user);
                    this.$cookies.set('token', result.data.TokenString, (result.data.iat - Math.floor(Date.now() / 1000) + 's'));
                    delete result.data.TokenString;
                    localStorage.setItem('user', JSON.stringify(result.data));
                    this.$store.dispatch('loginSuccess');
                } catch (err) {
                    this.$store.state.auth.loader = false;
                    this.errMessage = err.data ? err.data.message : '';
                }
            }
        },
        computed: {
            isValid() {
                let flag = true;
                if(!this.user.email) {
                    flag = false
                }
                if(!(/.+@.+/.test(this.user.email))) {
                    flag = false
                }
                if(!this.user.password) {
                    flag = false
                }
                return flag;
            }
        }
    }
</script>

<style scoped lang="less">
    .separater {
        border-top: 1px solid #DDD;
        margin: 16px 0;
        line-height: 20px;
        .content {
            background: #fff;
            padding: 12px;
            font-size: 12px;
            color: #333 !important;
            position: relative;
            top: -12px;
        }
    }

</style>