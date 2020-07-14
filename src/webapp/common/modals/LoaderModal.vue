<template>
    <div class="loader" v-show="showloader">
        <div class="overlay"></div>
        <div class="content d-flex flex-column justify-content-center align-items-center" v-scroll-lock="showloader">
            <img src="@/assets/images/loader.svg" height="120" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoaderModal',
    props: ['showloader', 'message']
};
</script>

<style lang="scss" scoped>
.loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1041;
    .overlay {
        opacity: 0.95;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;
        z-index: 2;
    }
    .content {
        min-height: 100vh;
        border-radius: 6px;
        width: 100%;

        img {
            z-index: 999;
        }
        p {
            font-size: 18px;
            z-index: 3;
        }
        .loader-wrapper {
            width: 300px;
            height: 300px;
            z-index: 3;
        }
    }
}
</style>
