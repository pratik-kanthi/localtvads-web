<template>
    <div>
        <component :is="currentStage"></component>
    </div>
</template>

<script>
import ChooseAddon from '@/webapp/views/addons/ChooseAddon';
export default {
    name: 'Addon',
    data() {
        return {
            currentStage: ChooseAddon
        };
    },
};
</script>

<style>
</style>
