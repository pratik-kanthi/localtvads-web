<template>
    <div>
        <component :is="currentStage" @advanceToPayment="goToPayment"></component>
        <LoaderModal :showloader="isLoading" :message="loaderMessage + '...'"></LoaderModal>
    </div>
</template>

<script>
import ChooseAddon from '@/webapp/views/addons/ChooseAddon';
import Payment from '@/webapp/views/addons/Payment';
export default {
    name: 'Addon',
    data() {
        return {
            currentStage: ChooseAddon,
            isLoading: false,
            selectedAddon: {},
            loaderMessage: 'Please stand by while we fetch data',
        };
    },
    methods: {
        goToPayment() {
            this.currentStage = Payment;
        }
    },
};
</script>

<style>
</style>
