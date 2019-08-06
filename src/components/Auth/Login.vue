<template>
    <div>
        <h3>Login to Local TV Ads</h3>
        <Google :api="api" :type="'Login'"></Google>
        <Facebook :api="api" :type="'Login'"></Facebook>
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

</style>