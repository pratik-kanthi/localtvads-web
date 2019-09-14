<template>
    <div class="choose-plan">
        <LoaderModal :showloader="loading" message="Loading..."></LoaderModal>
        <div class="selected-broadcast-location">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="broadcast-location">
                            <label>Broadcast Location</label>
                            <select v-model="channelSelected" @change="getAvailableSlotsByChannel">
                                <option :value="channel._id" v-for="channel in channels" :key="channel._id">{{channel.Name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-2">
                        <div class="broadcast-start">
                            <label>Broadcast Start</label>
                            <h5>{{moment(slotStartDate, 'YYYY-MM-DD').format('LL')}}</h5>
                        </div>
                    </div>
                    <div class="col-sm-2">
                        <div class="ad-length">
                            <label>Ad Length</label>
                            <select v-model="secondSelected">
                                <option v-for="(sec,key) in seconds" :key="key" :value="sec">{{sec}} Seconds</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-2">
                        <div class="broadcast-duration">
                            <label>Broadcast Duration</label>
                            <h5>6 months</h5>
                        </div>
                    </div>
                    <div class="col-sm-1">
                        <div class="recurring">
                            <label>Recurring</label>
                            <h5></h5>
                        </div>
                    </div>
                    <div class="col-sm-1">
                        <div class="tolatcost">
                            <label>Total Cost</label>
                            <h5 class="bold">{{selectedPlan.BaseAmount | currency}}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="channels-wrapper">
                <div class="channel-wrapper">
                    <div class="available-slots">
                        <h5 class="mb8">Available Slots</h5>
                        <div class="slots">
                            <button class="prev" :disabled="!checkStartDate" @click="getPrevSlots"><i class="material-icons">keyboard_arrow_left</i></button>
                            <ul class="list-inline mb0">
                                <li v-for="(slot,key) in availableSlots" :key="key"
                                    @click="selectSlot(key, slot)" :class="{'active': slotStartDate === key}">
                                    <h5>{{moment(key, 'YYYY-MM-DD').format('DD-MMM ddd')}}</h5>
                                    <h5 class="mb0">{{slot.Breakfast.BaseAmount | currency}}</h5>
                                </li>
                            </ul>
                            <button class="next" @click="getNextSlots"><i class="material-icons">keyboard_arrow_right</i></button>
                        </div>
                    </div>
                    <div class="broadcast-details">
                        <h5 class="mb8">Broadcast Details</h5>
                        <div class="details">
                            <div class="row">
                                <div class="col-sm-4 text-center">
                                    <h5>Starting On</h5>
                                    <h5 class="bold">{{moment(slotStartDate, 'YYYY-MM-DD').format('Do MMM YYYY,dddd')}}</h5>
                                </div>
                                <div class="col-sm-4 text-center">
                                    <hr />
                                    <img class="broadcast-img" src="@/assets/images/broadcast.svg" alt="">
                                </div>
                                <div class="col-sm-4 text-center">
                                    <h5>Ending On</h5>
                                    <h5 class="bold">{{slotEndDate}}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="broadcast-slots" v-if="selectedSlot">
                        <h5 class="mb8">Choose Your Broadcast Slots</h5>
                        <div class="row">
                            <div class="col-sm-4" v-for="plan in selectedSlot" :key="plan.Plan">
                                <div class="plan" :class="{'active-slot': selectedPlan.Plan === plan.Plan}">
                                    <div class="plan-name">
                                        <h5 class="mb0">{{plan.AdSchedule.Name}}</h5>
                                        <p class="mb0" v-if="plan.AdSchedule.Name === 'Breakfast'">6am to 9am</p>
                                        <p class="mb0" v-else-if="plan.AdSchedule.Name === 'Lunch Time'">11am to
                                            1pm</p>
                                        <p class="mb0" v-else>5pm to 9pm</p>
                                    </div>
                                    <div class="plan-amount">
                                        <h4>{{plan.BaseAmount | currency}}</h4>
                                        <p class="mb0">for 26 weeks</p>
                                    </div>
                                    <div class="features">
                                        <ul>
                                            <li>Played every Monday between 6am - 9am</li>
                                            <li>><span class="brand-primary">100,000</span> expected ad views over 6
                                                months
                                            </li>
                                            <li>=0.23 pence per view<br><span class="text-muted"> (53x cheaper per view than leafletting)</span>
                                            </li>
                                            <li>=8.67 per week <br><span class="text-muted">(75x chealer than 1/4 page in local newspaper)</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="selectplan">
                                        <button class="btn btn-primary btn-full" @click="selectPlan(plan)"
                                                :class="{'btn-active': selectedPlan.Plan === plan.Plan}">
                                            <span v-if="selectedPlan.Plan === plan.Plan">Selected</span>
                                            <span v-else>Choose this plan</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="action">
                        <center>
                            <button class="btn btn-danger btn-bordered">Cancel</button>
                            <button class="btn btn-primary" :disabled="!selectedPlan" @click="$emit('advanceToPayment')">
                                Proceed
                            </button>
                        </center>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import instance from '@/api';
    import LoaderModal from '@/webapp/common/modals/LoaderModal';

    export default {
        name: 'ChoosePlan',
        components: {LoaderModal},
        data() {
            return {
                availableSlots: {},
                channels: [],
                channelSelected: this.$route.query.channel,
                loading: false,
                seconds: [],
                secondSelected: this.$route.query.seconds,
                selectedSlot: {},
                selectedPlan: {},
                sliderEndDate: '',
                sliderStartDate: '',
                slotStartDate: this.$route.query.startdate,
                slotEndDate: this.moment(this.$route.query.startdate, 'YYYY-MM-DD').add(window.slotduration, 'days').format('Do MMM YYYY, dddd')
            }
        },
        methods: {
            async getAvailableSlots(isFirstTime) {
                let startDate = this.sliderStartDate ? this.sliderStartDate : this.slotStartDate;
                let endDate = this.sliderEndDate ? this.sliderEndDate : this.slotEndDate;
                try {
                    this.loading = true;
                    let result = await instance.get('api/channel/plans?channel=' + this.channelSelected + '&seconds=' + this.secondSelected + '&startdate=' + startDate + '&enddate=' + endDate);
                    this.availableSlots = result.data;
                    if (isFirstTime) {
                        this.selectedSlot = this.availableSlots[startDate];
                        let key = Object.keys(this.selectedSlot)[0];
                        this.selectedPlan = this.selectedSlot[key];
                    }
                    this.loading = false;
                } catch (err) {
                    this.loading = false;
                    this.$swal({
                        title: 'Error',
                        text: err.data && err.data.message ? err.data.message : 'Some error occurred',
                        type: 'error',
                        confirmButtonColor: '#ff6500'
                    });
                    throw(err);
                }
            },
            async getAllChannels() {
                try {
                    let result = await instance.get('api/channel/all');
                    this.channels = result.data;
                } catch (err) {
                    this.$swal({
                        title: 'Error',
                        text: err.data && err.data.message ? err.data.message : 'Some error occurred',
                        type: 'error',
                        confirmButtonColor: '#ff6500'
                    });
                    throw(err);
                }
            },
            getNextSlots() {
                this.sliderStartDate = this.moment(this.sliderEndDate, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
                this.sliderEndDate = this.moment(this.sliderEndDate, 'YYYY-MM-DD').add(5, 'days').format('YYYY-MM-DD');
                this.getAvailableSlots();
            },
            getPrevSlots() {

                this.sliderEndDate = this.moment(this.sliderStartDate, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
                this.sliderStartDate = this.moment(this.sliderStartDate, 'YYYY-MM-DD').subtract(5, 'days').format('YYYY-MM-DD');
                this.getAvailableSlots();
            },
            async getAvailableSlotsByChannel(isFirstTime) {
                try {
                    let result = await instance.get('api/channel/seconds?channel=' + this.channelSelected);
                    this.seconds = result.data;
                } catch (err) {
                    this.$swal({
                        title: "Error",
                        text: err.data && err.data.message ? err.data.message : 'Some error occurred',
                        type: "error"
                    });
                    throw(err);
                }
                if(this.seconds.indexOf(this.secondSelected) === -1) {
                    this.$swal({
                        title: 'Warning',
                        text: 'Ad length has changed according to the channel. Please select your desired Ad length',
                        type: 'warning',
                        confirmButtonColor: 'ButtonColor'
                    });
                    this.secondSelected = this.seconds[0];
                }
                this.getAvailableSlots(isFirstTime);

            },
            selectSlot(date, slot) {
                this.selectedSlot = slot;
                this.slotStartDate = date;
                this.slotEndDate = this.moment(date, 'YYYY-MM-DD').add(window.slotduration, 'days').format('Do MMM YYYY, dddd');
            },
            selectPlan(plan) {
                this.selectedPlan = plan;
                this.activePlan = plan.Plan;
            }
        },
        computed: {
            checkStartDate() {
                return this.moment(this.sliderStartDate, 'YYYY-MM-DD').diff(this.moment(), 'days') >= 1
            }
        },
        created() {
            this.sliderStartDate = this.$route.query.startdate;
            this.sliderEndDate = this.moment(this.$route.query.startdate, "YYYY-MM-DD").add(4, 'days').format("YYYY-MM-DD");
            this.getAllChannels();
            this.getAvailableSlotsByChannel(true);
        }
    }
</script>

<style lang="less" scoped>
    .choose-plan {
        label {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 0;
        }

        .selected-broadcast-location {
            padding: 16px;
            background-color: #FFF !important;

            h5 {
                font-weight: 500;
                margin-bottom: 8px;

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
                background-color: transparent;
                margin-bottom: 0px;
                height: 24px;
                text-transform: capitalize;
                font-weight: 500;
                font-size: 16px;
                color: #4c4c4c;
                background-image: url('../../../assets/images/select.png');
                background-repeat: no-repeat;
                background-size: 16px;
                background-position: right 12px center;
            }
        }

        .channels-wrapper {
            padding: 16px 80px;

            .channel-wrapper {
                .available-slots {
                    margin-bottom: 24px;
                    .slots {
                        padding: 0 64px;
                        border: 1px solid #DDD;
                        border-radius: 6px;
                        position: relative;

                        ul {
                            li {
                                width: 20%;
                                text-align: center;
                                padding: 10px;
                                border-right: 1px solid #ddd;

                                &:last-child {
                                    border-right: none;
                                }

                                h5 {
                                    margin-bottom: 8px;
                                    font-weight: 500;

                                    &:first-child {
                                        font-weight: 400;
                                        color: @brand-primary;
                                    }
                                }

                                &.active {
                                    background-color: @brand-primary;
                                    color: #FFF;

                                    h5 {
                                        color: #fff;
                                    }
                                }
                            }
                        }

                        .prev {
                            position: absolute;
                            top: 32%;
                            left: 16px;
                            border-radius: 50%;
                            border: 1px solid #DDD;
                            width: 30px;
                            height: 30px;
                            padding: 2px;
                            color: @brand-primary;

                        }

                        .prev.disabled,
                        .prev[disabled],
                        fieldset[disabled] .prev {
                            cursor: not-allowed;
                            .opacity(65);
                        }

                        .next {
                            position: absolute;
                            top: 32%;
                            right: 16px;
                            border-radius: 50%;
                            border: 1px solid #DDD;
                            width: 30px;
                            height: 30px;
                            padding: 2px;
                            color: @brand-primary;
                        }
                    }
                }

                .broadcast-details {
                    margin-bottom: 24px;
                    .details {
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 8px 40px;

                        h5 {
                            margin-bottom: 8px;
                            font-weight: 400;
                            &:last-child {
                                margin-bottom: 0;
                                font-size: 18px;
                            }
                        }
                        hr {
                            border-top: 3px solid #ccc;
                            margin-top: 36px;
                            margin-bottom: 0;
                        }
                        img.broadcast-img {
                            margin-top: -24px;
                            padding: 0 16px;
                            background-color: #f9f9f9;
                        }
                    }
                }

                .broadcast-slots {
                    .plan {
                        border: 1px solid @brand-primary;
                        text-align: center;
                        border-radius: 6px;
                        .opacity(50);
                        &.active-slot {
                            .box-shadow(0 0 8px 0 rgba(255, 101, 0, 0.5));
                            .opacity(100);
                        }
                        .plan-name {
                            padding: 20px;
                            border-bottom: 1px solid #ddd;

                            h5 {
                                font-weight: 500;
                                font-size: 24px;
                                color: @brand-primary;
                            }
                            p {
                                font-size: 18px;
                            }
                        }

                        .plan-amount {
                            padding: 16px;
                            border-bottom: 1px solid #ddd;

                            h4 {
                                font-weight: 700;
                                font-size: 32px;
                                margin-bottom: 4px;
                            }
                            p {
                                font-size: 18px;
                            }
                        }

                        .features {
                            padding: 16px 40px;

                            ul {
                                li {
                                    font-size: 13px;
                                    color: #333;
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
                                        height: 20px;
                                        width: 20px;
                                        left: 0;
                                        top: 4px;
                                        background-size: cover;
                                        position: absolute;
                                        background-repeat: no-repeat;
                                    }
                                }
                            }
                        }

                        .selectplan {
                            padding: 0 40px 24px;
                            opacity: 1;
                            .btn-active {
                                background-color: @brand-secondary;
                                border: none;
                            }
                        }
                    }
                }

                .action {
                    padding: 40px;
                    margin-bottom: 56px;

                    .btn {
                        min-width: 220px !important;
                    }
                }
            }
        }
    }
</style>