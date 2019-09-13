<template>
    <p>Payment</p>
</template>

<script>
    export default {
        name: "Payment",
        methods: {
            isLoggedIn() {
                return this.$store.getters.isLoggedIn
            }
        },
        created() {
            if (!this.isLoggedIn()) {
                this.$store.commit('DIALOG', true);
            }
        }
    }
</script>

<style scoped>

</style>