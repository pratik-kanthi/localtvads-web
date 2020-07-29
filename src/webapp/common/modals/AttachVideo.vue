<template>
    <b-modal size="lg" v-model="show" title="Attach video to your ad" centered hide-footer no-close-on-esc no-close-on-backdrop>
        <div class="video-strip row">
            <div class="video col-md-4" v-for="(video, key) in clientVideos" :key="key">
                <video @click="selectVideo(video)" class="video pointer" :id="video._id" :src="GOOGLE_BUCKET_ENDPOINT + video.ResourceUrl" width="100%" height="100%" @loadedmetadata="forwardVideo(video._id)"></video>
            </div>
        </div>
        <div class="video-player"></div>
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
        }
    },
    created() {
        this.getClientVideos();
    }
};
</script>

<style lang="scss">
video {
    width: 400px;
    border-radius: 5px;
}
</style>
