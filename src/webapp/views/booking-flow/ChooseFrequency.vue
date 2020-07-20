<template>
    <div class="choose-plan bg--grey">
        <div class="selected-broadcast-location">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4 col-lg-3">
                        <div class="broadcast-location">
                            <label>Broadcast Location</label>
                            <select v-model="channelSelected" @change="getAvailableSlotsByChannel(false)">
                                <option :value="channel._id" v-for="channel in channels" :key="channel._id" :disabled="channel.Status !== 'LIVE'">{{ channel.Name + (channel.Status !== 'LIVE' ? ' (Coming Soon)' : '') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4 col-lg-3">
                        <div class="broadcast-start">
                            <label>Broadcast Start</label>
                            <h5>{{ moment(slotStartDate, 'YYYY-MM-DD').format('MMMM D, YYYY') }}</h5>
                        </div>
                    </div>
                    <div class="col-md-4 col-lg-2">
                        <div class="ad-length">
                            <label>Ad Length</label>
                            <select v-model="secondSelected" @change="getAvailableSlotsByChannel(false)">
                                <option v-for="(sec, key) in seconds" :key="key" :value="sec">{{ sec }} Seconds</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4 col-lg-2">
                        <div class="broadcast-duration">
                            <label>Broadcast Duration</label>
                            <h5>6 months</h5>
                        </div>
                    </div>
                    <!-- <div class="col-md-4 col-lg-1">
                        <div class="recurring form-group mb0">
                            <label for="recurring" class="control-label">Recurring</label>
                            <input class="check" type="checkbox" name="recurring" id="recurring" v-model="isRenewal" />
                            <label class="check-label" for="recurring"></label>
                            <br class="clearfix">
                        </div>
                    </div> -->
                    <div class="col-md-4 col-lg-2">
                        <div class="tolatcost">
                            <label>Total Cost</label>
                            <h5 class="bold" v-if="selectedPlan">{{ selectedPlan.TotalAmount | currency }}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="channels-wrapper">
                <div class="channel-wrapper">
                    <div class="available-slots">
                        <h5 class="label">Available Slots</h5>
                        <div class="slots">
                            <button class="prev" :disabled="!checkStartDate" @click="getPrevSlots">
                                <i class="material-icons">keyboard_arrow_left</i>
                            </button>
                            <ul>
                                <li v-for="(slot, key) in availableSlots" :key="key" @click="selectSlot(key, slot)" :class="{ active: slotStartDate === key }">
                                    <h5 class="date">{{ moment(key, 'YYYY-MM-DD').format('DD-MMM ddd') }}</h5>
                                    <h4 class="amount" v-if="Object.keys(slot).length > 0">{{ (slot[Object.keys(slot)[0]].TotalAmount / (getTotalSlotDuration / 7)) | currency }}<span class="t-s"> / week</span></h4>
                                    <h4 class="amount" v-else>-</h4>
                                </li>
                            </ul>
                            <button class="next" @click="getNextSlots">
                                <i class="material-icons">keyboard_arrow_right</i>
                            </button>
                        </div>
                    </div>
                    <div class="broadcast-details">
                        <h5 class="label">Broadcast Details</h5>
                        <div class="details">
                            <div class="row">
                                <div class="col-sm-4 text-center">
                                    <h5>Starting On</h5>
                                    <h4 class="bold">{{ moment(slotStartDate, 'YYYY-MM-DD').format('Do MMM YYYY, dddd') }}</h4>
                                </div>
                                <div class="col-sm-4 text-center">
                                    <hr />
                                    <img class="broadcast-img" src="@/assets/images/broadcast.svg" alt="" />
                                </div>
                                <div class="col-sm-4 text-center">
                                    <h5>Ending On</h5>
                                    <h4 class="bold">{{ moment(slotEndDate, 'YYYY-MM-DD').format('Do MMM YYYY, dddd') }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="broadcast-slots" v-if="selectedSlot">
                        <h5 class="label">Choose Your Plan</h5>
                        <div class="row d-flex justify-content-center" v-if="Object.keys(selectedSlot).length > 0">
                            <div class="col-sm-6 col-lg-4 plan-wrapper" v-for="plan in selectedSlot" :key="plan.Plan">
                                <div class="plan" :class="{ 'active-slot': selectedPlan.Plan === plan.Plan }">
                                    <div class="plan-name">
                                        <h5>{{ plan.AdSchedule.Name }}</h5>
                                        <p class="timing">{{ plan.AdSchedule.StartTime }} to {{ plan.AdSchedule.EndTime }}</p>
                                    </div>
                                    <div class="plan-amount">
                                        <h4 class="amount">
                                            {{ (plan.TotalAmount / (getTotalSlotDuration / 7)) | currency }}<span class="duration t-m thin">/ week</span>
                                            <span v-if="plan.TotalAmountWithoutDiscount !== plan.TotalAmount" class="without-discount t-s brand-primary strike-through">{{ (plan.TotalAmountWithoutDiscount / (getTotalSlotDuration / 7)) | currency }}</span>
                                        </h4>
                                        <p class="weeks">
                                            <span class="brand-primary">{{ plan.TotalAmount | currency }}</span> for {{ getTotalSlotDuration / 7 }} weeks
                                        </p>
                                    </div>
                                    <div class="features">
                                        <ul class="mb8">
                                            <li class="medium">Played every {{ moment(slotStartDate, 'YYYY-MM-DD').format('dddd') }} between {{ plan.AdSchedule.StartTime }} - {{ plan.AdSchedule.EndTime }}</li>
                                            <li v-if="plan.ViewershipCount">
                                                <span class="brand-primary bold">>{{ plan.ViewershipCount | formatValue(0) }}</span> expected ad views over 6 months
                                            </li>
                                            <li v-if="plan.ViewershipCount">
                                                <span class="t-l medium">={{ ((plan.TotalAmount / plan.ViewershipCount) * 100) | formatValue(2) }} pence</span> per view<br />
                                                <span class="text-muted italic">(53x cheaper per view than leafletting)</span>
                                            </li>
                                            <li>
                                                <span class="t-l medium">={{ (plan.TotalAmount / (getTotalSlotDuration / 7)) | currency }}</span> per week <br />
                                                <span class="text-muted italic">(75x cheaper than 1/4 page in local newspaper)</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="selectplan">
                                        <button class="btn btn-primary btn-full" @click="selectPlan(plan)" :class="{ 'btn-active': selectedPlan.Plan === plan.Plan }">
                                            <span v-if="selectedPlan.Plan === plan.Plan">Selected</span>
                                            <span v-else>Choose this plan</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            There are no plans available for this date. Please choose another date to book your slot.
                        </div>
                    </div>
                    <div class="action" v-if="selectedPlan">
                        <button class="btn btn-danger border" @click="cancel">Cancel</button>
                        <button class="btn btn-primary" @click="goToPayment">
                            Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import instance from '@/api';

export default {
    name: 'ChoosePlan',
    data() {
        return {
            availableSlots: {},
            channels: [],
            channelSelected: this.$route.query.channel,
            isRenewal: false,
            seconds: [],
            secondSelected: this.$route.query.seconds,
            selectedSlot: {},
            selectedPlan: {},
            sliderEndDate: '',
            sliderStartDate: '',
            slotStartDate: this.$route.query.startdate,
            slotEndDate: this.moment(this.$route.query.startdate, 'YYYY-MM-DD').add(window.slotduration, 'days'),
            taxes: []
        };
    },
    methods: {
        cancel() {
            this.$router.push('/', () => {});
        },
        changeQueryParams() {
            this.$router.replace({ name: 'BookingFlow', query: { channel: this.channelSelected, seconds: this.secondSelected, startdate: this.slotStartDate } });
        },
        async getAvailableSlots(isFirstTime) {
            this.$parent.isLoading = true;
            let startDate = this.sliderStartDate ? this.sliderStartDate : this.slotStartDate;
            let endDate = this.sliderEndDate ? this.sliderEndDate : this.slotEndDate;
            try {
                let result = await instance.get('api/channel/plan?channel=' + this.channelSelected + '&seconds=' + this.secondSelected + '&startdate=' + startDate + '&enddate=' + endDate);
                this.availableSlots = result.data.plans;
                this.taxes = result.data.taxes;
                if (isFirstTime) {
                    this.selectedSlot = this.availableSlots[startDate];
                    let key = Object.keys(this.selectedSlot)[0];
                    this.selectedPlan = this.selectedSlot[key];
                }
                this.$parent.isLoading = false;
            } catch (err) {
                this.$parent.isLoading = false;
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        async getAllChannels() {
            try {
                let result = await instance.get('api/channel/all');
                this.channels = result.data;
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        getNextSlots() {
            this.sliderStartDate = this.moment(this.sliderEndDate, 'YYYY-MM-DD')
                .add(1, 'days')
                .format('YYYY-MM-DD');
            this.sliderEndDate = this.moment(this.sliderEndDate, 'YYYY-MM-DD')
                .add(4, 'days')
                .format('YYYY-MM-DD');
            this.getAvailableSlots();
        },
        getPrevSlots() {
            if (this.moment() > this.moment(this.sliderStartDate, 'YYYY-MM-DD').subtract(4, 'days')) {
                this.sliderEndDate = this.moment()
                    .add(3, 'days')
                    .format('YYYY-MM-DD');
                this.sliderStartDate = this.moment().format('YYYY-MM-DD');
            } else {
                this.sliderEndDate = this.moment(this.sliderStartDate, 'YYYY-MM-DD')
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD');
                this.sliderStartDate = this.moment(this.sliderStartDate, 'YYYY-MM-DD')
                    .subtract(4, 'days')
                    .format('YYYY-MM-DD');
            }
            this.getAvailableSlots();
        },
        goToPayment() {
            this.$parent.selectedPlan = {
                channel: this.channelSelected,
                broadcastLocation: this.channels.find(channel => this.channelSelected === channel._id),
                broadcastSlot: this.selectedPlan.AdSchedule.Name,
                adStartTime: this.selectedPlan.AdSchedule.StartTime,
                adEndTime: this.selectedPlan.AdSchedule.EndTime,
                adSchedule: this.selectedPlan.AdSchedule._id,
                broadcastStartDate: this.slotStartDate,
                broadcastEndDate: this.slotEndDate,
                adLength: this.secondSelected,
                broadcastDuration: '6 months',
                totalAmount: this.selectedPlan ? this.selectedPlan.TotalAmount : '',
                offerDiscount: this.selectedPlan ? this.selectedPlan.OfferDiscount : '',
                plan: this.selectedPlan ? this.selectedPlan.Plan : '',
                isRenewal: this.isRenewal,
                baseAmount: this.selectedPlan ? this.selectedPlan.BaseAmount - this.selectedPlan.OfferDiscount : '',
                taxes: this.taxes
            };
            this.$emit('advanceToPayment');
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
            if (this.seconds.indexOf(parseInt(this.secondSelected)) === -1) {
                this.$swal({
                    title: 'Warning',
                    text: 'Ad length has changed according to the channel. Please select your desired Ad length',
                    type: 'warning',
                    confirmButtonColor: '#ff6500'
                });
                this.secondSelected = this.seconds[0];
            }
            this.getAvailableSlots(isFirstTime);
        },
        selectSlot(date, slot) {
            this.selectedSlot = slot;
            this.slotStartDate = date;
            this.slotEndDate = this.moment(date, 'YYYY-MM-DD').add(window.slotduration, 'days');
            let key = Object.keys(this.selectedSlot)[0];
            this.selectedPlan = this.selectedSlot[key];
            this.changeQueryParams();
        },
        selectPlan(plan) {
            this.selectedPlan = plan;
        }
    },
    computed: {
        checkStartDate() {
            return this.moment(this.sliderStartDate, 'YYYY-MM-DD').diff(this.moment(), 'days') >= 1;
        },
        getTotalSlotDuration() {
            return window.slotduration;
        }
    },
    created() {
        if (!this.$route.query.channel || !this.$route.query.seconds || !this.$route.query.startdate) {
            this.$router.push('/', () => {});
        } else {
            this.$parent.isLoading = true;
            this.sliderStartDate = this.$route.query.startdate;
            this.sliderEndDate = this.moment(this.$route.query.startdate, 'YYYY-MM-DD')
                .add(3, 'days')
                .format('YYYY-MM-DD');
            this.getAllChannels();
            this.getAvailableSlotsByChannel(true);
        }
    }
};
</script>

<style lang="scss" scoped>
.choose-plan {
    label {
        font-family: $font-family-heading;
        color: #acacac;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
        display: block;
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
