<template>
    <section class="p-xs0">
        <div class="container" v-if="$parent.clientAdPlan">
            <div class="upload-wrapper">
                <div v-if="progress === 0 && !$parent.clientAdPlan.ClientAd && !upload.chosen" class="upload-box">
                    <h4 class="bold">You can now upload your video</h4>
                    <p class="text-muted mb0">Click on the upload button or drag and drop your upload file here.</p>
                    <p class="brand-primary">(less than {{ config.maxSize }}MB and within {{ $parent.clientAdPlan.ChannelPlan.Plan.Seconds }} seconds)</p>
                    <input id="fileUpload" class="hidden" type="file" @change="fileUploaded" accept="video/mp4,video/x-m4v,video/*" ref="fileUpload" />
                    <button class="btn btn-primary upload mt16" @click="chooseFile" :disabled="isLoading"><img src="@/assets/images/upload.svg" /> <span class="button-text">Upload Video</span></button>
                </div>
                <div class="video-wrapper" v-if="progress === 0 && upload.chosen">
                    <video controls class="mb24">
                        <source :src="videoUrl" type="video/mp4" />
                    </video>
                    <div class="action text-center">
                        <button class="btn btn-white btn-bordered m-xs0 mr16" @click="cancelUpload">Cancel</button>
                        <button class="btn btn-white" @click="uploadVideo">Submit</button>
                    </div>
                </div>
                <div class="upload-progress" v-else-if="progress > 0">
                    <div class="details">
                        <div class="pull-left"><strong class="t-l" v-text="upload.chosen.name"></strong>&nbsp;<span class="text-muted">is uploading...</span></div>
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
            <LoaderModal :showloader="progress === 100 && processing" message="Upload successful, please wait while we process the video..."></LoaderModal>
        </div>
    </section>
</template>

<script>
import '@/plugins/socket.io';
import { uploadMixin } from '@/mixins/upload';
export default {
    name: 'UploadAd',
    mixins: [uploadMixin],
    data() {
        return {
            processing: false
        };
    },
    methods: {
        async uploadFile() {
            this.isLoading = true;
            this.$store.commit('VIDEO_BEING_UPLOADED', true);
            let counter = 1;
            let chunkSize = 100000;
            this.socket = this.io(window.socketendpoint, {
                query: {
                    token: this.$cookies.get('token')
                }
            });
            let start = 0;
            let chunk = this.upload.chosen.slice(start, chunkSize);
            this.sendSocket(chunk, counter, chunkSize, this.$parent.clientAdPlan, 'UPLOAD_CHUNK');
            this.socket.on('UPLOAD_CHUNK_FINISHED', data => {
                this.progress = (((data * 100000) / this.upload.chosen.size) * 100).toFixed(0);
                ++counter;
                start = start + chunkSize;
                if (start - chunkSize < this.upload.chosen.size) {
                    chunk = this.upload.chosen.slice(start, start + chunkSize);
                    this.sendSocket(chunk, counter, chunkSize, this.$parent.clientAdPlan, 'UPLOAD_CHUNK');
                }
            });

            this.socket.on('UPLOAD_FINISHED', () => {
                this.progress = 100;
                this.processing = true;
            });
            this.socket.on('UPLOAD_ERROR', () => {
                this.$swal({
                    title: 'Error',
                    text: 'There was an error while uploading the video',
                    type: 'error'
                });
                this.socket.disconnect();
                this.isLoading = false;
                this.$store.commit('VIDEO_BEING_UPLOADED', false);
            });
            this.socket.on('PROCESS_FINISHED', () => {
                setTimeout(() => {
                    this.$swal({
                        title: 'Uploaded',
                        text: 'Ad has been uploaded successfully',
                        type: 'success',
                        confirmButtonColor: '#ff6500'
                    });
                    this.progress = 0;
                    this.processing = false;
                    this.$store.commit('VIDEO_BEING_UPLOADED', false);
                    this.socket.disconnect();
                    this.$parent.fetchClientAdPlan();
                }, 1000);
            });
        }
    }
};
</script>

<style scoped lang="scss">
.upload-wrapper {
    margin: 0 80px;
    background-image: url('../../../assets/images/pattern.svg');
    background-color: $brand-primary;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    padding: 64px 108px;
    border-radius: 8px;
    .upload-box {
        background: $white;
        box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 64px;
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
            height: auto;
            object-fit: contain;
            background: #000;
        }
    }
}
</style>
