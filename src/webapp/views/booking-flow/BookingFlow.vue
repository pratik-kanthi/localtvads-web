<template>
    <div>
        <Stepper :steps="steps" :current="currentStep"></Stepper>
        <div v-if="currentStage == !4" class="bg--grey mt32 pt16 pb16">
            <div class="container">
                <div class="row selected-booking-options">
                    <div class="col-md-6 col-lg-6 booking-option">
                        <div class="booking-option-name brand-primary">Selected Channel</div>
                        <div class="t-l">{{ channel.Name }}</div>
                    </div>
                    <div class="col-md-6 col-lg-4 booking-option">
                        <div class="booking-option-name brand-primary">Selected Days</div>
                        <div class="t-l">{{ getSelectedDays().join(',') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <component :is="currentStage" @advanceToPayment="goToPayment" @advanceToUpload="goToUpload" @advanceToAddOns="goToAddOns"></component>
        </div>
        <LoaderModal :showloader="isLoading" :message="loaderMessage + '...'"></LoaderModal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import instance from '@/api';
import ChoosePlan from './ChoosePlan';
import Review from './Review';
import Payment from './Payment';
import AdDetails from './AdDetails';
import Confirmation from './Confirmation';
import ChooseAddons from '../addons/ChooseAddon';
import AddOnPayment from '../addons/Payment';
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
                    index: 1
                },
                {
                    name: 'Choose Add On',
                    index: 2
                },
                {
                    name: 'Payment',
                    index: 3
                },
                {
                    name: 'Confirmation',
                    index: 4
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
        goToAddOns() {
            this.currentStep = 2;
            this.currentStage = ChooseAddons;
        },
        goToPayment() {
            this.currentStep = 3;
            if (this.hasAddOn) {
                this.currentStage = AddOnPayment;
            } else {
                this.currentStage = Payment;
            }
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
            let days = ['', ' Monday', ' Tuesday', ' Wednesday', ' Thursday', ' Friday', ' Saturday', ' Sunday'];
            return this.daysSelected.map(day => {
                return days[day];
            });
        },
        ...mapGetters(['getIsVideoBeingUploaded'])
    },
    async created() {
        try {
            setTimeout(() => $('.v-stepper__step__step').text(''));
            this.daysSelected = atob(this.$route.query.daysSelected)
                .split(',')
                .map(function(item) {
                    return parseInt(item);
                });
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
