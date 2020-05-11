<template>
    <section class="myads">
        <div v-if="displayAdVideo">
            <VideoModal :show-video="displayAdVideo" :video-url="videoUrl" @close="closeVideo"></VideoModal>
        </div>
        <div class="container">
            <div class="d-flex justify-content-between align-items-center">
                <h3 class="section-title-2 mb24">My Ad Plans</h3>
                <div class="form-group d-flex align-items-center">
                    <input placeholder="Search ads by name" type="text" v-model="filterCriteria" class="form-control p8" />
                    <i class="material-icons white p8 rounded brand-primary-bg">search</i>
                </div>
            </div>

            <div v-if="!isLoading && clientAds.length === 0">
                <p class="lead">You haven't purchased any ad plans</p>
            </div>
            <div v-else class="ads-table-wrapper">
                <div class="ads-table">
                    <b-table :filter="filterCriteria" :filter-function="filterTable" :items="clientAds" :fields="fields" :per-page="perPage" :current-page="currentPage" responsive id="transaction-table">
                        <template v-slot:cell(Name)="data">
                            <div class="d-flex flex-column">
                                <div>{{ data.item.Name }}</div>
                            </div>
                        </template>
                        <template v-slot:cell(Schedule)="data">
                            <div class="d-flex flex-column">
                                <span>{{ data.item.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.Name }}</span>
                                <span class="t-s">{{ data.item.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.StartTime }} - {{ data.item.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.EndTime }}</span>
                            </div>
                        </template>
                        <template v-slot:cell(Channel)="data">
                            <span>{{ data.item.ChannelPlan.Plan.Channel.Name }}</span>
                        </template>
                        <template v-slot:cell(StartDate)="data">
                            <div>{{ data.item.StartDate | formatDate('DD-MMM-YYYY') }}</div>
                        </template>
                        <template v-slot:cell(Action)="data">
                            <div class="d-flex flex-column justify-content-center   ">
                                <div v-if="data.item.ClientAd">
                                    <button @click="openVideo(data.item.ClientAd.VideoUrl)" class="t-s table-action-button btn brand-secondary-bg w-100  rounded white">View Ad</button>
                                </div>
                                <div v-else>
                                    <button @click="goToVideoUpload(data.item._id)" class="t-s table-action-button btn brand-primary-bg pl8 pr8 w-100 rounded white">Finish Setup</button>
                                </div>
                            </div>
                        </template>
                    </b-table>
                </div>
            </div>
            <b-pagination v-model="currentPage" :total-rows="clientAds.length" :per-page="perPage" first-text="First" prev-text="Prev" next-text="Next" last-text="Last" aria-controls="transaction-table" align="right" class="pt0 pb16 pr16"></b-pagination>
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
            perPage: 15,
            currentPage: 1,
            fields: ['Name', 'Status', 'StartDate', 'Channel', 'Schedule', 'Action'],
            showLoadMore: true,
            isLoading: false,
            filterCriteria: ''
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

<style lang="scss" scopped>
.ads-table-wrapper {
    background-color: $white;
    border-radius: 8px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.ads-table {
    table {
        border-collapse: collapse;
        border-spacing: 0 5px;
        width: 100%;

        thead {
            tr {
                th {
                    padding: 24px;
                    border: none;
                    font-size: 16px;
                    font-weight: 500;
                    font-family: $font-family-heading;

                    &:first-child {
                        border-top-left-radius: 6px;
                    }

                    &:last-child {
                        border-top-right-radius: 6px;
                    }
                }
            }
        }

        tbody {
            tr {
                color: $base;
                background-color: $white;

                &:last-child {
                    td {
                        padding-bottom: 48px !important;
                    }
                }
            }
        }
    }
}

.table-action-button {
    height: auto;
}
</style>
