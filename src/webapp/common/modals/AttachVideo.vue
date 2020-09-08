<template>
    <b-modal size="xl" v-model="show" centered hide-footer no-close-on-esc no-close-on-backdrop>
        <div slot="modal-header">
            <strong>Attach video to your ad</strong>
            <button class="close float-right" type="button" @click="close">
                <i class="material-icons">close</i>
            </button>
        </div>
        <div v-if="clientVideos && clientVideos.length > 0">
            <div class="row">
                <div class="col">
                    <div class="t-l light-grey">Select a video to attach to your ad</div>
                </div>
            </div>
            <div class="row">
                <div class="video col-md-4" v-for="(video, key) in clientVideos" :key="key">
                    <video @click="selectVideo(video)" class="pointer" :id="video._id" :src="GOOGLE_BUCKET_ENDPOINT + video.ResourceUrl" width="100%" height="100%" @loadedmetadata="forwardVideo(video._id)"></video>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="col light-grey">No videos uploaded. You can upload videos from "My Assets" section.</div>
        </div>
    </b-modal>
</template>

<script>
import ResourceService from '@/services/ResourceService';

export default {
    name: 'AttachVideo',
    data() {
        return {
            //flags
            selectedVideo: {},
            show: true,

            //data
            clientVideos: []
        };
    },
    methods: {
        forwardVideo(id) {
            let elem = document.getElementById(id);
            elem.currentTime = 2;
        },
        async getClientVideos() {
            try {
                let result = await ResourceService.getResources();
                result.map(resource => {
                    if (resource.ResourceType == 'VIDEO') {
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
        selectVideo(video) {
            this.$emit('videoselected', video);
        },
        close() {
            this.$emit('close');
        }
    },
    created() {
        this.getClientVideos();
    }
};
</script>

<style lang="scss" scoped>
.video {
    video {
        width: 100%;
        border-radius: 5px;
    }
}
</style>
