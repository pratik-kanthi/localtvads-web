<template>
    <div>
        <Google :api="api"></Google>
        <Facebook :api="api"></Facebook>
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