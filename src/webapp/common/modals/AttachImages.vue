<template>
    <b-modal size="xl" v-model="show" title="Attach assets to your add-on" hide-footer centered no-close-on-esc no-close-on-backdrop>
        <div class="t-l d-flex justify-content-between">
            <div>Select assets to attach to your ad</div>
            <div>{{ selectedImages.length + selectedVideos.length }} assets(s) selected</div>
        </div>
        <div class="t-xl black mt24">Images</div>
        <div class="row">
            <div class="col-sm-4 mt24" v-for="(img, key) in clientImages" :key="key">
                <div class="image" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + img.ResourceUrl + ')' }" @click="selectImage(img)">
                    <input :id="img._id" type="checkbox" class="check" v-model="selectedImages" :value="img._id" :disabled="true" />
                    <label :for="img._id" class="check-label box mb8 mr8">
                        <span></span>
                    </label>
                </div>
            </div>
        </div>

        <div class="t-xl black mt24">Videos</div>
        <div class="row mt16">
            <div class="col-sm-4" v-for="(video, key) in clientVideos" :key="key">
                <div class="video">
                    <video :id="video._id" width="100%" height="100%" preload="metadata" @loadedmetadata="forwardVideo(video._id)">
                        <source :src="GOOGLE_BUCKET_ENDPOINT + video.ResourceUrl" type="video/webm" />
                    </video>
                    <input :id="video._id" type="checkbox" class="check" v-model="selectedVideos" :value="video._id" />
                    <label :for="video._id" class="check-label box mb8 mr8" @click="selectVideo(video)">
                        <span></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="footer d-flex justify-content-end">
            <button class="btn btn-secondary-small">Cancel</button>
            <button @click="attachImages" class="btn btn-primary-small ml16">Confirm</button>
        </div>
    </b-modal>
</template>

<script>
import ResourceService from '@/services/ResourceService';

export default {
    name: 'AttachImages',
    props: {
        planAssets: {
            type: Array
        }
    },
    data() {
        return {
            //flags
            show: true,
            selectedImages: [],
            selectedVideos: [],

            //data
            clientImages: [],
            clientVideos: []
        };
    },
    methods: {
        attachImages() {
            this.$emit('done', [...this.selectedImages, ...this.selectedVideos]);
        },
        async getClientAssets() {
            try {
                let result = await ResourceService.getResources();
                result.map(resource => {
                    if (resource.ResourceType == 'IMAGE') {
                        this.clientImages.push(resource);
                    } else if (resource.ResourceType == 'VIDEO') {
                        this.clientVideos.push(resource);
                    }
                });
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        forwardVideo(id) {
            let elem = document.getElementById(id);
            elem.currentTime = 2;
        },
        selectImage(img) {
            let index = this.selectedImages.indexOf(img._id);
            if (index > -1) this.selectedImages.splice(index, 1);
            else this.selectedImages.push(img._id);
        },
        selectVideo(img) {
            let index = this.selectedVideos.indexOf(img._id);
            if (index > -1) this.selectedVideos.splice(index, 1);
            else this.selectedVideos.push(img._id);
        }
    },
    created() {
        this.getClientAssets();
    }
};
</script>

<style lang="scss" scoped>
.image {
    height: 184px;
    background-size: cover;
    border-radius: 6px;
    cursor: pointer;
    position: relative;

    .check-label {
        position: absolute;
        bottom: 8px;
        right: 4px;
    }

    .check:disabled + label {
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

    .check:disabled + label {
        opacity: 1 !important;
    }
}
</style>
