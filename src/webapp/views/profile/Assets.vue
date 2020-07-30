<template>
    <div class="container">
        <ImageUpload v-if="showUploadImageModal" @cancel="cancelImageUploadModal" @close="closeImageUploadModal" :show="true" :config="config" :data="{ ownerid: getUser().Owner._id }"></ImageUpload>

        <div v-if="showVideoUploadModal">
            <VideoUpload :show="showVideoUploadModal" @done="closeVideUploadModal" @close="cancelVideUploadModal"></VideoUpload>
        </div>

        <VideoModal :show-video="showvideo" :video-url="videourl" @close="closeVideoPlayer"></VideoModal>
        <LoaderModal :showloader="isLoading"></LoaderModal>
        <div v-if="lightBoxItems.length > 0">
            <CoolLightBox :items="lightBoxItems" :index="lightboxIndex" loop @close="lightboxIndex = null"></CoolLightBox>
        </div>

        <h3 class="mt64 page-heading">Your Assets</h3>
        <div class="t-l brand-secondary mt24 light-grey">This section allows you to manage all your assets. You can use these assets in your ad videos</div>
        <div class="horizontal-tabs mt24">
            <b-tabs>
                <b-tab title="Videos">
                    <button @click="addVideo" class="btn btn-primary-small mt24">Add Video</button>
                    <div v-if="clientVideos.length == 0" class="mt24">
                        <div class="t-l">You have not uploaded any videos</div>
                    </div>
                    <div v-else class="videos-wrapper row">
                        <div class="video-container col-md-4 mt32" v-for="(video, key) in clientVideos" :key="key">
                            <video @click="openVideo(video.ResourceUrl)" class="video pointer" :id="video._id" :src="GOOGLE_BUCKET_ENDPOINT + video.ResourceUrl" width="100%" height="100%" @loadedmetadata="forwardVideo(video._id)"></video>
                        </div>
                    </div>

                    <div v-if="adminVideos.length > 0" class="mt24">
                        <div class="t-l black">LocalTV Ads management videos</div>
                        <hr />
                        <div class="videos-wrapper row">
                            <div class="video-container col-md-4 mt16" v-for="(video, key) in adminVideos" :key="key">
                                <video @click="openVideo(video.ResourceUrl)" class="video pointer" :id="video._id" :src="GOOGLE_BUCKET_ENDPOINT + video.ResourceUrl" width="100%" height="100%" @loadedmetadata="forwardVideo(video._id)"></video>
                            </div>
                        </div>
                    </div>
                </b-tab>
                <b-tab title="Images">
                    <button @click="addImage" class="btn btn-primary-small mt24">Add Image</button>
                    <div v-if="clientImages.length == 0" class="mt24">
                        <div class="t-l">LocalTV Ads management images</div>
                    </div>
                    <div v-else class="row images-wrapper mt24">
                        <div v-for="(image, key) in clientImages" :key="key" class="col-md-3 mt16 image-container">
                            <ImageAssetCard @openimage="lightboxIndex = key" :id="image._id" :image-url="image.ResourceUrl"></ImageAssetCard>
                        </div>
                    </div>
                    <div v-if="adminImages.length > 0" class="mt24">
                        <div class="t-l black">Images uploaded by LocalTV Ads management</div>
                        <hr />
                        <div class="images-wrapper row">
                            <div class="video-container col-md-4 mt16" v-for="(image, key) in adminImages" :key="key">
                                <ImageAssetCard @openimage="lightboxIndex = key" :id="image._id" :image-url="image.ResourceUrl"></ImageAssetCard>
                            </div>
                        </div>
                    </div>
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>
import '@/plugins/socket.io';
import { mapGetters } from 'vuex';
import { uploadMixin } from '@/mixins/upload';
import ImageUpload from '@/e9_components/components/ImageUpload';
import VideoUpload from '@/webapp/common/modals/VideoUploadModal';
import VideoModal from '@/webapp/common/modals/VideoModal';
import ResourceService from '@/services/ResourceService';
import ImageAssetCard from '@/webapp/common/components/ImageAssetCard';
import CoolLightBox from 'vue-cool-lightbox';
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css';

export default {
    name: 'Assets',
    components: {
        ImageUpload,
        VideoUpload,
        VideoModal,
        ImageAssetCard,
        CoolLightBox
    },
    mixins: [uploadMixin],
    data() {
        return {
            //flags
            isLoading: true,
            showUploadImageModal: false,
            showVideoUploadModal: false,
            showvideo: false,

            //data
            clientVideos: [],
            adminVideos: [],
            clientImages: [],
            adminImages: [],
            lightBoxItems: [],
            videourl: '',
            lightboxIndex: null,

            //configurations /api/:clientid/clientresource/image
            config: {
                api: `/api/${this.$store.getters.getUser.Owner._id}/clientresource/image`,
                maxSize: 5,
                aspectRatio: 1
            }
        };
    },
    methods: {
        addImage() {
            this.showUploadImageModal = true;
        },
        addVideo() {
            this.showVideoUploadModal = true;
        },
        cancelImageUploadModal() {
            this.showUploadImageModal = false;
        },
        cancelVideUploadModal() {
            this.showVideoUploadModal = false;
        },
        closeImageUploadModal(data) {
            this.showUploadImageModal = false;
            this.clientImages.push(data);
            this.lightBoxItems.push({ src: this.GOOGLE_BUCKET_ENDPOINT + data.ResourceUrl });
        },
        closeVideoPlayer() {
            this.showvideo = false;
            this.videourl = '';
        },
        closeVideUploadModal(data) {
            this.showVideoUploadModal = false;
            if (data) this.clientVideos.push(data);
        },
        forwardVideo(id) {
            let elem = document.getElementById(id);
            elem.currentTime = 2;
        },
        async getClientResouces() {
            try {
                let result = await ResourceService.getResources();
                result.map(resource => {
                    if (resource.ResourceType == 'IMAGE') {
                        if (resource.ByManagement) {
                            this.adminImages.push(resource);
                        } else {
                            this.clientImages.push(resource);
                        }
                    } else {
                        if (resource.ByManagement) {
                            this.adminVideos.push(resource);
                        } else {
                            this.clientVideos.push(resource);
                        }
                    }
                });
                this.lightBoxItems = this.clientImages.map(image => {
                    let tmp = {};
                    tmp.src = this.GOOGLE_BUCKET_ENDPOINT + image.ResourceUrl;
                    return tmp;
                });
                this.isLoading = false;
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
                this.isLoading = false;
            }
        },
        openVideo(url) {
            this.showvideo = true;
            this.videourl = this.GOOGLE_BUCKET_ENDPOINT + url;
        },
        ...mapGetters(['getUser'])
    },
    created() {
        this.getClientResouces();
    }
};
</script>

<style lang="scss" scoped>
.images-wrapper {
    .image-container {
        .image {
            border-radius: 6px;
            background-size: cover;
            background-position: center center;
        }
    }
}
.videos-wrapper {
    .video-container {
        border-radius: 6px;

        .video {
            border-radius: 6px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background-color: $black;

            video {
                height: 240px;
                object-fit: cover;
            }
        }
    }

    .action {
        @include center(both);

        .play {
            width: 56px;
        }

        .btn {
            max-width: 150px;
        }
    }
}
</style>
