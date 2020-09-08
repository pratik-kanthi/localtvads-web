<template>
    <div v-if="videoUrl" class="video-container pointer" :style="{ height: autoHeight ? 'auto' : '200px' }">
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
        autoHeight: {
            type: Boolean
        },
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
        removeVideo() {
            this.$emit('remove', this.id);
        },
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
        .video-delete-icon {
            z-index: 100;
            position: absolute;
            right: 20px;
            cursor: pointer;
            color: white;
            top: 8px;
            display: none;
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
    &:hover {
        .video-delete-icon {
            display: block;
        }
    }

    video {
        border-radius: 5px;
        object-fit: cover;
    }
}
</style>
