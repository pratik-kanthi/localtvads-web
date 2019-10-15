<template>
    <section class="p-xs0">
        <div class="container" v-if="$parent.clientAdPlan">
            <div class="upload-wrapper">
                <div v-if="progress === 0 && !$parent.clientAdPlan.ClientAd && !upload.chosen" class="upload-box">
                    <h4 class="bold">You can Upload Video</h4>
                    <p class="text-muted mb0">Click on the upload button or drag and drop your upload file here.</p>
                    <p class="brand-primary">(less than {{ config.maxSize }}MB and within {{ $parent.clientAdPlan.ChannelPlan.Plan.Seconds }} seconds) </p>
                    <input id="fileUpload" class="hidden" type="file" @change="fileUploaded" accept="video/mp4,video/x-m4v,video/*" ref="fileUpload" />
                    <button class="btn btn-primary upload mt16" @click="chooseFile" :disabled="isLoading"><img src="@/assets/images/upload.svg"> <span class="button-text">Upload Video</span></button>
                </div>
                <div class="video-wrapper" v-if="progress === 0 && upload.chosen">
                    <video controls class="mb24">
                        <source :src="videoUrl" type="video/mp4">
                    </video>
                    <div class="action text-center">
                        <button class="btn btn-white btn-bordered m-xs0 mr16" @click="cancelUpload">Cancel</button>
                        <button class="btn btn-white" @click="uploadVideo">Submit</button>
                    </div>
                </div>
                <div class="upload-progress" v-else-if="progress > 0">
                    <div class="details">
                        <div class="pull-left">
                            <strong class="t-l" v-text="upload.chosen.name"></strong>&nbsp;<span class="text-muted">is uploading...</span>
                        </div>
                        <div class="pull-right">
                            <strong v-text="progress + ' %'"></strong>
                        </div>
                        <br class="clearfix">
                        <div class="loader">
                            <div class="value" :style="{'width': progress + '%'}"></div>
                        </div>
                        <br class="clearfix">
                    </div>
                </div>

            </div>
            <LoaderModal :showloader="progress === 100 && processing" message="Upload successful, please wait while we process the video..."></LoaderModal>
        </div>
    </section>
</template>

<script>
import '@/plugins/socket.io';
export default {
    name: 'UploadAd',
    data() {
        return {
            isLoading: false,
            isValid: false,
            progress: 0,
            config: {
                maxSize: 250,
                allowedExtensions: ['mp4','webm','avi', 'mpv', 'mpg', 'flv']
            },
            upload: {
                chosen: null
            },
            socket: null,
            processing: false,
            videoUrl: ''
        };
    },
    methods: {
        cancelUpload() {
            this.upload.chosen = null;
            this.$store.commit('VIDEO_BEING_UPLOADED', false);
        },
        chooseFile() {
            $('#fileUpload').click();
        },
        fileUploaded() {
            this.isValid = false;
            this.upload.chosen = this.$refs.fileUpload.files[0];
            window.URL = window.URL || window.webkitURL;
            let duration, video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                duration = video.duration;
                if (duration > this.$parent.clientAdPlan.ChannelPlan.Plan.Seconds) {
                    this.$swal('Warning', 'Video duration exceeds ' + this.$parent.clientAdPlan.ChannelPlan.Plan.Seconds + ' seconds. Please keep it within allowed duration', 'warning');
                    return;
                }
                if (this.config.maxSize && this.upload.chosen.size > 1024 * 1024 * this.config.maxSize) {
                    this.$swal('Warning', 'File exceeds the minimum size of ' + this.config.maxSize + ' MB', 'warning');
                    return;
                }
                if (this.config.allowedExtensions && this.config.allowedExtensions.indexOf(this.upload.chosen.name.substr(this.upload.chosen.name.lastIndexOf('.') + 1)) === -1) {
                    this.$swal('Warning', 'We accept only following file types : ' + this.config.allowedExtensions.join(', '), 'warning');
                    return;
                }
                this.isValid = true;
            };
            this.videoUrl = URL.createObjectURL(this.upload.chosen);
        },

        sendSocket(chunk, counter, chunkSize) {
            this.socket.emit('UPLOAD_CHUNK', {
                data: chunk,
                sequence: counter,
                isLast: chunk.size < chunkSize,
                client: this.$parent.clientAdPlan.Client,
                clientAdPlan: this.$parent.clientAdPlan._id,
                name: this.upload.chosen.name
            });
        },
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
            this.sendSocket(chunk, counter, chunkSize);
            this.socket.on('UPLOAD_CHUNK_FINISHED', (data) => {
                this.progress = (((data * 100000) / this.upload.chosen.size) * 100).toFixed(0);
                ++counter;
                start = start + chunkSize;
                if (start - chunkSize < this.upload.chosen.size) {
                    chunk = this.upload.chosen.slice(start, start + chunkSize);
                    this.sendSocket(chunk, counter, chunkSize);
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
                },1000);
            });
        },
        uploadVideo() {
            this.$swal({
                title: 'Are you sure?',
                text: 'Video will be uploaded and submitted for review.',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                closeOnConfirm: false
            }).then(isConfirm => {
                if(isConfirm.value) {
                    this.uploadFile();
                }
            });
        }
    }
};
</script>

<style scoped lang="scss">
    .upload-wrapper{
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
            .hidden {
                display: none;
            }
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
                .button-text{
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
            video {
                width: 100%;
                border-radius: 8px;
            }
            .action {
                button {
                    min-width: 240px;
                }
            }
        }
        .upload-progress {
            background: $white;
            box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 64px;
            text-align: center;
            .details {
                margin-top: 32px;
                border: 1px solid $lighter-grey;
                border-radius: 5px;
                padding: 8px 16px;
                .loader {
                    height: 10px;
                    width: 100%;
                    background-color: $lighter-grey;
                    position:relative;
                    border-radius: 6px;
                    .value {
                        height: inherit;
                        position: absolute;
                        left: 0;
                        background-color: $brand-primary;
                    }
                }
            }
        }
    }
    @media(max-width: 767px) {
        .upload-wrapper {
            margin: 0 !important;
            padding: 16px !important;
            .upload-box {
                padding: 32px 16px;
            }
            .video-wrapper {
                .action {
                    button {
                        min-width: 120px;
                    }
                }
            }
        }
    }
    /* iPhone x Landscape */
    @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
        .upload-wrapper {
            margin: 0 !important;
            padding: 40px !important;
        }
    }
    /* iPad Portrait */
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        .upload-wrapper {
            margin: 0 !important;
            padding: 40px !important;
        }
    }
    /* iPad Landscape */
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
        .upload-wrapper {
            margin: 0 !important;
            padding: 64px !important;
        }
    }
</style>
