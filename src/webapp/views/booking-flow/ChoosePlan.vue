<template>
    <div class="choose-plan">
        <div class="container">
            <h3 class="mt64 brand-secondary">Step 1 : Create your plan</h3>
            <div class="channel-plans-wrapper d-flex mt32">
                <div class="channel-plan" v-for="(plan, key) in channelPlans" :key="key" :class="$parent.selectedPlan._id == plan._id ? 'active' : ''" @click="selectPlan(plan)">
                    <span>{{ plan.ProductLength.Name }}</span>
                </div>
            </div>
            <div v-if="$parent.selectedPlan">
                <div class="d-flex justify-content-between mt32">
                    <div>
                        <div class="t-xl">How many times do you want your ad to air in a day?</div>
                        <div class="t-l">This is the total number of ad runs per day, you can select your ad to be aired across multiple slots.</div>

                        <div class="counter d-flex align-items-center mt24">
                            <button @click="decrement()" :disabled="quantity < 2" class="btn btn-primary btn-circle">-</button>
                            <div class="quantity t-l p16">{{ quantity }}</div>
                            <button @click="increment()" :disabled="quantity > 2" class="btn btn-primary btn-circle">+</button>
                        </div>
                    </div>
                </div>
                <div class="mt32">
                    <div class="t-xl">Select you ad slots</div>
                    <div class="t-l">This is the total number of ad runs per day, you can select your ad to be aired across multiple slots.</div>
                </div>
                <div class="slot-container mt24">
                    <ChannelSlot v-for="index in quantity" :key="index" :no-of-days="$parent.daysSelected.length" :index="index" :slot-options="slotOptions" @done="handleSelect" :plan-length="$parent.selectedPlan.ProductLength.Duration"></ChannelSlot>
                </div>
                <div v-if="selected.length > 0" class="pricing-info d-flex justify-content-between align-items-start mt24 border border-primary p32">
                    <div>
                        <div class="t-xl">Plan duration : {{ planLength }} months</div>
                        <div v-if="planLength == 3" class="t-l mt16">You could save {{ totalSaving | currency }} on a 6 month plan:</div>
                        <div v-if="planLength == 3" @click="changePlanLength" class="brand-primary t-l">Switch to 6 months plan</div>
                        <div v-if="planLength == 6" @click="changePlanLength" class="brand-primary t-l">Switch to 3 months plan</div>
                    </div>
                    <div class="text-right">
                        <div class="d-flex justify-content-between brand-primary t-xl">
                            <div>Total Payable:</div>
                            <div>{{ (planTotal / 13.03) | currency }} / week</div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div>Total Plan Amount:</div>
                            <div>{{ planTotal | currency }}</div>
                        </div>
                    </div>
                </div>
                <div class="action mt48 mb64 d-flex justify-content-center">
                    <button class="btn btn-white w-25 border" @click="cancel">Cancel</button>
                    <button class="btn btn-primary w-25 ml16" @click="goToPayment">Proceed</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import instance from '@/api';
import ChannelProductService from '@/services/ChannelProductService';
import ChannelSlot from './ChannelSlot';

export default {
    name: 'ChoosePlan',
    components: {
        ChannelSlot
    },
    data() {
        return {
            quantity: 1,
            availableSlots: {},
            channelslots: [],
            selected: [],
            planLength: 3,
            channelPlans: [],
            channelSelected: this.$route.query.channel,
            isRenewal: false,
            seconds: [],
            secondSelected: this.$route.query.seconds,
            selectedSlot: {},
            slotOptions: [],
            selectedPlan: {},
            sliderEndDate: '',
            sliderStartDate: '',
            slotStartDate: this.$route.query.startdate,
            slotEndDate: this.moment(this.$route.query.startdate, 'YYYY-MM-DD').add(window.slotduration, 'days'),
            taxes: [],
            booloptions: {
                label: 'Plan Length'
            }
        };
    },
    methods: {
        increment() {
            this.quantity++;
        },
        decrement() {
            this.quantity--;
        },
        handleSelect(e, o) {
            if (!o) {
                this.selected.push(e);
            } else {
                this.selected = this.selected.filter(slot => {
                    return slot._id !== o._id;
                });
                this.selected.push(o);
            }
        },
        cancel() {
            this.$router.push('/', () => {});
        },
        changeQueryParams() {
            this.$router.replace({ name: 'BookingFlow', query: { channel: this.channelSelected, seconds: this.secondSelected, startdate: this.slotStartDate } });
        },
        changePlanLength() {
            this.planLength = this.planLength == 3 ? 6 : 3;
        },
        goToPayment() {
            this.$parent.selectedPlan.slots = this.selected;
            this.$parent.selectedPlan.planLength = this.planLength;
            this.$emit('advanceToAddOns');
        },
        async getAvailableSlotsByChannel(isFirstTime) {
            try {
                let result = await instance.get('api/channel/seconds?channel=' + this.channelSelected);
                this.seconds = result.data;

                if (!isFirstTime) {
                    this.changeQueryParams();
                }
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
            this.getAvailableSlots(isFirstTime);
        },
        async getChannelPlans() {
            try {
                this.channelPlans = await ChannelProductService._query({
                    $filter: `Channel eq '${this.channelSelected}'`,
                    $expand: 'ProductLength,ChannelSlots/Slot'
                });
                this.$parent.selectedPlan = this.channelPlans.find(function(item) {
                    return item.ProductLength.Name == '3 Months';
                });
                this.slotOptions = JSON.parse(JSON.stringify(this.$parent.selectedPlan.ChannelSlots));
                this.$parent.clientAdPlan.ChannelProduct = {
                    ProductLength: this.$parent.selectedPlan.ProductLength,
                    ChannelSlots: []
                };
                this.$parent.isLoading = false;
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                this.$parent.isLoading = false;
                console.error(err);
            }
        },
        selectSlot() {
            this.selected.push();
        },
        selectPlan(plan) {
            this.$parent.selectedPlan = plan;
        }
    },
    computed: {
        checkStartDate() {
            return this.moment(this.sliderStartDate, 'YYYY-MM-DD').diff(this.moment(), 'days') >= 1;
        },
        getTotalSlotDuration() {
            return window.slotduration;
        },
        totalSaving() {
            let pricing1 = 0;
            let pricing2 = 0;

            this.channelslots.map(slot => {
                pricing1 += slot.BaseAmount;
            });
            this.channelslots.map(slot => {
                pricing2 += slot.BaseAmount2;
            });

            return pricing1 - pricing2;
        },
        planTotal() {
            let total = 0;
            this.selected.map(item => {
                let t = this.planLength == 3 ? item.BaseAmount : item.BaseAmount2;
                total += t;
            });
            return total;
        }
    },
    created() {
        if (!this.$route.query.channel) {
            this.$router.push('/', () => {});
        } else {
            this.$parent.isLoading = true;
            this.getChannelPlans();
        }
    }
};
</script>

<style lang="scss" scoped>
.channel-plans-wrapper {
    .channel-plan {
        margin-right: 16px;
        padding: 8px 64px;
        border: 1px solid #eee;
        font-size: 18px;
        cursor: pointer;
        &.active {
            color: $brand-primary;
            border: 1px solid $brand-primary;
        }
    }
}
.choose-plan {
    .counter {
        .btn-circle {
            border-radius: 50%;
            height: 32px;
            width: 42px;
        }
    }
    .border-primary {
        border: 1px solid $brand-primary !important;
    }
    input,
    textarea {
        border: 1px solid $brand-primary;
        box-sizing: border-box;
        margin: 0;
        outline: none;
        padding: 10px;
    }

    .pricing-info {
        box-shadow: 0 0 8px 0 rgba(255, 101, 0, 0.5);
        border: 1px solid #ff6500;
    }

    select {
        background-image: url('../../../assets/images/select.png');
        background-color: white;
        background-size: 18px;
        background-repeat: no-repeat;
        background-position: right 18px center;

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            font-size: 13px;
            background-size: 12px;
            background-position: right 12px center;
        }
        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            font-size: 13px;
            background-size: 12px;
            background-position: right 12px center;
        }
    }

    .slot-details {
        .medium::before {
            content: '';
            background-image: url('../../../assets/images/tick.svg');
            height: 16px;
            width: 16px;
            left: 0;
            top: 6px;
            background-size: cover;
            position: absolute;
            background-repeat: no-repeat;
        }
    }

    input[type='button'] {
        -webkit-appearance: button;
        cursor: pointer;
        color: $white;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    .input-group {
        clear: both;
        margin: 15px 0;
        position: relative;
    }
    .input-group input[type='button'] {
        background-color: $brand-primary;
        min-width: 38px;
        width: auto;
        transition: all 300ms ease;
    }

    .input-group .button-minus,
    .input-group .button-plus {
        font-weight: bold;
        height: 38px;
        padding: 0;
        width: 38px;
        position: relative;
    }

    .input-group .quantity-field {
        position: relative;
        height: 38px;
        left: -6px;
        text-align: center;
        width: 62px;
        display: inline-block;
        font-size: 13px;
        margin: 0 0 5px;
        resize: vertical;
    }

    .button-plus {
        left: -13px;
    }

    input[type='number'] {
        -moz-appearance: textfield;
        -webkit-appearance: none;
    }
    label {
        font-family: $font-family-heading;
        color: #acacac;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        display: block;
    }

    ul {
        @include list-unstyled();
        margin: 0;
        li {
            display: inline-block;
            width: 25%;
            text-align: center;
            padding: 20px;
            border-right: 1px solid #cecece;
            cursor: pointer;

            &:last-child {
                border-right: none;
            }

            .date {
                margin-bottom: 10px;
                font-weight: 500;
                font-size: 16px;
                color: $brand-primary;
            }
            .amount {
                font-weight: 500;
                font-size: 20px;
                margin-bottom: 0;
                color: $brand-secondary;
            }

            &.active {
                background-color: $brand-primary;
                .date,
                .amount {
                    color: $white;
                }
            }
        }
    }

    .selected-broadcast-location {
        padding: 16px 35px;
        background-color: #fff !important;

        h5 {
            font-weight: 500;
            margin-bottom: 0;
            font-size: 18px;
            color: $brand-secondary;
            line-height: 28px;
            span {
                margin-right: 8px;

                &.name {
                    font-weight: 500;
                }

                &.address {
                    font-size: 13px;
                }

                &:last-child {
                    margin-right: 0;
                }
            }
        }
        select {
            width: 100%;
            border: none;
            padding: 0;
            background-color: transparent;
            margin-bottom: 0px;
            height: 26px;
            text-transform: capitalize;
            font-weight: 500;
            font-size: 18px;
            font-family: $font-family-heading;
            color: $brand-secondary;
            &:focus {
                outline: none;
            }
            background-image: url('../../../assets/images/select.png');
            background-repeat: no-repeat;
            background-size: 16px;
            background-position: right 12px center;
        }
    }

    .channels-wrapper {
        padding: 24px 120px;

        .channel-wrapper {
            .available-slots {
                margin-bottom: 24px;
                .label {
                    font-size: 20px;
                    font-weight: 500;
                    color: $brand-secondary;
                    margin-bottom: 12px;
                }
                .slots {
                    background: $white;
                    padding: 0 64px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    position: relative;

                    ul {
                        @include list-unstyled();
                        margin: 0;
                        li {
                            display: inline-block;
                            width: 25%;
                            text-align: center;
                            padding: 20px;
                            border-right: 1px solid #cecece;
                            cursor: pointer;

                            &:last-child {
                                border-right: none;
                            }

                            .date {
                                margin-bottom: 10px;
                                font-weight: 500;
                                font-size: 16px;
                                color: $brand-primary;
                            }
                            .amount {
                                font-weight: 500;
                                font-size: 20px;
                                margin-bottom: 0;
                                color: $brand-secondary;
                            }

                            &.active {
                                background-color: $brand-primary;
                                .date,
                                .amount {
                                    color: $white;
                                }
                            }
                        }
                    }

                    .prev {
                        background-color: $white;
                        position: absolute;
                        top: 32%;
                        left: 16px;
                        border-radius: 50%;
                        border: 1px solid #ddd;
                        width: 30px;
                        height: 30px;
                        padding: 2px;
                        color: $brand-primary;
                    }

                    .prev.disabled,
                    .prev[disabled],
                    fieldset[disabled] .prev {
                        cursor: not-allowed;
                        opacity: 0.65;
                    }

                    .next {
                        position: absolute;
                        background-color: $white;
                        top: 32%;
                        right: 16px;
                        border-radius: 50%;
                        border: 1px solid #ddd;
                        width: 30px;
                        height: 30px;
                        padding: 2px;
                        color: $brand-primary;
                    }
                }
            }

            .broadcast-details {
                .label {
                    font-size: 20px;
                    font-weight: 500;
                    color: $brand-secondary;
                    margin-bottom: 12px;
                }
                margin-bottom: 24px;
                .details {
                    border: 1px solid #cecece;
                    border-radius: 8px;
                    padding: 16px 40px;
                    background: $white;
                    h5 {
                        margin-bottom: 12px;
                        font-weight: 100;
                        font-size: 18px;
                        color: $brand-secondary;
                    }
                    h4 {
                        margin-bottom: 0;
                        font-weight: 500;
                        font-size: 20px;
                    }
                    hr {
                        border-top: 3px solid #ccc;
                        margin-top: 36px;
                        margin-bottom: 0;
                    }
                    img.broadcast-img {
                        margin-top: -24px;
                        padding: 0 16px;
                        background-color: #ffffff;
                    }
                }
            }

            .broadcast-slots {
                .label {
                    font-size: 20px;
                    font-weight: 500;
                    color: $brand-secondary;
                    margin-bottom: 12px;
                }
                .plan-wrapper {
                    position: relative;
                    .plan {
                        background: $white;
                        border: 1px solid #ddd;
                        text-align: center;
                        border-radius: 6px;
                        &.active-slot {
                            // box-shadow: 0 0 8px 0 rgba(255, 101, 0, 0.5);
                            @include box-shadow(0 0 8px 0 rgba(255, 101, 0, 0.5));
                            border: 1px solid $brand-primary;
                        }
                        .plan-name {
                            padding: 12px 16px;
                            border-bottom: 1px solid #ddd;

                            h5 {
                                font-weight: 500;
                                font-size: 24px;
                                color: $brand-primary;
                                margin-bottom: 4px;
                            }
                            .timing {
                                font-size: 16px;
                                font-family: $font-family-heading;
                                font-weight: 500;
                                margin-bottom: 0;
                                opacity: 0.6;
                            }
                        }

                        .plan-amount {
                            padding: 12px 16px;
                            border-bottom: 1px solid #ddd;
                            position: relative;
                            .amount {
                                font-weight: 500;
                                font-size: 36px;
                                margin-bottom: 4px;
                                color: $brand-secondary;
                                .duration {
                                    position: absolute;
                                    right: 30px;
                                    top: 32px;
                                    @media (max-width: 767px) {
                                        position: relative;
                                        right: inherit;
                                        top: inherit;
                                    }
                                    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 1) {
                                        position: relative;
                                        right: inherit;
                                        top: inherit;
                                    }
                                }
                                .without-discount {
                                    position: absolute;
                                    right: 16px;
                                    &.strike-through {
                                        text-decoration: line-through;
                                        color: $brand-secondary;
                                    }
                                }
                            }
                            .weeks {
                                font-size: 14px;
                                margin-bottom: 0;
                            }
                        }

                        .features {
                            padding: 16px 36px;
                            ul {
                                @include list-unstyled();
                                li {
                                    font-family: $font-family-heading;
                                    font-size: 13px;
                                    color: $base;
                                    text-align: left;
                                    margin-bottom: 16px;
                                    line-height: 20px;
                                    cursor: pointer !important;
                                    padding-left: 32px;
                                    position: relative;
                                    &:last-child {
                                        margin-bottom: 0;
                                    }

                                    &:before {
                                        content: '';
                                        background-image: url('../../../assets/images/tick.svg');
                                        height: 16px;
                                        width: 16px;
                                        left: 0;
                                        top: 6px;
                                        background-size: cover;
                                        position: absolute;
                                        background-repeat: no-repeat;
                                    }
                                }
                            }
                        }

                        .selectplan {
                            padding: 0 32px 24px;
                            opacity: 1;
                            z-index: 2;
                            .btn-active {
                                background-color: $brand-secondary !important;
                                border: none;
                            }
                        }
                    }
                }
            }

            .action {
                padding: 40px;
                margin-bottom: 56px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                .btn {
                    min-width: 250px !important;
                    margin-right: 20px;
                    &.border {
                        background: transparent;
                        border: 1px solid $error !important;
                        color: $error;
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        .selected-broadcast-location {
            padding: 16px 0;
            .broadcast-location,
            .broadcast-start,
            .ad-length,
            .broadcast-duration,
            .recurring,
            .tolatcost {
                margin-bottom: 16px;
                label {
                    margin: 0;
                }
            }
            .recurring {
                label {
                    margin-bottom: 8px !important;
                }
            }
            .tolatcost {
                margin-top: 16px;
            }
        }
        .channels-wrapper {
            padding: 24px 0;
            .channel-wrapper {
                .available-slots {
                    .slots {
                        padding: 16px 40px 0;
                        background: none;
                        border: none;
                        .prev {
                            left: 4px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                        .next {
                            right: 4px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                        ul {
                            li {
                                width: 50%;
                                margin-bottom: 16px;
                                padding: 16px;
                                border: none;
                                &:nth-child(odd) {
                                    border-right: 1px solid #cecece;
                                }
                            }
                        }
                    }
                }
                .broadcast-slots {
                    .plan-wrapper {
                        margin-bottom: 16px;
                    }
                }
                .action {
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column-reverse;
                    .btn {
                        min-width: 100% !important;
                        margin-bottom: 16px;
                    }
                }
            }
        }
    }

    /* iPad Portrait */
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        .selected-broadcast-location {
            padding: 24px;
            .tolatcost {
                margin-top: 0;
            }
        }
        .channels-wrapper {
            padding: 24px 0;
            .channel-wrapper {
                .available-slots {
                    .slots {
                        padding: 0 56px;
                        .prev {
                            left: 12px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                        .next {
                            right: 12px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                        ul {
                            li {
                                width: 25%;
                                padding: 16px;
                                margin-bottom: 0;
                                border: none;
                                &:nth-child(odd) {
                                    border-right: 1px solid #cecece;
                                }
                            }
                        }
                    }
                }
                .broadcast-details {
                    .details {
                        padding: 16px;
                        h4 {
                            font-size: 18px;
                        }
                    }
                }
                .action {
                    padding: 40px;
                    margin-bottom: 56px;
                    .btn {
                        min-width: 250px !important;
                        margin-right: 20px;
                    }
                }
            }
        }
    }

    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
        .channels-wrapper {
            padding: 24px 0;
        }
    }
}
</style>
