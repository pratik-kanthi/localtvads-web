<template>
    <div class="loader" v-show="showloader">
        <div class="overlay"></div>
        <div class="content" v-scroll-lock="showloader">
            <p v-if="message" class="brand-primary bold">{{ message }}</p>
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
        padding: 8px;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        p {
            margin-top: 16px;
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
