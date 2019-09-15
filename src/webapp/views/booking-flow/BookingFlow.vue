<template>
    <div>
        <v-stepper alt-labels :value="currentStep">
            <v-stepper-header>
                <v-stepper-step step="1">Book Your Ad</v-stepper-step>
                <v-divider :class="{'completed': currentStep > 1}"></v-divider>
                <v-stepper-step step="2">Payment</v-stepper-step>
                <v-divider :class="{'completed': currentStep > 2}"></v-divider>
                <v-stepper-step step="3">Upload Your Ad</v-stepper-step>
                <v-divider :class="{'completed': currentStep > 3}"></v-divider>
                <v-stepper-step step="3">Verification</v-stepper-step>
            </v-stepper-header>
        </v-stepper>
        <div v-show="!isLoading">
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

    export default {
        name: "BookingFlow",
        data() {
            return {
                currentStage: UploadAd,
                currentStep: 1,
                clientAdPlan: null,
                isLoading: false,
                loaderMessage: 'Please stand by while we fetch data',
                selectedPlan: {},
            }
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
                        } else  {
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
                        throw err;
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
    }
</script>

<style scoped>

</style>