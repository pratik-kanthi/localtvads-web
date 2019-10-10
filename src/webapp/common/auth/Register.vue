<template>
    <div>
        <Facebook :api="api" :type="'Register'"></Facebook>
        <Google :api="api" :type="'Register'"></Google>
        <!-- <br class="clearfix"> -->
        <div class="separater text-center">
            <span class="content">or sign up with email address</span>
        </div>
        <form name="register">
            <div class="form-group">
                <input type="text" class="form-control" v-model="user.Name" placeholder="Name">
            </div>
            <div class="form-group">
                <input type="email" class="form-control" v-model="user.Email" placeholder="Email">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" v-model="user.Password" placeholder="Password">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" v-model="user.ConfirmPassword" placeholder="Confirm Password">
            </div>
            <p class="mt16 mb16 t-s">Password must contain at least 8 characters with at least 1 capital letter, 1 small letter and 1 number</p>
            <button class="btn btn-primary btn-full" @click="register" :disabled="!isValid || isAuthLoader">Register</button>
            <div class="alert alert-danger text-center mt24" v-if="errMessage">
                {{errMessage}}
            </div>
        </form>
        <LoaderModal :showloader="isAuthLoader" message="Please stand by while we authenticate..."></LoaderModal>
    </div>
</template>

<script>
    import Google from "@/webapp/common/auth/Google";
    import Facebook from "@/webapp/common/auth/Facebook";
    import instance from "@/api";
    import LoaderModal from  '@/webapp/common/modals/LoaderModal';
    import {mapGetters} from "vuex";
    export default {
        name: "Register",
        components: {Facebook, Google, LoaderModal},
        data(){
            return {
                api: 'api/auth/clientsocialregister',
                user: {
                    Name: '',
                    Email: '',
                    Password: '',
                    ConfirmPassword: '',
                    AuthorisationScheme: 'Standard'
                },
                show: false,
                errMessage: ''
            }
        },
        methods: {
            async register(){
                try {
                    this.$store.commit('LOGIN_LOADER', true);
                    await instance.post('api/auth/clientregister', this.user);
                    this.$store.commit('LOGIN_LOADER', false);
                    this.$store.commit('DIALOG', false);
                    this.$swal({
                        title: "Registration successful",
                        text: 'Thank you for registering with Local TV ads. Please check your email to confirm.',
                        type: "success",
                        confirmButtonColor: '#ff6500'
                    });
                    this.user = '';
                } catch (err) {
                    this.$store.commit('LOGIN_LOADER', false);
                    this.errMessage = err && err.data && err.data.message ? err.data.message : 'Some error occurred. Please contact administrator.';
                }
            }
        },
        computed: {
            isValid() {
                let flag = true;
                if(!this.user.Name) {
                    flag = false;
                }
                if(!this.user.Email) {
                    flag = false;
                }
                if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.user.Email))) {
                    flag = false
                }
                if(!this.user.Password) {
                    flag = false;
                }
                if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(this.user.Password))) {
                    flag = false
                }
                if (this.user.Password !== this.user.ConfirmPassword) {
                    flag = false;
                }
                return flag;
            },
            ...mapGetters(['isAuthLoader'])
        }
    }
</script>

<style scoped lang="scss">
    .separater {
        border-top: 1px solid #DDD;
        margin: 20px 0;
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