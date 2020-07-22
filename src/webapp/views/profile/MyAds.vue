<template>
    <section class="myads vh-100 pt24">
        <div v-if="displayAdVideo">
            <VideoModal class="promo" :show-video="displayAdVideo" :video-url="videoUrl" @close="closeVideo"></VideoModal>
        </div>

        <LoaderModal :showloader="isLoading" message="Please wait while we fetch the data..."></LoaderModal>
        <div class="container table-container pm-24">
            <h3 class="brand-secondary mt64 mb48">My Ad Plans</h3>

            <div v-if="!isLoading && clientAdPlans.length === 0">
                <p class="lead">You haven't purchased any ad plans</p>
            </div>
            <div v-else-if="clientAdPlans.length > 0">
                <div class="table-wrapper">
                    <Table :on-row-click="openAdPlanDetails" :items="clientAdPlans" :headings="fields" :pagination="pagination" :sort.sync="sort" table-class="table-responsive-xs ">
                        <template v-slot:Channel="data">
                            <div>{{ data.value.Channel.Name }}</div>
                        </template>
                        <template v-slot:PurchaseDate="data">
                            <div>{{ data.value.BookedDate | formatDate('DD MMMM YYYY') }}</div>
                        </template>
                        <template v-slot:Name="data">
                            <div>{{ data.value.Name }}</div>
                        </template>
                        <template v-slot:WeeklySchedule="data">
                            <div><WeekDays mode="table" :value="data.value.Days"></WeekDays></div>
                        </template>
                        <template v-slot:Status="data">
                            <div :class="getStatusClass(data.value.Status)">{{ data.value.Status }}</div>
                        </template>
                        <template v-slot:SlotsBooked="data">
                            <div class="d-flex flex-row flex-md-column">
                                <div v-for="(slot, key) in data.value.ChannelProduct.ChannelSlots" :key="key">{{ slot.Slot.Name }} ( {{ slot.Slot.StartTime }} - {{ slot.Slot.EndTime }})</div>
                            </div>
                        </template>
                        <template v-slot:PlanDuration="data">
                            <div>{{ data.value.ChannelProduct.ProductLength.Name }}</div>
                        </template>
                    </Table>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import ClientAdService from '@/services/ClientAdService';
import VideoModal from '@/webapp/common/modals/VideoModal';
import Table from '@/e9_components/components/Table';
import WeekDays from '@/e9_components/components/WeekDays';

export default {
    name: 'MyAds',
    components: {
        VideoModal,
        Table,
        WeekDays
    },
    data() {
        return {
            displayAdVideo: false,
            clientAdPlans: [],
            videoUrl: '',
            fields: [
                {
                    key: 'Channel'
                },
                {
                    key: 'Status'
                },
                {
                    key: 'PurchaseDate',
                    label: 'Purchase Date'
                },
                {
                    key: 'PlanDuration',
                    label: 'Plan Duration'
                },
                {
                    key: 'WeeklySchedule',
                    label: 'Weekly Schedule'
                },
                {
                    key: 'SlotsBooked',
                    label: 'Slots Selected'
                }
            ],
            isLoading: true,
            pagination: {
                currentPage: 1,
                perPage: 10
            },
            sort: {
                name: 'BookedDate',
                value: 'asc'
            }
        };
    },
    methods: {
        getSelectedDays(selectedDays, isMobile) {
            let days = ['', ' Monday', ' Tuesday', ' Wednesday', ' Thursday', ' Friday', ' Saturday', ' Sunday'];
            if (isMobile) days = ['', ' Mon', ' Tue', ' Wed', ' Thu', ' Fri', ' Sat', ' Sun'];
            return selectedDays
                .map(day => {
                    return days[day];
                })
                .join(',');
        },
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
                this.clientAdPlans = await ClientAdService.getAllPlans(this.$store.getters.getUser.Owner._id);
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
        openAdPlanDetails(clientadplan) {
            this.$router.push({ name: 'AdPlanDetails', query: { id: clientadplan._id } });
        },
        getStatusClass(status) {
            return status.toLowerCase();
        },
        ...mapGetters(['getUser'])
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
