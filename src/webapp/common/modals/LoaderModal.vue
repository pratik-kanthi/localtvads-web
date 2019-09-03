<template>
    <div v-if="showloader" class="loader">
        <div class="overlay"></div>
        <v-dialog v-model="showloader" persistent width="300">
            <div class="card">
                <div class="content">
                    <p>{{message}}</p>
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </div>
            </div>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "LoaderModal",
    props: ['showloader', 'message']
}
</script>

<style lang="less" scoped>
    .content {
        background-color: @brand-primary !important;
        color: #fff;
        padding: 8px;
        border-radius: 6px;
        p {
            margin-bottom: 16px;
        }
    }
</style>
