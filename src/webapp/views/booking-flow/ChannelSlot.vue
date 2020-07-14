<template>
    <div class="slot border rounded p24 mt8 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-md-between">
        <div class="t-l">Slot {{ index }}</div>

        <div class="w-25">
            <b-form-select v-model="selectedSlot" @change="selectSlot">
                <b-form-select-option value="null" disabled>Select Your Slot</b-form-select-option>
                <b-form-select-option v-for="slot in slotOptions" :key="slot._id" :value="slot">{{ slot.Name }}</b-form-select-option>
            </b-form-select>
        </div>

        <div class="slot-details" v-if="selectedSlot">
            <div class="medium">Played on selected days between {{ selectedSlot.StartTime }} - {{ selectedSlot.EndTime }}</div>
            {{ (selectedSlot.BaseAmount / 13.03) | currency }}
            <span class="duration t-m thin">/ week</span>
        </div>
        <div class="slot-price" v-if="selectedSlot">
            <div class="brand-primary t-xl">{{ selectedSlot.BaseAmount | currency }}</div>
            <span class="text-muted italic">for {{ planLength }} months</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChannelSlot',
    props: {
        index: {
            type: Number
        },
        slotOptions: {
            type: Array
        },
        planLength: {
            type: Number
        }
    },
    data() {
        return {
            selectedSlot: null
        };
    },
    methods: {
        selectSlot() {
            this.$emit('done', this.selectedSlot);
        }
    }
};
</script>

<style scoped lang="scss"></style>
