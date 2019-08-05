<template>
    <div class="text-center">
        <v-dialog v-model="dialog" width="500">
            <v-card>
                <v-card-title>Register</v-card-title>
                <v-card-text>
                    <Google></Google>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Google from "@/components/Auth/Google";
    export default {
        name: 'Login',
        components: {Google},
        data() {
            return {
                dialog: true
            }
        }
    }
</script>

<style scoped>

</style>