<template>
    <div class="slot border rounded p24 mt8">
        <div class="row">
            <div class="col-sm-1">Slot {{ index }}</div>
            <div class="col-sm-4">
                <b-form-select v-model="selectedSlot" @change="selectSlot">
                    <b-form-select-option value="null">Select Your Slot</b-form-select-option>
                    <b-form-select-option v-for="(slotData, key) in selectedPlan.ChannelSlots" :key="key" :value="slotData">
                        <p class="slot-name">{{ slotData.Slot.Name }}</p>
                    </b-form-select-option>
                </b-form-select>
            </div>
            <div class="col-sm-4">
                <div class="slot-details" v-if="selectedSlot">
                    <div class="medium">Played on selected days between {{ selectedSlot.Slot.StartTime }} - {{ selectedSlot.Slot.EndTime }}</div>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="slot-price" v-if="selectedSlot">You will be charged {{ (selectedSlot.RatePerSecond * selectedSlot.Duration * noOfDays) | currency }} <span class="duration t-m thin">/ week</span> from the day we go live with the ad.</div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    name: 'ChannelSlot',
    props: {
        index: {
            type: Number
        },
        noOfDays: {
            type: Number
        },
        selectedPlan: {
            type: Object
        }
    },
    data() {
        return {
            selectedSlot: null,
            oldVal: null
        };
    },
    methods: {
        selectSlot() {
            this.$emit('done', this.selectedSlot, this.oldVal);
            this.oldVal = this.selectedSlot;
        }
    },
    computed: {
        amount() {
            let numberOfDays = moment().daysInMonth();
            for (let i = 2, len = this.selectedPlan.ProductLength.Duration; i <= len; i++) {
                numberOfDays += moment()
                    .add(i, 'month')
                    .daysInMonth();
            }
            return ((this.selectedSlot.RatePerSecond * this.selectedSlot.Duration * this.noOfDays) / 7) * numberOfDays;
        }
    }
};
</script>

<style scoped lang="scss"></style>
