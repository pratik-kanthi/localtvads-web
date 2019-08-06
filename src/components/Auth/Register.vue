<template>
    <div>
        <h3>Sign up to Local TV Ads</h3>
        <Google :api="api" :type="'Register'"></Google>
        <Facebook :api="api" :type="'Register'"></Facebook>
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

<style scoped>

</style>