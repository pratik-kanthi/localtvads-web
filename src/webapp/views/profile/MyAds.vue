<template>
    <section class="myads pt24">
        <div v-if="displayAdVideo">
            <VideoModal
                class="promo"
                :show-video="displayAdVideo"
                :video-url="videoUrl"
                @close="closeVideo"
            ></VideoModal>
        </div>

        <LoaderModal :showloader="isLoading" message="Please wait while we fetch the data..."></LoaderModal>
        <div class="container table-container pm-24">
            <div class="d-flex justify-content-between align-items-center">
                <h3 class="brand-secondary mt64 mb48">My Ad Plans</h3>
                <div></div>
            </div>

            <div v-if="!isLoading && clientAds.length === 0">
                <p class="lead">You haven't purchased any ad plans</p>
            </div>
            <div v-else-if="clientAds.length > 0">
                <div class="table-wrapper d-none d-md-block">
                    <Table
                        :items="clientAds"
                        :headings="fields"
                        :pagination="pagination"
                        :sort.sync="sort"
                        table-class="table-responsive-xs table-responsive-stable-responsive-md"
                    >
                        <template v-slot:Name="data">
                            <div>{{ data.value.Name }}</div>
                        </template>
                        <template v-slot:Status="data">
                            <div class="t-s brand-secondary d-flex align-items-center">
                                <i class="material-icons">public</i>
                                <span class="pl8">Active</span>
                            </div>
                        </template>
                        <template v-slot:Channel="data">
                            <div>{{ data.value.ChannelPlan.Plan.Channel.Name }}</div>
                        </template>

                        <template v-slot:Schedule="data">
                            <div>
                                {{ data.value.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.Name }}
                                <div
                                    class="t-s"
                                >{{ data.value.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.StartTime }} - {{ data.value.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.EndTime }}</div>
                            </div>
                        </template>
                        <template v-slot:PlanDuration="data">
                            <div>6 months</div>
                            <div
                                class="t-s"
                            >{{ data.value.StartDate | formatDate('DD MMM YYYY') }} to {{ data.value.EndDate | formatDate('DD MMM YYYY') }}</div>
                        </template>
                        <template v-slot:Action="data">
                            <div v-if="data.value.ClientAd">
                                <button
                                    @click="openVideo(data.value.ClientAd.VideoUrl)"
                                    class="t-s btn btn-sm btn-link pl0 pr0"
                                >View Ad</button>
                            </div>
                            <div v-else>
                                <button
                                    @click="goToVideoUpload(data.value._id)"
                                    class="t-s btn btn-sm btn-link pl0 pr0 error"
                                >Finish Setup</button>
                            </div>
                        </template>
                    </Table>
                </div>

                <div class="d-block d-md-none" v-for="ad in clientAds">
                    <b-card :title="ad.Name" class="mb-2">
                        <b-card-text>
                            <div class="d-flex flex-row justify-content-between">
                                <div>
                                    <div>Schedule:</div>
                                    <div class>
                                        <span
                                            class="bold"
                                        >{{ ad.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.Name }}</span>
                                        <span
                                            class="t-s"
                                        >{{ ad.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.StartTime }} - {{ ad.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.EndTime }}</span>
                                    </div>
                                </div>
                                <div>
                                    <div>Channel:</div>
                                    <div class="bold">{{ ad.ChannelPlan.Plan.Channel.Name }}</div>
                                </div>
                            </div>
                            <div class="d-flex flex-column justify-content-center mt16">
                                <div v-if="ad.ClientAd">
                                    <button
                                        @click="openVideo(ad.ClientAd.VideoUrl)"
                                        class="btn btn-sm btn-link pl0 pr0"
                                    >View Ad</button>
                                </div>
                                <div v-else>
                                    <button
                                        @click="goToVideoUpload(ad._id)"
                                        class="btn btn-sm btn-link pl0 pr0 error"
                                    >Finish Setup</button>
                                </div>
                            </div>
                        </b-card-text>
                    </b-card>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import instance from '@/api';
import VideoModal from '@/webapp/common/modals/VideoModal';
import Table from '@/e9_components/components/Table';

export default {
    name: 'MyAds',
    components: {
        VideoModal,
        Table
    },
    data() {
        return {
            displayAdVideo: false,

            clientAds: [],
            videoUrl: '',

            fields: [
                {
                    key: 'Name',
                    sortable: true
                },
               
                {
                    key: 'Channel',
                    sortable: true
                },
                {
                    key: 'Schedule',
                    sortable: true
                },
                {
                    key: 'PlanDuration',
                    label: 'Plan Duration',
                    sortable: true
                },
                {
                    key: 'Action',
                    label: ' '
                }
            ],

            showLoadMore: true,
            isLoading: false,
            pagination: {
                currentPage: 1,
                perPage: 10
            },
            sort: {
                name: 'Name',
                value: 'asc'
            }
        };
    },
    methods: {
        filterTable(row, filter) {
            if (row.Name.toLowerCase().includes(filter)) {
                return row;
            } else {
                return null;
            }
        },
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

<style lang="scss" scoped>
.myads {
    background: #f9f9f9;
}
</style>
