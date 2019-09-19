<template>
    <div class="create-video container-fluid">
        <LoaderModal :showloader="loading" message="Preparing your video..."></LoaderModal>
        <div class="resource-wrapper">
            <div class="row">
                <div class="col-sm-2">
                    <div class="media-type">
                        <button class="btn btn-full" :class="{'btn-primary' : activeTab === 'IMAGE'}" @click="filterMedia('IMAGE')">Pictures</button>
                        <button class="btn btn-full" :class="{'btn-primary' : activeTab === 'AUDIO'}" @click="filterMedia('AUDIO')">Audio</button>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="media-resources">
                        <div class="media-item mb16" v-for="r in filteredResources" :key="r._id">
                            <div v-if="r.Type === 'IMAGE'" class="image" :style="{'background-image':'url(' + getResourceUrl(r) + ')'}" @click="selectMedia(r)">
                                <div v-if="selectedImageIds.find(f => f === r._id)" class="selectedMedia"><i class="material-icons">check</i></div>
                            </div>
                            <div v-else class="image" @click="selectMedia(r)">
                                <img src="../../../assets/images/audio.png" alt="">
                                <div v-if="selectedAudioId && selectedAudioId === r._id" class="selectedMedia"><i class="material-icons">check</i></div>
                            </div>
                            <!-- <small v-text="r.Name"></small> -->
                        </div>
                        <div class="add-media-item" @click="addMedia(activeTab)">
                            <img src="../../../assets/images/add.png" alt="">
                        </div>
                        <div class="media-actions">
                            <button class="btn btn-success" @click="addSelected" :disabled="!isSelected">Add Selected</button>
                        </div>
                        <div v-if="showImageUpload">
                            <ImageUpload :config="configPictures" :show="showImageUpload" :data="data" @close="close"></ImageUpload>
                        </div>
                        <div v-if="showFileUpload">
                            <FileUpload :config="configAudio" :show="showFileUpload" :data="data" @close="close"></FileUpload>
                        </div>

                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="preview">
                        <video controls v-if="clientAd">
                            <source :src="getPreviewUrl(clientAd)" type="video/mp4">
                        </video>
                    </div>
                </div>
            </div>
        </div>
        <div class="video-editor">
            <div class="collected-media-items" v-for="ci in collectedImages" :key="ci._id">
                <div class="image mb16" :style="{'background-image':'url(' + getResourceUrl(ci) + ')'}"></div>
                <a class="remove" @click="removeItem(ci)"><i class="material-icons">close</i></a>
                <div class="addImageOptions">
                    <div class="form-group">
                        <label for=""></label>
                        <input type="number" class="form-control" placeholder="Time" min="1" max="20" v-model="ci.Time">
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Caption" v-model="ci.Caption">
                    </div>
                </div>
            </div>
            <!-- <div class="collected-audio-items" v-if="collectedAudio">
                <div class="image">
                    <img src="../../../assets/images/audio.png" alt="">
                </div>
            </div> -->
        </div>
        <p class="text-muted mb8">Sum of duration of images must be equal to {{clientAdPlan.Seconds}} seconds</p>
        <div class="actions">
            <div class="row">
                <div class="col-sm-8">
                    <button class="btn">20 Seconds</button>
                    <button class="btn btn-success">Transition</button>
                    <button class="btn">Transition Duration</button>
                </div>
                <div class="col-sm-4">
                    <div class="right">
                        <button class="btn btn-info" @click="convertToVideo" :disabled="convertProceedable"> Convert</button>
                        <button class="btn btn-success" @click="publishVideo" :disabled="publishProceedable">Publish</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import instance from '@/api';
import ImageUpload from '@/e9_components/components/ImageUpload';
import FileUpload from '@/e9_components/components/FileUpload';
import LoaderModal from  '@/webapp/common/modals/LoaderModal.vue'
export default {
    name: 'CreateVideoAd',
    components: {
        ImageUpload,
        FileUpload,
        LoaderModal
    },
    data() {
        return {
            loading: false,
            activeTab: '',
            addedMedia: [],
            clientAd: undefined,
            clientAdPlan: {
                Seconds: 20
            },
            clientAdId: '5d5a69a86642eb128b44649c',
            configPictures: {
                api: 'api/clientresource/image',
                aspectRatio: 1.77,
                minWidth: 500,
                maxSize: 2
            },
            configAudio: {
                api: 'api/clientresource/media',
                maxSize: 5
            },
            collectedImages: [],
            collectedAudio: undefined,
            collectedImagesOriginal: [],
            collectedAudioOriginal: undefined,
            data: {
                name: '',
                owner: 'Client',
                ownerid: this.$store.state.user.Owner._id
            },
            filteredResources: [],
            selectedImageIds: [],
            selectedAudioId: undefined,
            showImageUpload: false,
            showFileUpload: false,
            resources: [],
            usedTime: 0,
            videoAd: undefined
        }
    },
    methods: {
        addMedia(mediaType){
            if(mediaType === 'IMAGE') {
                this.showImageUpload = true;
            } else {
                this.showFileUpload = true;
            }
        },
        addSelected() {
            let selectedImageIdsObjs = [];
            let splicedIds = [];
            for(let i=0 ; i < this.filteredResources.length; i++) {
                let f = this.filteredResources[i];
                if (this.selectedImageIds.indexOf(f._id) > -1 || this.selectedAudioId === f._id) {
                    if (f.Type === 'IMAGE') {
                        selectedImageIdsObjs.push(f);
                    } else {
                        this.collectedAudio = f;
                    }
                    splicedIds.push(f._id);
                }
            }
            this.filteredResources = this.filteredResources.filter(resource => splicedIds.indexOf(resource._id) === -1);
            this.collectedImages = this.collectedImages.concat(selectedImageIdsObjs);
            this.selectedImageIds = [];
            this.selectedAudioId = [];
            let nonTimedImages = [];
            let tempUsedTime = this.usedTime;
            this.collectedImages.map((item) => {
                if (!item.Time) {
                    nonTimedImages.push(item._id);
                }
            });
            this.collectedImages.map(item => {
                if (!item.Time) {
                    item.Time = (this.clientAdPlan.Seconds - this.usedTime) / (nonTimedImages.length || 1);
                    tempUsedTime += item.Time;
                }
                return item;
            });
            this.usedTime = tempUsedTime;
        },
        close(resource){
            if(resource) {
                this.resources.push(resource);
                this.filterMedia(resource.Type);
            }
            this.showImageUpload = false;
            this.showFileUpload = false

        },
        async convertToVideo() {
            this.loading = true;
            let bodyObj = {
                pictures: this.collectedImages,
                audio: this.collectedAudio,
                clientAd: this.clientAdId
            };
            try {
                this.videoAd = await instance.post('api/clientad/ffmpeg/preview', bodyObj);
                this.loading = false;
                this.collectedImagesOriginal = JSON.parse(JSON.stringify(this.collectedImages));
                this.collectedAudioOriginal = JSON.parse(JSON.stringify(this.collectedAudio));
                this.$swal({
                    title: 'Video Converted',
                    text: 'Video has been converted successfully',
                    type: 'success',
                    confirmButtonColor: '#ff6500'
                });
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error',
                    confirmButtonColor: '#ff6500'
                });
            }
        },
        filterMedia(media) {
            let collectedImageIds =[];
            this.collectedImages.map(item => collectedImageIds.push(item._id));
            this.filteredResources = this.resources.filter(f =>{
                return f.Type === media && this.selectedImageIds.indexOf(f._id) === -1 && this.selectedAudioId !== f._id && collectedImageIds.indexOf(f._id) === -1 && this.collectedAudio._id !== f._id;
            });
            this.activeTab = media;
        },
        getResourceUrl(resource) {
            if(resource.ResourceUrl) {
                return this.GOOGLE_BUCKET_ENDPOINT + resource.ResourceUrl;
            }
            return undefined;
        },
        getPreviewUrl() {
            return (resource) => {
                if(resource.PreviewUrl) {
                    return this.ENDPOINT + resource.PreviewUrl;
                }
                return undefined;
            };
        },
        async publishVideo() {
            let bodyObj = {
                clientAd: this.clientAdId
            };
            try {
                this.videoAd = await instance.post('api/clientad/ffmpeg/save', bodyObj);
                this.$swal({
                    title: 'Sent for Review',
                    text: 'Video has been sent successfully for review. Our Administrator team will review it within next 24 hours and get back to you with a confirmation',
                    type: 'success'
                });
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error',
                    confirmButtonColor: 'ButtonColor'
                });
            }
        },
        removeItem(media) {
            if(media.Type === 'IMAGE') {
                let i = this.collectedImages.findIndex(f => f._id === media._id);
                this.collectedImages.splice(i,1);
                this.filteredResources.push(media);
                this.usedTime -= f.Time;
            } else {
                this.collectedAudio = undefined;
                this.filteredResources.push(media);
            }
        },
        selectMedia(media) {
            if(media.Type === 'IMAGE') {
                let index = this.selectedImageIds.findIndex(f => f === media._id);
                if (index === -1)
                    this.selectedImageIds.push(media._id);
                else
                    this.selectedImageIds.splice(index,1);
            } else {
                if(this.selectedAudioId && this.selectedAudioId === media._id) {
                    this.selectedAudioId = undefined;
                } else {
                    this.selectedAudioId = media._id;
                }
            }
        }
    },
    async created() {
        try {
            let result = await instance.get('api/clientresource/all?id=' + this.$store.state.user.Owner._id);
            this.resources = result.data;
            this.activeTab = 'IMAGE';
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err.data && err.data.message ? err.data.message: 'Some error occurred',
                type: 'error'
            });
        }
        try {
            let result = await instance.get('api/clientad/getone?clientad=' + this.clientAdId);
            this.clientAd = result.data;
            this.collectedImages = this.clientAd.Options.ImagesOptions;
            this.collectedAudio = this.clientAd.Options.AudioOptions;
            this.collectedImagesOriginal = JSON.parse(JSON.stringify(this.clientAd.Options.ImagesOptions));
            this.collectedAudioOriginal = JSON.parse(JSON.stringify(this.clientAd.Options.AudioOptions));
            this.collectedImages.map(img => {
                this.usedTime += img.Time ? parseInt(img.Time) : 0
            });
            this.filterMedia('IMAGE');
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err.data && err.data.message ? err.data.message: 'Some error occurred',
                type: 'error'
            });
            throw err;
        }
    },
    computed: {
        isSelected() {
            if(this.selectedImageIds.length > 0 && this.activeTab === 'IMAGE')
                return true;
            else if(this.selectedAudioId && this.activeTab === 'AUDIO')
                return true;

            return false
        },
        convertProceedable() {
            let nonTimedImage = this.collectedImages.find(item => {
                return !item.Name
            });
            if (nonTimedImage) {
                return true;
            }
            return this.clientAdPlan.Seconds !== this.usedTime;

        },
        publishProceedable() {
            return true;
        }
    },
    beforeRouteLeave: (to, from, next) => {
        let flag=false;
        if (this.collectedImages.length !== this.collectedImagesOriginal.length)
            flag = true;
        loop1:
        for(let i=0; i < this.collectedImages.length; i++){
            for(let key in this.collectedImages[i]) {
                if (this.collectedImages[i].hasOwnProperty(key) && this.collectedImages[i][key] === this.collectedImagesOriginal[i][key]) {

                } else {
                    flag = true;
                    break loop1;
                }
            }
        }
        if (flag) {
            this.$swal({
                title: "Are you sure?",
                text: "You have unsaved changes, do you still want to leave ? All your unsaved changes will be lost",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Confirm",
                closeOnConfirm: false
            }).then((isConfirm) => {
                if (isConfirm.value)
                    next();
                else
                    next(false);
            });
        }
        else
            next();
    }
}
</script>

<style scoped lang="less">
    .create-video {
        height: 90vh;
        .resource-wrapper {
            height: 50%;
            margin-top: 16px;
            margin-bottom: 16px;
            .media-type {
                .stretch-height();
                button {
                    margin-bottom: 16px!important;
                }
            }
            .media-resources {
                background-color: #f4f4f4;
                overflow: auto;
                .stretch-height();
                padding: 16px;
                .media-item {
                    width: 110px;
                    display: inline-block;
                    margin-right: 16px;
                    vertical-align: bottom;
                    .image {
                        width: 100%;
                        height: 110px;
                        background-size: cover;
                        position: relative;
                        cursor: pointer;
                        border-radius: 2px;
                        .delete-item {
                            position: absolute;
                            display: none;
                            top: 2px;
                            right: 2px;
                            i {
                                background: white;
                                color: red;
                                border-radius: 50%;
                                font-size: 14px;
                            }
                        }
                        .selectedMedia {
                            position: absolute;
                            bottom: 2px;
                            right: 2px;
                            line-height: 14px;
                            i {
                                color: white;
                                background-color: @green;
                                border-radius: 50%;
                                font-size: 14px;
                            }
                        }
                        &:hover {
                            .delete-item {
                                display: block;
                            }
                        }
                    }
                }
                .add-media-item {
                    width: 110px;
                    display: inline-block;
                    margin-right: 16px;
                    cursor: pointer;
                    img {
                        vertical-align: baseline;
                        margin-bottom: 16px;
                    }
                }
                .media-actions {
                    position: absolute;
                    bottom: 0;
                    left: 16px;
                    padding: 16px;
                    background: #e4e4e4;
                    width: calc(~'100% - 32px');
                }

            }
            .preview {
                background-color: #f4f4f4;
                .stretch-height();
                padding: 64px 0;
                video {
                    &:focus {
                        outline: none;
                    }
                }
            }
        }
        .video-editor {
            height: 38%;
            background-color: #f4f4f4;
            padding: 16px;
            margin-bottom: 16px;
            .collected-media-items {
                width: 110px;
                display: inline-block;
                margin-right: 16px;
                position: relative;
                .form-control {
                    height: 28px;
                    background: #FFF;
                }
                .image {
                    width: 100%;
                    height: 110px;
                    background-size: cover;
                    position: relative;
                    cursor: pointer;
                    border-radius: 2px;
                }
                .remove {
                    position: absolute;
                    display: none;
                    top: 2px;
                    right: 2px;
                    i {
                        background: white;
                        color: red;
                        border-radius: 50%;
                        font-size: 14px;
                    }
                }
                &:hover {
                    .remove {
                        display: block;
                    }
                }
            }
            .collected-audio-items {
                width: 80px;
            }
        }
    }
</style>
