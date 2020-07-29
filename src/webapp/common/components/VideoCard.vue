<template>
    <div v-if="videoUrl" class="video-container pointer">
        <video :id="id" class="video" :src="GOOGLE_BUCKET_ENDPOINT + videoUrl" width="100%" height="100%" @loadedmetadata="forwardVideo(id)"></video>
        <div class="video-bg">
            <img src="@/assets/images/player_button.png" alt="play" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'VideoCard',
    props: {
        videoUrl: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    methods: {
        forwardVideo(id) {
            let elem = document.getElementById(id);
            elem.currentTime = 2;
        }
    }
};
</script>

<style lang="scss" scoped>
.video-container {
    cursor: pointer;
    position: relative;
    .video-bg {
        background-color: #0000005c;
        border-radius: 5px;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 400px;
        @include media-breakpoint-down(sm) {
            width: 290px;
        }

        img {
            position: absolute;
            top: 50%;
            left: 50%;
            height: 40px;
            width: 40px;
            margin-left: -20px;
            margin-top: -20px;
        }
    }
    video {
        width: 400px;
        border-radius: 5px;

        @include media-breakpoint-down(sm) {
            width: 290px;
        }
    }
}
</style>
