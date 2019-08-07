<template>
    <div>
        <h3>Login to Local TV Ads</h3>
        <Google :api="api" :type="'Login'"></Google>
        <Facebook :api="api" :type="'Login'"></Facebook>
        <div class="divider">
            <span class="content">or log in with email address</span>
        </div>
        <StandardLogin></StandardLogin>
    </div>
</template>

<script>
    import Google from "@/components/Auth/Social/Google";
    import Facebook from "./Social/Facebook";
    import StandardLogin from "./Standard/StandardLogin";
    export default {
        name: 'Login',
        components: {StandardLogin, Facebook, Google},
        data(){
            return {
                api: 'api/auth/clientsociallogin',
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