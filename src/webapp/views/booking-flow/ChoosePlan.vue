<template>
    <div class="choose-plan">
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
                            <h5>{{startDate | formatDate('LL')}}</h5>
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
                            <h5 class="bold">£ 200.00</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="channels-wrapper">
                <div class="channel-wrapper" v-for="channel in channels" :key="channel._id">
                    <div class="available-slots">
                        <h5 class="mb8">Available Slots</h5>
                        <div class="slots">
                            <ul class="list-inline mb0">
                                <li v-for="slot in availableSlots" :key="slot._id" :class="{'active': slot.Active}">
                                    <h5>{{slot.Date | formatDate('ll')}}</h5>
                                    <h5 class="mb0">£ {{slot.Amount}}.00</h5>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="broadcast-details">
                        <h5 class="mb8">Broadcast Details</h5>
                        <div class="details">
                            <div class="row">
                                <div class="col-sm-4 text-center">
                                    <h5>Starting On</h5>
                                    <h5 class="bold">19th Sep 2019, Monday</h5>
                                </div>
                                <div class="col-sm-4 text-center"></div>
                                <div class="col-sm-4 text-center">
                                    <h5>Ending On</h5>
                                    <h5 class="bold">19th Sep 2019, Monday</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="broadcast-slots">
                        <h5 class="mb8">Choose Your Broadcast Slots</h5>
                        <div class="row">
                            <div class="col-sm-4" v-for="plan in channel.Plans" :key="plan._id">
                                <div class="plan">
                                    <div class="plan-name">
                                        <h5 class="mb0">{{plan.ChannelAdSchedule.AdSchedule.Name}}</h5>
                                        <p class="mb0">6am to 9am</p>
                                    </div>
                                    <div class="plan-amount">
                                        <h4>£{{plan.BaseAmount}}.00</h4>
                                        <p class="mb0">for 26 weeks</p>
                                    </div>
                                    <div class="features">
                                        <ul>
                                            <li>Played every Monday between 6am - 9am</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
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
            channels: [],
            availableSlots: [{
                _id: 1,
                Date: this.moment('17/09/2019', "DD/MM/YYYY"),
                Amount: 190,
                Active: false
            }, {
                _id: 2,
                Date: this.moment('18/09/2019', "DD/MM/YYYY"),
                Amount: 170,
                Active: false
            }, {
                _id: 3,
                Date: this.moment('19/09/2019', "DD/MM/YYYY"),
                Amount: 200,
                Active: true
            }, {
                _id: 4,
                Date: this.moment('20/09/2019', "DD/MM/YYYY"),
                Amount: 180,
                Active: false
            }, {
                _id: 5,
                Date: this.moment('21/09/2019', "DD/MM/YYYY"),
                Amount: 190,
                Active: false
            }],
            startDate: this.moment(this.$route.query.startdate, "DD/MM/YYYY"),
            adLength: this.$route.query.seconds
        }
    },
    async created() {
        try {
            let result = await instance.get('api/channel/nearbychannelplans?channel=' + this.$route.query.channel + '&seconds=' + this.$route.query.seconds);
            this.channels = result.data;
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err.data && err.data.message ? err.data.message: 'Some error occurred',
                type: 'error',
                confirmButtonColor: '#ff6500'
            });
        }
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
                        ul {
                            li {
                                width: 20%;
                                text-align: center;
                                padding: 10px;
                                border-right: 1px solid #ddd;
                                &:last-child{
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
                            padding: 8px;
                            ul {
                                li {
                                    font-size: 12px;
                                    color: #333;
                                    &:before {
                                        content: url('')
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
    }
</style>
