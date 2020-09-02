<template>
    <b-modal size="xl" hide-footer v-model="show">
        <div slot="modal-header">
            <strong>Attach assets to your add-on</strong>
            <button class="close float-right" type="button" @click="close">
                <i class="material-icons">close</i>
            </button>
        </div>
        <div class="t-l d-flex flex-column flex-md-row justify-content-between">
            <div>Select assets to attach to your ad</div>
            <div>{{ selectedImages.length + selectedVideos.length }} asset(s) selected</div>
        </div>
        <div class="t-xl black mt24">Images</div>
        <div class="row">
            <div class="col-sm-4 mt24" v-for="(img, key) in clientImages" :key="key">
                <div class="image" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + img.ResourceUrl + ')' }" @click="selectImage(key)">
                    <input :id="img._id" type="checkbox" class="check" v-model="img.selected" :value="img._id" :disabled="true" />
                    <label :for="img._id" class="check-label box mb8 mr8">
                        <span></span>
                    </label>
                </div>
            </div>
            <div class="col light-grey" v-if="!clientImages || clientImages.length == 0">No images uploaded. You can upload images from "My Assets" section.</div>
        </div>

        <div class="t-xl black mt24">Videos</div>
        <div class="row mt16">
            <div class="col-sm-4" v-for="(video, key) in clientVideos" :key="key">
                <div class="video">
                    <video :id="video._id" width="100%" height="100%" preload="metadata" @loadedmetadata="forwardVideo(video._id)">
                        <source :src="GOOGLE_BUCKET_ENDPOINT + video.ResourceUrl" type="video/webm" />
                    </video>
                    <input :id="video._id" type="checkbox" class="check" v-model="video.selected" :value="video._id" />
                    <label :for="video._id" class="check-label box mb8 mr8" @click="selectVideo(key)">
                        <span></span>
                    </label>
                </div>
            </div>
            <div class="col light-grey" v-if="!clientVideos || clientVideos.length == 0">No videos uploaded. You can upload videos from "My Assets" section.</div>
        </div>

        <div class="t-xl black mt24">Documents</div>
        <div class="row mt16 mb16">
            <div class="col-sm-3 mt8" v-for="(document, key) in clientDocuments" :key="key">
                <div class="document">
                    <div class="border p24 d-flex justify-content-start align-items-center">
                        <div><i class="material-icons t-xxl">insert_drive_file</i></div>
                        <div class="t-l ml16 black">{{ document.ResourceName }}</div>
                    </div>
                    <input :id="document._id" type="checkbox" class="check" v-model="document.selected" :value="document._id" />
                    <label :for="document._id" class="check-label box mb8 mr8" @click="selectDocuments(key)">
                        <span></span>
                    </label>
                </div>
            </div>
            <div class="col light-grey" v-if="!clientDocuments || clientDocuments.length == 0">No documents uploaded. You can upload documents from "My Assets" section.</div>
        </div>
        <div class="footer">
            <button class="btn btn-secondary-small" @click="close">Cancel</button>
            <button @click="attachImages" class="btn btn-primary-small ml16 float-right">Confirm</button>
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
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            //flags

            selectedImages: [],
            selectedVideos: [],
            selectedDocuments: [],

            //data
            clientImages: [],
            clientVideos: [],
            clientDocuments: []
        };
    },
    methods: {
        attachImages() {
            this.$emit('done', [...this.selectedImages, ...this.selectedVideos, ...this.selectedDocuments]);
        },
        close() {
            this.$emit('closed');
        },
        forwardVideo(id) {
            let elem = document.getElementById(id);
            elem.currentTime = 2;
        },
        async getClientAssets() {
            try {
                let result = await ResourceService.getResources();
                let usedAssets = this.planAssets.map(asset => {
                    return asset._id;
                });

                result = result.filter(asset => {
                    return usedAssets.indexOf(asset._id) == -1;
                });

                result.map(resource => {
                    resource.selected = false;
                    if (resource.ResourceType == 'IMAGE') {
                        this.clientImages.push(resource);
                    } else if (resource.ResourceType == 'VIDEO') {
                        this.clientVideos.push(resource);
                    } else {
                        this.clientDocuments.push(resource);
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
        selectImage(index) {
            let images = { ...this.clientImages };
            images[index].selected = !images[index].selected;
            this.clientImages = { ...images };
            this.selectedImages.push(images[index]._id);
        },
        selectVideo(index) {
            let videos = { ...this.clientVideos };
            videos[index].selected = !videos[index].selected;
            this.clientVideos = { ...videos };
            this.selectedVideos.push(videos[index]._id);
        },
        selectDocuments(index) {
            let documents = { ...this.clientDocuments };
            documents[index].selected = !documents[index].selected;
            this.clientDocuments = { ...documents };
            this.selectedDocuments.push(documents[index]._id);
        }
    },
    created() {
        this.getClientAssets();
    }
};
</script>

<style lang="scss" scoped>
.document {
    .check-label {
        position: absolute;
        bottom: 8px;
        right: 18px;
    }

    .check:disabled + label {
        opacity: 1 !important;
    }
}
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
