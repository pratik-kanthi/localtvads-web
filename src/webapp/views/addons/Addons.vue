<template>
    <div>
        <component :is="currentStage" @advanceToPayment="goToPayment"></component>
        <LoaderModal :showloader="isLoading" message="Please wait while we fetch the data..."></LoaderModal>
    </div>
</template>

<script>
import instance from '@/api';
import SelectMedia from '@/webapp/views/addons/SelectMedia';
import ChooseAddon from './ChooseAddon';
import Payment from './Payment';
import Review from './Review';
export default {
    name: 'Addon',
    data() {
        return {
            currentStage: '',
            isLoading: false,
            clientServiceAddOn: null,
            serviceAddOn: {},
            taxes: []
        };
    },
    methods: {
        async getClientServiceAddOn() {
            this.$parent.isLoading = true;
            try {
                let result = await instance.get('api/serviceaddons/getone?serviceaddon=' + this.$route.query.clientaddon);
                this.clientServiceAddOn = result.data;
                this.$parent.isLoading = false;
                if (this.clientServiceAddOn && this.clientServiceAddOn.IsUploadRequired && (!this.clientServiceAddOn.Images.length || !this.clientServiceAddOn.Videos.length)) {
                    this.currentStage = SelectMedia;
                } else {
                    this.currentStage = Review;
                }
            } catch (err) {
                this.$parent.isLoading = false;
                this.$swal({
                    title: 'Error',
                    text: err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        goToPayment() {
            this.currentStage = Payment;
        }
    },
    created() {
        if (!this.$route.query.clientaddon) {
            this.currentStage = ChooseAddon;
        } else {
            this.getClientServiceAddOn();
        }
    }
};
</script>

<style>
</style>
