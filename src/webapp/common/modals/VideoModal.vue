<template>
    <b-modal v-model="showVideo" size="lg" centered hide-header hide-footer no-close-on-esc no-close-on-backdrop id="video-modal">
        <div class="video-wrapper">
            <video controls :src="videoUrl" autoplay="true"></video>
            <i class="material-icons close-video" @click="close">clear</i>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: 'VideoModal',
    props: {
        showVideo: {
            type: Boolean,
            required: true
        },
        videoUrl: {
            type: String,
            required: true
        }
    },
    data() {
        return {};
    },
    methods: {
        close() {
            this.$emit('close', true);
        }
    }
};
</script>

<style lang="scss">
#video-modal {
    .modal-content {
        background-color: transparent !important;
        border: none;
        .modal-body {
            padding: 0;
        }
    }
}
</style>
<style lang="scss" scopped>
.video-wrapper {
    position: relative;
    border-radius: 6px;
    video {
        width: 100%;
        padding: 24px 0;
        object-fit: contain;
        cursor: pointer;
        -webkit-appearance: none;
        &:focus {
            outline: none;
        }
    }
    .close-video {
        cursor: pointer;
        color: $white;
        display: none;
        position: absolute;
        top: 8px;
        right: 4px;
        padding: 2px;
        background-color: $black;
        border-radius: 50%;
    }
    &:hover {
        .close-video {
            display: inline-block;
        }
    }
}
</style>
