<template>
    <div>
        <Stepper :steps="steps" :current="currentStep"></Stepper>
        <div>
            <component :is="currentStage" @advanceToPayment="goToPayment"></component>
        </div>
        <LoaderModal :showloader="isLoading" :message="loaderMessage + '...'"></LoaderModal>
    </div>
</template>

<script>
import instance from '@/api';
import UploadAd from './UploadAd';
import ChoosePlan from './ChoosePlan';
import Review from './Review';
import Payment from './Payment';
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
            loaderMessage: 'Please stand by while we fetch data',
            selectedPlan: {},
            steps: [
                {
                    name: 'Book Your Ad',
                    index: 1
                },
                {
                    name: 'Payment',
                    index: 2
                },
                {
                    name: 'Upload Your Ad',
                    index: 3
                },
                {
                    name: 'Verification',
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
                    }
                    else if (!this.clientAdPlan.ClientAd) {
                        this.currentStep = 3;
                        this.currentStage = UploadAd;
                    } else {
                        this.currentStep = 4;
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
            }
            else {
                this.currentStep = 1;
                this.currentStage = ChoosePlan;
            }
        },
        goToPayment() {
            this.currentStep = 2;
            this.currentStage = Payment;
        },
    },
    async created() {
        setTimeout(() => $('.v-stepper__step__step').text(''));
        this.fetchClientAdPlan();
    }
};
</script>

<style scoped lang="scss">

</style>
