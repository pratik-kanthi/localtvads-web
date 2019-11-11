<template>
    <div class="p32">
        <p>Choose the images and videos to be included. You can add a new image/video as well. Kindly select at least 1
            item.</p>
        <button class="btn btn-primary" :disabled="isNotProceedable" @click="updateResources">Finish & Submit</button>
        <p class="bold t-l mt16">Total <span class="brand-primary">{{ imagesSelected.length }}</span> image(s) and <span class="brand-primary">{{ videosSelected.length }}</span> video(s) selected.</p>
        <div class="mt16">
            <div class="toggle" :class="{'toggle-inactive': !textToggle}">
                <h3 class="section-title-2 white mb0">Text
                    <i class="material-icons" @click="toggleText">{{ textToggle ? 'keyboard_arrow_up':
                        'keyboard_arrow_down' }}</i>
                </h3>
            </div>
            <div class="toggle-pane" v-show="textToggle">
                <div class="form-group">
                    <label for="" class="control-label"></label>
                    <textarea class="form-control" v-model="text"></textarea>
                </div>
            </div>
        </div>
        <div class="mt32">
            <div class="toggle" :class="{'toggle-inactive': !imageToggle}">
                <h3 class="section-title-2 white mb0">Images ({{ images.length }})
                    <i class="material-icons" @click="toggleImage">{{ imageToggle ? 'keyboard_arrow_up':
                        'keyboard_arrow_down' }}</i>
                </h3>
            </div>
            <div class="toggle-pane" v-show="imageToggle">
                <p v-if="images.length === 0">There are no images uploaded.</p>
                <button class="btn btn-secondary mb16" @click="addImage">Add Image</button>
                <ImageUpload v-if="showUploadImageModal" @cancel="cancelImageUploadModal" @close="closeImageUploadModal" :show="true" :config="{...config, api: 'api/clientresource/image'}" :data="{ownerid: getUser().Owner._id}"></ImageUpload>
                <div class="row">
                    <div class="col-sm-4" v-for="(img, key) in images" :key="key">
                        <div class="image" :style="{'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + img.ResourceUrl + ')'}" @click="selectImage(img)">
                            <div :class="{'overlay': imagesSelected.indexOf(img._id) > -1}"></div>
                            <input :id="img._id" type="checkbox" class="check" v-model="imagesSelected" :value="img._id" :disabled="true" />
                            <label :for="img._id" class="check-label box mb8 mr8">
                                <span></span>
                            </label>
                        </div>
                        <p class="mt8 t-l" v-text="img.Name"></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt32">
            <div class="toggle" :class="{'toggle-inactive': !videoToggle}">
                <h3 class="section-title-2 white mb0">Videos ({{ videos.length }})
                    <i class="material-icons" @click="toggleVideo">{{ videoToggle ? 'keyboard_arrow_up':
                        'keyboard_arrow_down' }}</i>
                </h3>
            </div>
            <div class="toggle-pane" v-show="videoToggle">
                <p v-if="videos.length === 0 && !progress">There are no videos uploaded.</p>
                <input id="fileUpload" class="hidden" type="file" @change="fileUploaded" accept="video/mp4,video/x-m4v,video/*" ref="fileUpload" />
                <button class="btn btn-secondary mb8" @click="chooseFile" :disabled="isLoading" v-if="!upload.chosen">
                    Add Video
                </button>
                <div class="video-wrapper" v-if="progress === 0 && upload.chosen">
                    <div class="mb8">
                        <button class="btn btn-primary mr16" @click="uploadVideo">Upload</button>
                        <button class="btn btn-secondary m-xs0" @click="cancelUpload">Cancel</button>
                    </div>
                    <div class="row mt16">
                        <div class="col-sm-6">
                            <video controls class="mb24" height="400">
                                <source :src="videoUrl" type="video/mp4">
                            </video>
                        </div>
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
                <div class="row mt16">
                    <div class="col-sm-4" v-for="(video, key) in videos" :key="key">
                        <div class="video black-bg" style="height: 300px">
                            <video :id="video._id" width="100%" height="100%" preload="metadata" @loadedmetadata="forwardVideo(video._id)">
                                <source :src="getVideoUrl(video)" type="video/webm">
                            </video>
                            <img src="@/assets/images/play.png" alt="play">
                            <input :id="video._id" type="checkbox" class="check" v-model="videosSelected" :value="video._id" />
                            <label :for="video._id" class="check-label box mb8 mr8" @click="selectVideo(video)">
                                <span></span>
                            </label>
                        </div>
                        <p class="mt8 t-l" v-text="video.Name"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/plugins/socket.io';
import instance from '@/api';
import { uploadMixin } from '@/mixins/upload';
import ImageUpload from '@/e9_components/components/ImageUpload';
import { mapGetters } from 'vuex';
import Review from './Review';

export default {
    name: 'SelectMedia',
    components: {
        ImageUpload
    },
    mixins: [uploadMixin],
    data() {
        return {
            clientServiceAddOn: '',
            images: [],
            imagesSelected: [],
            imageToggle: false,
            showUploadImageModal: false,
            textToggle: true,
            text: '',
            videos: [],
            videosSelected: [],
            videoToggle: false
        };
    },
    methods: {
        addImage() {
            this.showUploadImageModal = true;
        },
        cancelImageUploadModal() {
            this.showUploadImageModal = false;
        },
        closeImageUploadModal(data) {
            this.showUploadImageModal = false;
            this.images.push(data);
            this.imagesSelected.push(data._id);
        },
        forwardVideo(id) {
            let elem = document.getElementById(id);
            elem.currentTime = 2;
        },
        async getAllMedia() {
            this.$parent.isLoading = true;
            return new Promise(async (resolve, reject) => {
                try {
                    let result = await instance.get('api/clientresource/all?id=' + this.getUser().Owner._id);
                    this.images = [];
                    this.videos = [];
                    result.data.forEach(resource => {
                        if (resource.Type === 'IMAGE')
                            this.images.push(resource);
                        else if (resource.Type === 'VIDEO') {
                            this.videos.push(resource);
                        }
                    });
                    this.$parent.isLoading = false;
                    resolve();
                } catch (err) {
                    this.$parent.isLoading = false;
                    this.$swal({
                        title: 'Error',
                        text: err.data && err.data.message ? err.data.message : 'Some error occurred',
                        type: 'error'
                    });
                    reject();
                    console.error(err);
                }
            });
        },
        getVideoUrl(video) {
            return this.GOOGLE_BUCKET_ENDPOINT + video.ResourceUrl;
        },
        initialiseResources() {
            this.videosSelected = this.$parent.clientServiceAddOn.Videos.map(v => v);
            this.imagesSelected = this.$parent.clientServiceAddOn.Images.map(i => i);
            this.text = this.$parent.clientServiceAddOn.Text;
        },
        selectImage(img) {
            let index = this.imagesSelected.indexOf(img._id);
            if (index > -1)
                this.imagesSelected.splice(index, 1);
            else
                this.imagesSelected.push(img._id);
        },
        selectVideo(img) {
            let index = this.videosSelected.indexOf(img._id);
            if (index > -1)
                this.videosSelected.splice(index, 1);
            else
                this.videosSelected.push(img._id);
        },
        toggleText() {
            this.textToggle = !this.textToggle;
        },
        toggleImage() {
            this.imageToggle = !this.imageToggle;
        },
        toggleVideo() {
            this.videoToggle = !this.videoToggle;
        },
        updateResources() {
            this.$swal({
                title: 'Are you sure?',
                text: 'Images and Videos will be sent to the content specialist team',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                closeOnConfirm: false
            }).then(async (isConfirm) => {
                if (isConfirm.value) {
                    this.$parent.isLoading = true;
                    try {
                        await instance.put('api/serviceaddons/update', {
                            serviceaddon: this.$route.query.clientaddon,
                            images: this.imagesSelected,
                            videos: this.videosSelected,
                            text: this.text
                        });
                        this.$parent.isLoading = false;
                        this.$swal({
                            title: 'Sent',
                            text: 'Your request has been sent to the specialist team',
                            type: 'success'
                        }).then(() => {
                            this.$parent.currentStage = Review;
                        });
                    } catch (err) {
                        this.$parent.isLoading = false;
                        this.$swal({
                            title: 'Error',
                            text: err.data && err.data.message ? err.data.message : 'Some error occurred',
                            type: 'error'
                        });
                        console.error(err);
                    }
                }
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
            this.sendSocket(chunk, counter, chunkSize, this.$parent.clientServiceAddOn, 'UPLOAD_RESOURCE_CHUNK');
            this.socket.on('UPLOAD_CHUNK_FINISHED', (data) => {
                this.progress = (((data * 100000) / this.upload.chosen.size) * 100).toFixed(0);
                ++counter;
                start = start + chunkSize;
                if (start - chunkSize < this.upload.chosen.size) {
                    chunk = this.upload.chosen.slice(start, start + chunkSize);
                    this.sendSocket(chunk, counter, chunkSize, this.$parent.clientServiceAddOn, 'UPLOAD_RESOURCE_CHUNK');
                }
            });

            this.socket.on('UPLOAD_FINISHED', (data) => {
                this.progress = 100;
                setTimeout(() => {
                    this.$swal({
                        title: 'Uploaded',
                        text: 'Ad has been uploaded successfully',
                        type: 'success',
                        confirmButtonColor: '#ff6500'
                    });
                    this.progress = 0;
                    this.isLoading = false;
                    this.upload.chosen = null;
                    this.videosSelected.push(data);
                    this.socket.disconnect();
                    this.getAllMedia();
                }, 1000);
            });
            this.socket.on('UPLOAD_ERROR', () => {
                this.$swal({
                    title: 'Error',
                    text: 'There was an error while uploading the video',
                    type: 'error'
                });
                this.socket.disconnect();
                this.isLoading = false;
            });
        },
        ...mapGetters(['getUser'])
    },
    computed: {
        isNotProceedable() {
            return this.imagesSelected.length + this.videosSelected.length < 1;
        }
    },
    created() {
        if (!this.$route.query.clientaddon) {
            this.$router.push('/', () => { });
        } else {
            this.getAllMedia().then(() => {
                this.initialiseResources();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
    .toggle {
        background-color: $brand-primary;
        padding: 12px 12px 12px 24px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;

        &-inactive {
            border-radius: 6px;
        }

        i {
            font-size: 24px;
            float: right;
            margin-right: 16px;
            position: relative;
            top: 4px;
            cursor: pointer;
        }
    }

    .toggle-pane {
        border: 3px solid $lighter-grey;
        padding: 24px;
        border-top: none;
    }

    .image {
        height: 300px;
        background-size: cover;
        border-radius: 6px;
        cursor: pointer;
        position: relative;

        .overlay {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            background-color: rgba(256, 256, 256, 0.5);
        }

        &:hover {
            box-shadow: 0 0 8px 0 rgba(104, 104, 104, 0.98);
        }

        .check-label {
            position: absolute;
            bottom: 8px;
            right: 4px;
        }

        .check:disabled+label {
            opacity: 1 !important;
        }
    }

    .video {
        position: relative;
        left: 0;

        video {
            border-radius: 6px;
        }

        img {
            position: absolute;
            height: 40px;
            width: 40px;
            margin: auto auto;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }

        .check-label {
            position: absolute;
            bottom: 16px;
            right: 4px;
        }

        .check:disabled+label {
            opacity: 1 !important;
        }
    }
</style>