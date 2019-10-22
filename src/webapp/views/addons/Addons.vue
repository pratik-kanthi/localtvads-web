<template>
    <div>
        <component :is="currentStage"></component>
        <LoaderModal :showloader="isLoading" message="Please wait while we fetch the data..."></LoaderModal>
    </div>
</template>

<script>
import SelectMedia from '@/webapp/views/addons/SelectMedia';
import ChooseAddon from './ChooseAddon';
export default {
    name: 'Addon',
    data() {
        return {
            currentStage: '',
            isLoading: false
        };
    },
    created() {
        if (!this.$route.query.clientaddon) {
            this.currentStage = ChooseAddon;
        } else {
            this.currentStage = SelectMedia;
        }
    }
};
</script>

<style>
</style>
