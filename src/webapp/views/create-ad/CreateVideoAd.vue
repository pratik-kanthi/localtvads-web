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
                        <div class="media-item mb16" v-for="r in filterredResources" :key="r._id" @click="selectMedia(r)">
                            <img v-if="r.Type == 'IMAGE'" :src="getResourceUrl(r)" :alt="r.Name">
                            <div v-else><a :href="r.ResourceUrl" target="_blank"><img src="../../../assets/images/audio.png" alt=""></a></div>
                            <small v-text="r.Name"></small>
                        </div>
                        <div class="add-media-item" @click="uploadMedia()">
                            <img src="../../../assets/images/add.png" alt="">
                        </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="preview">
                            player
                        </div>
                </div>
            </div>
        </div>
        <div class="video-editor">
            Edit video
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
                        <button class="btn btn-info">Convert</button>
                        <button class="btn btn-success">Publish</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import instance from '@/api';
import { close } from 'fs';
import { release } from 'os';
export default {
    name: 'CreateVideoAd',
    data() {
        return {
            activeTab: '',
            addedMedia: [],
            filterredResources: [],
            selectedMedia: [],
            resources: []
        }
    },
    methods: {
        filterMedia(media) {
            this.filterredResources = this.resources.filter(f => f.Type === media);
            this.activeTab = media;
        },
        uploadMedia() {

        },
        selectMedia(media) {
            this.selectedMedia.push(media);
        },
        getResourceUrl(resource) {
            if(resource.ResourceUrl) {
                return this.GOOGLE_BUCKET_ENDPOINT + resource.ResourceUrl;
            }
            return undefined;
        }
    },
    async created() {
        try {
            let result = await instance.get('api/clientresource/all?id=' + this.$store.state.user.Owner._id);
            this.resources = result.data;
            this.filterMedia('IMAGE');
            this.activeTab = 'IMAGE';
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err.data && err.data.message ? err.data.message: 'Some error occurred',
                type: 'error'
            });
        }
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
                .stretch-height();
                padding: 16px;
                .media-item {
                    width: 110px;
                    display: inline-block;
                    margin-right: 16px;
                    // .box-shadow(0 0 4px 0 rgba(0,0,0,0.3));
                    img {
                        vertical-align: baseline;
                    }
                }
                .add-media-item {
                    width: 110px;
                    display: inline-block;
                    margin-right: 16px;
                    img {
                        vertical-align: baseline;
                    }
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
        }
    }
</style>
