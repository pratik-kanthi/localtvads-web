<template>
    <b-modal v-model="show" size="lg" title="Upload Video" centered hide-footer no-close-on-esc no-close-on-backdrop>
        <div class="upload-wrapper p48">
            <div class="upload-box" v-if="!upload.chosen && progress === 0">
                <h4 class="bold">Upload your video</h4>
                <p class="text-muted mb0">Click on the upload button or drag and drop your upload file here.</p>
                <p class="brand-primary">(please upload a video in any of these formats: {{ config.allowedExtensions.join(', ') }} )</p>

                <input id="fileUpload" class="hidden" type="file" @change="fileUploaded" accept="video/mp4, video/x-m4v, video/*" ref="fileUpload" />
                <button class="btn btn-primary upload mt16" @click="chooseFile" :disabled="isLoading">
                    <img src="@/assets/images/upload.svg" />
                    <span class="button-text">Upload Video</span>
                </button>
            </div>
            <div class="video-wrapper" v-if="progress === 0 && upload.chosen">
                <video controls class="mb24">
                    <source :src="videoUrl" type="video/mp4" />
                </video>
                <div class="action text-center">
                    <button class="btn btn-secondary btn-bordered m-xs0 mr16" @click="cancelUpload">Cancel</button>
                    <button class="btn btn-primary" @click="uploadVideo">Submit</button>
                </div>
            </div>
            <div class="upload-progress" v-else-if="progress > 0">
                <div class="details white-bg">
                    <div class="pull-left">
                        <strong class="t-l" v-text="upload.chosen.name"></strong>&nbsp;
                        <span class="text-muted">is uploading...</span>
                    </div>
                    <div class="pull-right">
                        <strong v-text="progress + ' %'"></strong>
                    </div>
                    <br class="clearfix" />
                    <div class="loader">
                        <div class="value" :style="{ width: progress + '%' }"></div>
                    </div>
                    <br class="clearfix" />
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script>
import '@/plugins/socket.io';
import { uploadMixin } from '@/mixins/upload';

export default {
    name: 'VideUpload',
    mixins: [uploadMixin],
    data() {
        return {
            //flags
            isLoading: false,
            show: true
        };
    },
    methods: {
        closeUpload() {
            this.$emit('close');
        }
    }
};
</script>

<style lang="scss">
.upload-wrapper {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    .upload-box {
        background: $white;
        border-radius: 10px;
        text-align: center;
        .upload {
            padding-left: 8px !important;
            height: 48px;
            box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.3);
            &:focus {
                border: none;
                outline: 0;
            }
            img {
                top: 3px;
                position: relative;
                padding-right: 8px;
            }
            .button-text {
                border-left: 1px solid $light-grey;
                padding-top: 2px;
                padding-bottom: 2px;
                padding-left: 20px;
                padding-right: 8px;
                font-size: 14px;
                font-weight: 500;
            }
        }
    }
    .video-wrapper {
        height: auto;
        video {
            height: 400px;
            object-fit: contain;
            background: #000;
        }
    }
}
</style>
