<template>
    <div>
        <Google :api="api" :type="'Register'"></Google>
        <Facebook :api="api" :type="'Register'"></Facebook>
        <br class="clearfix">
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
            <button class="btn btn-primary btn-full" @click="register" :disabled="!isValide || $store.state.auth.loader">Register</button>
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
        name: "Register",
        components: {Facebook, Google},
        data(){
            return {
                api: 'api/auth/clientsocialregister',
                user: {
                    Name: '',
                    Email: '',
                    Password: '',
                    AuthorisationScheme: 'Standard'
                },
                show: false,
                errMessage: ''
            }
        },
        methods: {
            async register(){
                try {
                    this.$store.state.auth.loader = true;
                    let result = await instance.post('api/auth/clientregister', this.user);
                    this.$store.state.auth.loader = false;
                    this.$store.commit('DIALOG', false);
                    this.$swal({
                        title: "Registration successful",
                        text: 'Thank you for registering with Local TV ads. Please check your email to confirm.',
                        type: "success"
                    });
                    this.user = '';
                } catch (err) {
                    this.$store.state.auth.loader = false;
                    this.errMessage = err.data ? err.data.message : '';
                }
            }
        },
        computed: {
            isValide() {
                let flag = true;
                if(!this.user.Name) {
                    flag = false;
                }
                if(!this.user.Email) {
                    flag = false;
                }
                if(!(/.+@.+/.test(this.user.Email))) {
                    flag = false
                }
                if(!this.user.Password) {
                    flag = false;
                }
                if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(this.user.Password))) {
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