<template>
    <div>
        <Google :api="api"></Google>
        <Facebook :api="api"></Facebook>
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
                api: 'api/auth/clientsociallogin'
            }
        }
    }
</script>

<style scoped>

</style>