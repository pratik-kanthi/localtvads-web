<template>
    <div class="loader">
        <div class="overlay"></div>
        <div class="content">
            <div class="loader-wrapper" ref="loader"></div>
        </div>
    </div>
</template>

<script>
    import lottie from 'lottie-web';
    import animationData from '@/assets/data.json';
    export default {
        name: "LoaderModal",
        props: ['showloader','message'],
        mounted() {
            let animation = lottie.loadAnimation({
                container: this.$refs.loader,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData
            });
        },
    }
</script>

<style lang="scss" scoped>
    .overlay {
        opacity: 0.8
    }
    .content {
        color: #fff;
        padding: 8px;
        border-radius: 6px;
        position: absolute;
        top: 0;
        left: 0;
        margin: 0 auto;
        p {
            margin-bottom: 16px;
        }
        .loader-wrapper {
            width: 300px;
        }
    }
</style>