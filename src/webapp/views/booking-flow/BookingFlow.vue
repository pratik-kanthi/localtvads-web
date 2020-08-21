<template>
    <div>
        <div class="d-flex align-items-center justify-content-center pb32">
            <Stepper :steps="steps" :current="currentStep"></Stepper>
        </div>
        <div v-show="currentStep < 3" class="bg--grey">
            <div class="container">
                <div class="row selected-booking-options pt24 pb24">
                    <div class="col-md-3 booking-option">
                        <div class="brand-secondary">
                            <span>Selected Channel</span>
                        </div>
                        <div class="mt8 t-l brand-primary">{{ channel.Name }}</div>
                    </div>

                    <div class="col-md-3 booking-option">
                        <div class="brand-secondary">
                            <span>Selected Days</span>
                        </div>
                        <div class="mt8 t-l brand-primary">{{ getSelectedDays().join(',') }}</div>
                    </div>

                    <div class="col-md-3 booking-option">
                        <div class="brand-secondary">
                            <span>Plan Duration</span>
                        </div>
                        <div v-if="currentStep > 1" class="mt8 t-l brand-primary">{{ clientAdPlan.ChannelProduct.ProductLength.Name }}</div>
                        <div v-else class="mt8">-</div>
                    </div>

                    <div class="col-md-3 booking-option">
                        <div class="brand-secondary">
                            <span>Selected Slots</span>
                        </div>
                        <div v-if="currentStep > 1" class="mt8 t-l brand-primary">
                            <div v-for="(slot, index) in clientAdPlan.ChannelProduct.ChannelSlots" :key="index">
                                {{ slot.Slot.Name }} <span>({{ slot.Slot.StartTime }} - {{ slot.Slot.EndTime }})</span>
                            </div>
                        </div>
                        <div v-else class="mt8">-</div>
                    </div>
                </div>
            </div>
        </div>

        <component :is="currentStage" @advanceToPayment="goToPayment" @advanceToConfirmation="advanceToConfirmation" @advanceToUpload="goToUpload" @advanceToAddOns="goToAddOns"></component>
        <LoaderModal :showloader="isLoading" :message="loaderMessage + '...'"></LoaderModal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import instance from '@/api';
import ChoosePlan from './ChoosePlan';
import Review from './Review';
import Payment from '../addons/Payment';
import AdDetails from './AdDetails';
import Confirmation from './Confirmation';
import ChooseAddons from '../addons/ChooseAddon';
import Stepper from '@/e9_components/components/Stepper';
import ChannelService from '@/services/ChannelService';
import WeekDays from '@/e9_components/components/WeekDays';

export default {
    name: 'BookingFlow',
    components: {
        Stepper,
        WeekDays
    },
    data() {
        return {
            transaction: null,
            currentStep: 1,
            currentStage: null,
            daysSelected: [],
            clientAdPlan: {},
            isLoading: false,
            loaderMessage: 'Fetching available plans',
            hasAddOn: false,
            serviceAddOn: null,
            selectedPlan: null,
            channel: {},
            steps: [
                {
                    name: 'Create your plan',
                    index: 1,
                    stage: ChoosePlan
                },
                {
                    name: 'Choose Add On',
                    index: 2,
                    stage: ChooseAddons
                },
                {
                    name: 'Payment',
                    index: 3,
                    stage: Payment
                },
                {
                    name: 'Confirmation',
                    index: 4,
                    stage: Confirmation
                }
            ]
        };
    },
    methods: {
        async fetchClientAdPlan() {
            if (this.$route.query.clientadplan) {
                try {
                    this.isLoading = true;
                    let result = await instance.get('api/clientad/getclientadplan?clientadplan=' + this.$route.query.clientadplan);
                    this.clientAdPlan = result.data;
                    if (!this.clientAdPlan) {
                        this.currentStep = 1;
                        this.currentStage = ChoosePlan;
                    } else if (!this.clientAdPlan.Category) {
                        this.currentStep = 3;
                        this.currentStage = AdDetails;
                    } else if (!this.clientAdPlan.ClientAd) {
                        this.currentStep = 4;
                        // this.currentStage = UploadAd;
                    } else {
                        this.currentStep = 5;
                        this.currentStage = Review;
                    }
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
            } else if (this.$route.query.confirmation) {
                this.currentStep = 4;
                this.currentStage = Confirmation;
            } else {
                this.currentStep = 1;
                this.currentStage = ChoosePlan;
            }
        },
        goBack() {
            this.currentStep = --this.currentStep;
            let previous = this.steps.find(step => {
                return this.currentStep == step.index;
            });
            this.currentStage = previous.stage;
        },
        goToAddOns() {
            this.currentStep = 2;
            this.currentStage = ChooseAddons;
        },
        advanceToConfirmation() {
            this.currentStep = 4;
            this.currentStage = Confirmation;
        },
        goToPayment() {
            this.currentStep = 3;
            this.currentStage = Payment;
        },
        goToUpload(val) {
            this.currentStep = 4;
            this.clientAdPlan.Category = val;
        },
        preventNav(e) {
            if (!this.getIsVideoBeingUploaded()) return;
            if (e) {
                e.returnValue = 'Sure?';
            }
            return 'Sure?';
        },
        getSelectedDays() {
            let days = ['', ' Mon', ' Tue', ' Wed', ' Thu', ' Fri', ' Sat', ' Sun'];
            return this.daysSelected.map(day => {
                return days[day];
            });
        },
        ...mapGetters(['getIsVideoBeingUploaded'])
    },
    async created() {
        try {
            this.isLoading = true;
            setTimeout(() => $('.v-stepper__step__step').text(''));
            this.daysSelected = atob(this.$route.query.daysSelected)
                .split(',')
                .map(function(item) {
                    return parseInt(item);
                });
            this.clientAdPlan.Days = this.daysSelected;
            this.clientAdPlan.Channel = this.$route.query.channel;
            this.channel = await ChannelService.getChannel(this.$route.query.channel);
            this.currentStage = ChoosePlan;
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                type: 'error'
            });
        }
    },
    beforeMount() {
        window.addEventListener('beforeunload', this.preventNav);
    },
    beforeDestroy() {
        window.removeEventListener('beforeunload', this.preventNav);
    },
    beforeRouteLeave: function(to, from, next) {
        if (this.getIsVideoBeingUploaded()) {
            this.$swal({
                title: 'Upload pending',
                text: 'You have a pending upload, hence you will not be allowed to leave until upload finishes',
                type: 'warning'
            });
            next(false);
        } else {
            next();
        }
    }
};
</script>

<style scoped lang="scss">
.selected-booking-options {
    .booking-option-name {
        font-size: 16px;
        @include media-breakpoint-up(md) {
            font-size: 24px;
        }
    }
}
</style>
