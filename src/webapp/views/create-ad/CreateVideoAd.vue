<template>
    <div class="create-video container-fluid">
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
                        <div class="media-item mb16" v-for="r in filterredResources" :key="r._id">
                            <div v-if="r.Type == 'IMAGE'" class="image" :style="{'background-image':'url(' + getResourceUrl(r) + ')'}" @click="selectMedia(r)">
                                <div v-if="selectedImages.find(f => f === r._id)" class="selectedMedia"><i class="material-icons">check</i></div>
                            </div>
                            <div v-else class="image" @click="selectMedia(r)">
                                <img src="../../../assets/images/audio.png" alt="">
                                <div v-if="selectedAudio && selectedAudio === r._id" class="selectedMedia"><i class="material-icons">check</i></div>
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
        <div class="actions">
            <div class="row">
                <div class="col-sm-8">
                    <button class="btn">20 Seconds</button>
                    <button class="btn btn-success">Transition</button>
                    <button class="btn">Transition Duration</button>
                </div>
                <div class="col-sm-4">
                    <div class="right">
                        <button class="btn btn-info" @click="convertToVideo">Convert</button>
                        <button class="btn btn-success">Publish</button>
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
export default {
    name: 'CreateVideoAd',
    components: {
        ImageUpload,
        FileUpload
    },
    data() {
        return {
            activeTab: '',
            addedMedia: [],
            clientAd: undefined,
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
            data: {
                name: '',
                owner: 'Client',
                ownerid: this.$store.state.user.Owner._id
            },
            filterredResources: [],
            selectedImages: [],
            selectedAudio: undefined,
            showImageUpload: false,
            showFileUpload: false,            
            resources: [],
            videoAd: undefined
        }
    },
    methods: {
        addSelected() {
            let selectedImagesObjs = [];
            
            for(let i=0 ; i < this.filterredResources.length; i++) {
                let f = this.filterredResources[i];
                if (this.selectedImages.indexOf(f._id) > -1 || this.selectedAudio === f._id) {
                    if (f.Type === 'IMAGE') {
                        selectedImagesObjs.push(f);
                    } else {
                        this.collectedAudio = f;
                    }
                    this.filterredResources.splice(i,1);    
                }
            }
            this.collectedImages = this.collectedImages.concat(selectedImagesObjs);
        
        },
        addMedia(mediaType){
            if(mediaType == 'IMAGE') {
                this.showImageUpload = true;
            } else {
                this.showFileUpload = true;
            }
        },
        close(resource){
            this.resources.push(resource);
            this.filterMedia(resource.Type);
            if(resource.Type === 'IMAGE')
                this.showImageUpload = false;
            else
                this.showFileUpload = false
        },
        async convertToVideo() {
            let bodyObj = {
                pictures: this.collectedImages,
                audio: this.collectedAudio,
                clientAd: this.clientAdId
            }
            try {
                this.videoAd = await instance.post('api/clientad/ffmpeg/preview', bodyObj);
                this.$swal({
                    title: 'Video Converted',
                    text: 'Video  has been converted successfully',
                    type: 'success',
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
        // deleteMedia(item) {
        //     try {
        //         this.$swal({
        //             title: 'Are you sure?',
        //             text: 'Item will be deleted permanently',
        //             type: 'warning',
        //             showCancelButton: true,
        //             confirmButtonColor: '#F65374',
        //             confirmButtonText: 'Confirm',
        //             closeOnConfirm: false
        //         }).then(async () => {
        //             let result = await instance.delete('api/clientresource/image?id=' + item._id);
        //             this.$swal({
        //                 title: 'Deleted',
        //                 text: 'Item has been deleted',
        //                 type: 'success',
        //                 confirmButtonColor: 'ButtonColor'
        //             });
        //         });
        //     } catch (err) {
        //         this.$swal({
        //             title: 'Error',
        //             text: err.data && err.data.message ? err.data.message: 'Some error occurred',
        //             type: 'error'
        //         });
        //     }
        // },
        filterMedia(media) {
            let collectedImageIds =[]; 
            this.collectedImages.map(item => collectedImageIds.push(item._id));
            this.filterredResources = this.resources.filter(f =>{
                return f.Type === media && this.selectedImages.indexOf(f._id) === -1 && this.selectedAudio !== f._id && collectedImageIds.indexOf(f._id) === -1 && this.collectedAudio._id !== f._id
            });
            this.activeTab = media;
        },
        getResourceUrl(resource) {
            if(resource.ResourceUrl) {
                return this.GOOGLE_BUCKET_ENDPOINT + resource.ResourceUrl;
            }
            return undefined;
        },
        getPreviewUrl(resource) {
            if(resource.PreviewUrl) {
                return 'http://localhost:8080/' + resource.PreviewUrl;
            }
            return undefined;
        },
        removeItem(media) {
            if(media.Type === 'IMAGE') {
                let i = this.collectedImages.findIndex(f => f._id == media._id);
                this.collectedImages.splice(i,1);
                this.filterredResources.push(media);
            } else {
                this.collectedAudio = undefined;
                this.filterredResources.push(media);
            }

        },
        selectMedia(media) {
            if(media.Type === 'IMAGE') {
                let index = this.selectedImages.findIndex(f => f === media._id);
                if (index === -1)
                    this.selectedImages.push(media._id);
                else
                    this.selectedImages.splice(index,1);
            } else {
                if(this.selectedAudio && this.selectedAudio === media._id) {
                    this.selectedAudio = undefined;
                } else {
                    this.selectedAudio = media._id;
                }
            }
        }
    },
    async created() {
        try {
            let result = await instance.get('api/clientresource/all?id=' + this.$store.state.user.Owner._id);
            this.resources = result.data;
            // this.filterMedia('IMAGE');
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
            this.filterMedia('IMAGE');
        } catch (err) {
            throw err;
            this.$swal({
                title: 'Error',
                text: err.data && err.data.message ? err.data.message: 'Some error occurred',
                type: 'error'
            });
        }
    },
    computed: {
        isSelected() {
            if(this.selectedImages.length > 0 && this.activeTab === 'IMAGE')
                return true;
            else if(this.selectedAudio && this.activeTab === 'AUDIO')
                return true;

            return false
        }
    },
    
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
                    padding: 16px 0;
                }
                
            }
            .preview {
                background-color: #f4f4f4;
                .stretch-height();
                padding: 16px;
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
