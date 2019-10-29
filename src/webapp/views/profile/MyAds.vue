<template>
    <section class="myads">
        <div v-if="displayAdVideo">
            <VideoModal :show-video="displayAdVideo" :video-url="videoUrl" @close="closeVideo"></VideoModal>
        </div>
        <div class="container">
            <div class="profile-ads">
                <h3 class="section-title-2 mb24">My Ad Plans</h3>
                <div v-if="!isLoading && clientAds.length === 0">
                    <p class="lead">No ads have been added</p>
                </div>
                <div v-else>
                    <div class="row ads-wrapper" v-for="ad in clientAds" :key="ad._id">
                        <div class="col-sm-6">
                            <div class="ad-video">
                                <div class="vedio" v-if="ad.ClientAd && ad.ClientAd.VideoUrl">
                                    <video :id="ad.ClientAd._id" :src="getVideoUrl(ad.ClientAd.VideoUrl)" width="100%" height="100%" @loadedmetadata="forwardVideo(ad.ClientAd._id)"></video>
                                    <div class="action">
                                        <a @click="openVideo(ad.ClientAd.VideoUrl)"><img src="@/assets/images/play.png" alt="" class="play"></a>
                                    </div>
                                </div>
                                <div class="background-image-holder ad-bg" v-else>
                                    <div class="action">
                                        <button class="btn btn-white" @click="goToVideoUpload(ad._id)">Upload Your Ad</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="plan-details">
                                <div class="plan-info">
                                    <p class="info-label">Broadcast Location</p>
                                    <h6 class="info-desc">{{ ad.ChannelPlan.Plan.Channel.Name }}</h6>
                                </div>
                                <div class="plan-info">
                                    <p class="info-label">Broadcast Slot</p>
                                    <h6 class="info-desc">{{ ad.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.Name }} ({{ ad.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.StartTime }} to {{ ad.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.EndTime }})</h6>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="plan-info">
                                            <p class="info-label">Broadcast Start</p>
                                            <h6 class="info-desc">{{ moment(ad.StartDate, 'YYYY-MM-DD').format('Do MMMM YYYY') }}</h6>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="plan-info">
                                            <p class="info-label">Broadcast End</p>
                                            <h6 class="info-desc">{{ moment(ad.EndDate, 'YYYY-MM-DD').format('Do MMMM YYYY') }}</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="plan-info mb0">
                                            <p class="info-label">Ad Length</p>
                                            <h6 class="info-desc">{{ ad.ChannelPlan.Plan.Seconds }} sec</h6>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="plan-info mb0">
                                            <p class="info-label">Broadcast Duration</p>
                                            <h6 class="info-desc">6 months</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt40" v-if="showLoadMore">
                        <button class="btn btn-primary" @click="getClientAds" v-if="!isLoading">Load More</button>
                        <img class="loading" src="@/assets/images/loader.svg" v-if="isLoading" alt="spinner" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import instance from '@/api';
import VideoModal from '@/webapp/common/modals/VideoModal';
export default {
    name: 'MyAds',
    components: {
        VideoModal
    },
    data() {
        return {
            displayAdVideo: false,
            clientAds: [],
            videoUrl: '',
            pagination: {
                count: 5
            },
            showLoadMore: true,
            isLoading: false
        };
    },
    methods: {
        closeVideo() {
            this.displayAdVideo = false;
        },
        forwardVideo(id) {
            let elem = document.getElementById(id);
            elem.currentTime = 2;
        },
        async getClientAds() {
            try {
                this.isLoading = true;
                let result = await instance.get('api/clientad/getall?clientid=' + this.getUser().Owner._id + '&top=' + this.pagination.count + '&skip=' + this.clientAds.length);
                if (!result.data.length || result.data.length < this.pagination.count) {
                    this.showLoadMore = false;
                }
                this.clientAds = [...this.clientAds, ...result.data];
                this.isLoading = false;
            } catch (err) {
                this.isLoading = false;
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        getVideoUrl(url) {
            return this.GOOGLE_BUCKET_ENDPOINT + url;
        },
        goToVideoUpload(id) {
            this.$router.push({
                name: 'BookingFlow',
                query: {
                    clientadplan: id
                }
            });
        },
        ...mapGetters(['getUser']),
        openVideo(url) {
            this.displayAdVideo = true;
            this.videoUrl = this.GOOGLE_BUCKET_ENDPOINT + url;
        }
    },
    created() {
        this.getClientAds();
    }
};
</script>

<style lang="scss" scopped>
.myads {
    min-height: calc(100vh - 80px);
    .profile-ads {
        background-color: $white;
        padding: 40px 64px;
        border-radius: 8px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
        margin: 0 40px;
        .ads-wrapper {
            margin-bottom: 24px;

            &:last-child {
                margin-bottom: 0;
            }

            .ad-video {
                width: 100%;
                height: 240px;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                background-color: $black;
                .ad-bg {
                    background-image: url('../../../assets/images/ad-video-bg.jpg');
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

            .plan-details {
                .plan-info {
                    margin-bottom: 20px;

                    .info-label {
                        margin-bottom: 4px;
                        font-size: 12px;
                        color: #acacac;
                        font-weight: 500;
                        font-family: $font-family-heading;
                    }

                    .info-desc {
                        font-size: 14px;
                        font-weight: 500;
                        font-style: normal;
                        font-stretch: normal;
                        line-height: normal;
                        letter-spacing: normal;
                        color: #4c4c4c;
                    }
                }
            }
        }
        .loading {
            width: 100px;
        }
    }
    @media (max-width: 767px) {
        .profile-ads {
            margin: 0;
            padding: 0;
            box-shadow: none;
            .plan-details {
                margin-top: 16px;
            }
        }
    }
}
</style>
