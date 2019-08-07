<template>
    <div>
        <h3>Sign up to Local TV Ads</h3>
        <Google :api="api" :type="'Register'"></Google>
        <Facebook :api="api" :type="'Register'"></Facebook>
        <div class="divider">
            <span class="content">or sign up with email address</span>
        </div>
        <StandardRegister></StandardRegister>
    </div>
</template>

<script>
    import Google from "./Social/Google";
    import Facebook from "./Social/Facebook";
    import StandardRegister from "./Standard/StandardRegister";
    export default {
        name: "Register",
        components: {StandardRegister, Facebook, Google},
        data(){
            return {
                api: 'api/auth/clientsocialregister'
            }
        }
    }
</script>

<style scoped lang="scss">
    .divider {
        text-align: center;
        border-bottom: 1px solid #D2D6D9;
        line-height: .1em;
        margin: 24px 16px;
        .content {
            background: #fff;
            padding: 12px;
            font-size: 12px;
        }
    }
</style>