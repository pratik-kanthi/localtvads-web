<template>
    <div class="choose-plan">
        <LoaderModal :showloader="loading" message="Loading..."></LoaderModal>
        <div class="selected-broadcast-location">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="broadcast-location">
                            <label>Broadcast Location</label>
                            <h5 v-if="channels">
                                <span class="name">West Midlands TV</span>
                                <span class="address">(Freeview 7, Skyguide, Virgin Media)</span>
                            </h5>
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
                            <h5>{{adLength}} seconds</h5>
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
                            <h5 class="bold">£ {{selectedPlan.BaseAmount}}.00</h5>
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
                            <button class="prev" :disabled="!checkStartDate"
                                    @click="getAvailableSlots(moment(sliderStartDate,'YYYY-MM-DD').subtract(5,'days').format('YYYY-MM-DD'), moment(sliderStartDate,'YYYY-MM-DD').subtract(1,'days').format('YYYY-MM-DD'))">
                                <i class="material-icons">keyboard_arrow_left</i></button>
                            <ul class="list-inline mb0">
                                <li v-for="(slot,key) in availableSlots" :key="slot.Breakfast._id"
                                    @click="selectSlot(key, slot)" :class="{'active': selectedSlot === slot}">
                                    <h5>{{moment(key, 'YYYY-MM-DD').format('DD-MMM ddd')}}</h5>
                                    <h5 class="mb0">£{{slot.Breakfast.BaseAmount}}.00</h5>
                                </li>
                            </ul>
                            <button class="next"
                                    @click="getAvailableSlots(moment(sliderEndDate,'YYYY-MM-DD').add('days', 1).format('YYYY-MM-DD'), moment(sliderEndDate,'YYYY-MM-DD').add('days', 5).format('YYYY-MM-DD'))">
                                <i class="material-icons">keyboard_arrow_right</i></button>
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
                                <div class="col-sm-4 text-center"></div>
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
                                <div class="plan">
                                    <div class="plan-name">
                                        <h5 class="mb0">{{plan.AdSchedule.Name}}</h5>
                                        <p class="mb0" v-if="plan.AdSchedule.Name === 'Breakfast'">6am to 9am</p>
                                        <p class="mb0" v-else-if="plan.AdSchedule.Name === 'Lunch Time'">11am to
                                            1pm</p>
                                        <p class="mb0" v-else>5pm to 9pm</p>
                                    </div>
                                    <div class="plan-amount">
                                        <h4>£{{plan.BaseAmount}}.00</h4>
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
                                                :class="{'btn-active': activePlan === plan.Plan}">
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
                activePlan: '',
                adLength: this.$route.query.seconds,
                availableSlots: {},
                channels: [],
                loading: false,
                selectedSlot: {},
                selectedPlan: {},
                sliderEndDate: '',
                sliderStartDate: '',
                slotStartDate: this.$route.query.startdate,
                slotEndDate: this.moment(this.$route.query.startdate, 'YYYY-MM-YY').add(window.slotduration, 'days').format('Do MMM YYYY, dddd')
            }
        },
        methods: {
            async getAvailableSlots(startDate, endDate, isFirstTime) {
                if (!startDate || !this.$route.query.channel || !this.$route.query.seconds) {
                    this.$router.push('/');
                    return;
                }
                try {
                    this.loading = true;
                    let result = await instance.get('api/channel/plans?channel=' + this.$route.query.channel + '&seconds=' + this.$route.query.seconds + '&startdate=' + startDate + '&enddate=' + endDate);
                    this.availableSlots = result.data;
                    this.sliderStartDate = startDate;
                    this.sliderEndDate = endDate;
                    if (isFirstTime) {
                        this.selectedSlot = this.availableSlots[startDate];
                        let key = Object.keys(this.selectedSlot)[0];
                        this.selectedPlan = this.selectedSlot[key];
                        this.activePlan = this.selectedSlot[key].Plan;
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
            this.sliderEndDate = this.moment(this.$route.query.startdate, "YYYY-MM-DD").add('days', 4).format("YYYY-MM-DD");
            this.getAvailableSlots(this.sliderStartDate, this.sliderEndDate, true);
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
                            top: 30%;
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
                            top: 30%;
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

                            &:last-child {
                                margin-bottom: 0;
                            }
                        }
                    }
                }

                .broadcast-slots {
                    .plan {
                        border: 1px solid @brand-primary;
                        text-align: center;

                        .plan-name {
                            padding: 8px;
                            border-bottom: 1px solid #ddd;

                            h5 {
                                font-weight: 500;
                                color: @brand-primary;
                            }
                        }

                        .plan-amount {
                            padding: 8px;
                            border-bottom: 1px solid #ddd;

                            h4 {
                                font-weight: 700;
                                margin-bottom: 0;
                            }
                        }

                        .features {
                            padding: 8px 40px;

                            ul {
                                li {
                                    font-size: 13px;
                                    color: #333;
                                    text-align: left;
                                    margin-bottom: 16px;
                                    line-height: 20px;
                                    cursor: pointer;

                                    &:last-child {
                                        margin-bottom: 0;
                                    }

                                    &:before {
                                        content: '';
                                        background-image: url('../../../assets/images/tick.svg');
                                    }
                                }
                            }
                        }

                        .selectplan {
                            padding: 0 40px 16px;

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

        .payment-wrapper {
            padding: 16px 80px;

            .payment {
                border: 1px solid #ddd;
                background-color: #fff;
                padding: 16px;
                border-radius: 6px;

                .card-details {
                    .header {
                        border: 1px solid #0C6CD4;
                        padding: 8px 16px;
                        border-radius: 2px;

                        h5 {
                            line-height: 16px;
                            font-size: 14px;
                        }

                        p {
                            font-size: 13px;
                            line-height: 16px;
                        }
                    }

                    .body {
                        border: 1px solid #0C6CD4;
                        border-radius: 2px;
                        padding: 16px;

                        .form {
                            label {
                                font-size: 14px;
                                font-weight: 300;
                            }

                            .button {
                                span {
                                    font-weight: 8px;
                                }
                            }
                        }
                    }
                }

                .booking-details {
                    border-left: 1px solid #ccc;
                    padding: 0 24px;

                    .content {
                        margin-bottom: 24px;

                        .booking-items {
                            .title {
                                font-size: 14px !important;
                                margin-bottom: 8px;
                                color: @base;
                            }
                        }

                        .recurring {
                            h6 {
                                font-size: 14px !important;
                                color: #4c4c4c;
                                position: relative;
                                padding-left: 28px;

                                i {
                                    background: @brand-primary;
                                    color: white;
                                    font-size: 16px;
                                    position: absolute;
                                    padding: 2px;
                                    left: 0;
                                    top: 1px;
                                    border-radius: 3px;
                                }
                            }
                        }

                        border-bottom: 2px solid #333;
                    }

                    .total {
                        h5 {
                            font-weight: 500;

                            .amount {
                                text-align: right !important;
                            }
                        }
                    }
                }
            }
        }
    }
</style>