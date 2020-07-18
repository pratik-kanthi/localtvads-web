<template>
    <div>
        <Stepper :steps="steps" :current="currentStep"></Stepper>
        <div>
            <component
                :is="currentStage"
                @advanceToPayment="goToPayment"
                @advanceToUpload="goToUpload"
                @advanceToAddOns="goToAddOns"
            ></component>
        </div>
        <LoaderModal :showloader="isLoading" :message="loaderMessage + '...'"></LoaderModal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import instance from '@/api';
import UploadAd from './UploadAd';
import ChoosePlan from './ChoosePlan';
import Review from './Review';
import Payment from './Payment';
import AdDetails from './AdDetails';
import ChooseAddons from '../addons/ChooseAddon';
import AddOnPayment from '../addons/Payment';
import Stepper from '@/e9_components/components/Stepper';

export default {
    name: 'BookingFlow',
    components: {
        Stepper
    },
    data() {
        return {
            currentStage: UploadAd,
            currentStep: 1,
            clientAdPlan: null,
            isLoading: false,
            loaderMessage: 'Fetching available plans',
            hasAddOn: false,
            serviceAddOn: null,
            selectedPlan: {},
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
                    name: 'Ad Details',
                    index: 4
                },
                {
                    name: 'Upload Your Ad',
                    index: 5
                },
                {
                    name: 'Verification',
                    index: 6
                }
            ]
        };
    },
    methods: {
        async fetchClientAdPlan() {
            if (this.$route.query.clientadplan) {
                debugger;
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
                        this.currentStage = UploadAd;
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
            this.currentStage = UploadAd;
            this.clientAdPlan.Category = val;
        },
        preventNav(e) {
            if (!this.getIsVideoBeingUploaded()) return;
            if (e) {
                e.returnValue = 'Sure?';
            }
            return 'Sure?';
        },
        ...mapGetters(['getIsVideoBeingUploaded'])
    },
    async created() {
        setTimeout(() => $('.v-stepper__step__step').text(''));
        this.fetchClientAdPlan();
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

<style scoped lang="scss"></style>
