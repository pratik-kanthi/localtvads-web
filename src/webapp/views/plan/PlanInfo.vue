<template>
    <div>
        <div v-if="clientAdPlan" class="mt24">
            <div class="shadow-border">
                <div class="b-b p8 pl16 d-flex justify-content-between">
                    <span class="t-18 bs-dark">Your Ad</span>
                </div>
                <div class="row p16">
                    <div class="col-md-6">
                        <div v-if="clientAdPlan.AdVideo" class="ad-video" @click="openVideo(clientAdPlan.AdVideo.ResourceUrl)">
                            <VideoCard :id="clientAdPlan.AdVideo._id" :video-url="clientAdPlan.AdVideo.ResourceUrl"></VideoCard>
                        </div>
                        <div v-else>
                            <div class="video-holder">
                                <button class="btn btn-primary-small">Select From Library</button>
                            </div>
                            <div class="t-l bs-dark mt16">Your final Ad video will appear here. If you have chosen an Addon, our team of professionals will create and upload it here for you.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="shadow-border mt24">
                <div class="b-b p16">
                    <span class="t-18 bs-dark">Plan Details</span>
                </div>
                <div class="row p16">
                    <div class="col-md-3">
                        <div class="mt8 d-flex justify-content-between">
                            <span>Channel</span>
                            <span class="bs-dark">{{ clientAdPlan.Channel.Name }}</span>
                        </div>
                        <div class="mt8 d-flex justify-content-between">
                            <span>Plan Duration</span>
                            <span class="bs-dark">{{ clientAdPlan.ChannelProduct.ProductLength.Duration }} months</span>
                        </div>
                    </div>
                    <div class="col-md-4"></div>
                    <div class="col-md-3">
                        <div class="mt8 d-flex justify-content-between">
                            <span>Start Date</span>
                            <div v-if="clientAdPlan.StartDate">
                                <span class="bs-dark">{{ clientAdPlan.StartDate | formatDate('DD MMM YYYY') }}</span>
                            </div>

                            <div v-else class="brand-primary">Not Available</div>
                        </div>
                        <div class="mt8 d-flex justify-content-between">
                            <span>Purchase Date</span>
                            <span class="bs-dark">{{ clientAdPlan.BookedDate | formatDate('DD MMM YYYY') }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="shadow-border mt24">
                <div class="b-b p16">
                    <span class="t-18 bs-dark">Schedule</span>
                </div>
                <div class="row p16">
                    <div class="col-md-12">
                        <span>Slots Selected</span>
                        <div class="mt16">
                            <span class="border p8 rounded mr8" v-for="(slot, key) in clientAdPlan.ChannelProduct.ChannelSlots" :key="key">
                                <span class="bs-dark">{{ slot.Slot.Name }} ( {{ slot.Slot.StartTime }} - {{ slot.Slot.EndTime }})</span>
                            </span>
                        </div>
                    </div>
                    <div class="col-md-12 mt24">
                        <span>Weekly Schedule</span>
                        <WeekDays :disabled="true" mode="table" :value="clientAdPlan.Days"></WeekDays>
                    </div>
                </div>
                <div class="mt8"></div>
            </div>
        </div>
    </div>
</template>

<script>
import ClientAdService from '@/services/ClientAdService';
import WeekDays from '@/e9_components/components/WeekDays';
import VideoCard from '@/webapp/common/components/VideoCard';

export default {
    name: 'PlanInfo',
    components: {
        WeekDays,
        VideoCard
    },
    data() {
        return {
            clientAdPlan: null
        };
    },
    methods: {
        async getClientAdPlan() {
            try {
                this.clientAdPlan = await ClientAdService.getPlanDetails(this.$route.params.planId);
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        }
    },
    created() {
        this.getClientAdPlan();
    }
};
</script>

<style lang="scss" scoped>
.ad-video {
}
.video-holder {
    height: 240px;
    border: 1px dotted $brand-primary;
}
</style>
