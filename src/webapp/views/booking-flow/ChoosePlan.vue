<template>
    <div class="choose-plan">
        <div class="container">
            <h3 class="mt64 page-heading">Step 1 : Create your plan</h3>

            <div class="mt32">
                <div class="t-xl">Choose a plan length</div>
                <div class="channel-plans-wrapper d-flex mt8 justify-content-start">
                    <div class="channel-plan" v-for="(plan, key) in channelPlans" :key="key" :class="$parent.selectedPlan._id == plan._id ? 'active' : ''" @click="selectPlan(plan)">
                        <span>{{ plan.ProductLength.Name }}</span>
                    </div>
                </div>
            </div>
            <div v-if="$parent.selectedPlan">
                <div class="d-flex justify-content-between mt32">
                    <div>
                        <div class="t-xl">How many times do you want your ad to air in a day?</div>
                        <div class="t-l">This is the total number of ad runs per day, you can select your ad to be aired across multiple slots.</div>

                        <div class="counter d-flex align-items-center mt24">
                            <button @click="decrement()" :disabled="$parent.clientAdPlan.ChannelProduct.ChannelSlots.length < 2" class="btn btn-primary btn-circle">-</button>
                            <div class="quantity t-l p16">{{ $parent.clientAdPlan.ChannelProduct.ChannelSlots.length }}</div>
                            <button @click="increment()" :disabled="$parent.clientAdPlan.ChannelProduct.ChannelSlots.length > 2" class="btn btn-primary btn-circle">+</button>
                        </div>
                    </div>
                </div>
                <div class="mt32">
                    <div class="t-xl">Select you ad slots</div>
                    <div class="t-l">Select the slots for you ad.</div>
                </div>
                <div class="slot-container mt24" :key="slotsKey">
                    <div class="slot  rounded p16 mt8" v-for="(channelSlot, slotIndex) in $parent.clientAdPlan.ChannelProduct.ChannelSlots" :key="slotIndex">
                        <div class="row">
                            <div class="mt8 col-sm-1">Slot {{ slotIndex + 1 }}</div>
                            <div class="mt8 col-sm-4">
                                <b-form-select @change="selectSlot($event, slotIndex)">
                                    <b-form-select-option value="null" disabled>Select Your Slot</b-form-select-option>
                                    <b-form-select-option v-for="(slotData, key) in $parent.selectedPlan.ChannelSlots" :key="key" :value="slotData">
                                        <p class="slot-name">{{ slotData.Slot.Name }}</p>
                                    </b-form-select-option>
                                </b-form-select>
                            </div>
                            <div class="col-sm-3">
                                <div class="mt8 slot-details" v-if="channelSlot.Slot">
                                    <div class="t-s brand-primary">{{ 'Played on selected days between ' + channelSlot.Slot.StartTime + '-' + channelSlot.Slot.EndTime }}</div>
                                </div>
                            </div>
                            <div class="mt8 col-sm-3" v-if="channelSlot.Slot">
                                <div class="slot-price">You will be charged {{ (channelSlot.RatePerSecond * channelSlot.Duration * $parent.daysSelected.length) | currency }} <span class="duration t-m thin">/ week</span> from the day we go live with the ad.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pricing-info mt32 p24">
                    <div class="row">
                        <div class="col-md-6" v-if="$parent.clientAdPlan && $parent.clientAdPlan.ChannelProduct.ProductLength">
                            <div class="t-xl">Plan duration : {{ $parent.clientAdPlan.ChannelProduct.ProductLength.Duration }} months</div>
                            <div v-for="(saving, key) in savings" :key="key" class="t-l brand-primary">You could save {{ saving.Amount | currency }} on {{ saving.Plan.ProductLength.Name }} plan.</div>
                        </div>
                        <div class="col-md-6">
                            <div class="mt16 brand-primary t-xl d-flex justify-content-start justify-content-md-end ">
                                <div>Total Payable:</div>
                                <div>&nbsp;{{ planTotal | currency }} / week</div>
                            </div>
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

export default {
    name: 'ChoosePlan',
    data() {
        return {
            slotsKey: 0,
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
            clientAdPlan: this.$parent.clientAdPlan,
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
            let adPlan = { ...this.$parent.clientAdPlan };
            adPlan.ChannelProduct.ChannelSlots.push({
                Slot: null,
                RatePerSecond: null,
                Duration: null
            });
            this.$parent.clientAdPlan = adPlan;
        },
        selectSlot(slot, index) {
            let adPlan = { ...this.$parent.clientAdPlan };
            adPlan.ChannelProduct.ChannelSlots[index] = slot;
            this.$parent.clientAdPlan = adPlan;
        },
        decrement() {
            let adPlan = { ...this.$parent.clientAdPlan };
            adPlan.ChannelProduct.ChannelSlots.pop();
            this.$parent.clientAdPlan = adPlan;
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
            this.$parent.clientAdPlan.PlanAmount = this.planTotal;
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
                this.$parent.selectedPlan = {
                    ...this.channelPlans.find(function(item) {
                        return item.ProductLength.Name == '3 Months';
                    })
                };
                this.$parent.clientAdPlan.ChannelProduct = {
                    ProductLength: this.$parent.selectedPlan.ProductLength,
                    ChannelSlots: [
                        {
                            Slot: null,
                            RatePerSecond: null,
                            Duration: null
                        }
                    ]
                };
                this.$parent.isLoading = false;
                this.clientAdPlan = this.$parent.clientAdPlan;
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
        selectPlan(plan) {
            this.$parent.selectedPlan = plan;
            this.$parent.clientAdPlan.ChannelProduct = {
                ProductLength: this.$parent.selectedPlan.ProductLength,
                ChannelSlots: [
                    {
                        Slot: null,
                        RatePerSecond: null,
                        Duration: null
                    }
                ]
            };
            this.slotsKey++;
        }
    },
    computed: {
        savings() {
            if (!this.planTotal) return [];
            let savings = [];
            let plans = this.channelPlans.filter(item => {
                return item._id != this.$parent.selectedPlan._id;
            });
            for (let i = 0, len = plans.length; i < len; i++) {
                let totalAmount = 0;
                for (let j = 0, leng = this.$parent.clientAdPlan.ChannelProduct.ChannelSlots.length; j < leng; j++) {
                    let planSlot = plans[i].ChannelSlots.find(item => {
                        return this.$parent.clientAdPlan.ChannelProduct.ChannelSlots[j].Slot && item.Slot._id == this.$parent.clientAdPlan.ChannelProduct.ChannelSlots[j].Slot._id;
                    });
                    if (planSlot) totalAmount += planSlot.RatePerSecond * planSlot.Duration * this.$parent.daysSelected.length;
                }
                if (totalAmount != 0 && totalAmount < this.planTotal) {
                    savings.push({ Plan: plans[i], Amount: this.planTotal - totalAmount });
                }
            }
            return savings;
        },
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
            this.$parent.clientAdPlan.ChannelProduct.ChannelSlots.map(item => {
                if (item.Slot) {
                    total += item.RatePerSecond * item.Duration * this.$parent.daysSelected.length;
                }
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
        padding: 8px 48px;
        border: 1px solid #eee;
        font-size: 14px;
        margin-right: 8px;
        cursor: pointer;
        &.active {
            color: $brand-primary;
            border: 1px solid $brand-primary;
        }

        @include media-breakpoint-up(md) {
            margin-right: 16px;
            padding: 8px 64px;
            font-size: 18px;
        }
    }
}
.choose-plan {
    .slot-container {
        .slot {
            box-shadow: 0 0 8px 0 rgba(100, 100, 100, 0.1);
            border: 1px solid rgba(100, 100, 100, 0.1);
        }
    }
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
