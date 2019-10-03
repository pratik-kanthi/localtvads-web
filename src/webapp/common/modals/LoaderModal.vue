<template>
    <div v-if="showloader" class="loader">
        <div class="overlay"></div>
        <b-modal v-model="showloader">
            <div class="card">
                <div class="content">
                    <p>{{message}}</p>
                    <!-- <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear> -->
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
    export default {
        name: "LoaderModal",
        props: ['message']
    }
</script>

<style lang="scss" scoped>
    .content {
        background-color: $brand-primary  !important;
        color: #fff;
        padding: 8px;
        border-radius: 6px;

        p {
            margin-bottom: 16px;
        }
    }
</style>