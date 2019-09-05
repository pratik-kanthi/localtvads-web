<template>
    <div class="choose-plan">
        <div class="channel-wrapper">
            <div class="container">
                <div class="selected-channel">
                    <div class="row">
                        <div class="col-sm-8">
                            <div class="channel-info">
                                <h5 class="brand-primary mb0 lh40 bold">West Midland TV - Freeview 7, Sky Guide 117, Virgin Media 159</h5>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group mb0">
                                <input type="text" class="form-control mb0" placeholder="Total Cost">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="slots-wrapper">
            <div class="container">
                <div class="slot-wrapper" v-for="channel in channels" :key="channel._id">
                    <h5 class="mb0 lh40">{{channel.Name}}</h5>
                    <div class="plan-slider"></div>
                    <div class="channel-plans">
                        <div class="date-range">
                            <div class="start-date">
                                <div class="mb0"><small>Starting Mon</small></div>
                                <h5 class="bold">{{$route.query.startdate}}</h5>
                            </div>
                            <div class="divider mb16">
                                <div class="mb8 text-center"><small>1 slot / week for 6 Months</small></div>
                                <div class="line"></div>
                            </div>
                            <div class="end-date">
                                <div class="mb0"><small>Ending Mon</small></div>
                                <h5 class="bold">{{$route.query.startdate}}</h5>
                            </div>
                        </div>
                        <div class="plan-list">
                            <div class="plan" v-for="plan in channel.Plans" :key="plan._id">
                                <div class="plan-info">
                                    <h5 class="brand-primary plan-title">{{plan.AdSchedule.Name}}</h5>
                                    <div class="plan-details">
                                        <ul>
                                            <li><span class="brand-primary bold">> {{plan.AdSchedule.ExpectedAdViews}}</span> expected ad views over 6 months</li>
                                        </ul>
                                    </div>
                                    <div class="plan-amount">
                                        <h4 class="brand-primary text-center mb0">£ {{plan.BaseAmount}}</h4>
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
            channels: []
        }
    },
    async created() {
        try {
            let result = await instance.get('api/channel/nearbychannelplans?channel=' + this.$route.query.channel + '&seconds=' + this.$route.query.seconds);
            this.channels = result.data;
        } catch (err) {
            this.$swal({
                title: "Some error occured",
                text: 'Some error has been occured.',
                type: "error",
                confirmButtonColor: '#ff6500'
            });
        }
    },
}
</script>

<style lang="less" scoped>
    .choose-plan {
        .channel-wrapper {
            background-color: #FFF !important;
            .selected-channel {
                padding: 8px 0;
                .channel-info {
                    line-height: 16px;
                }
            }
        }
        .slots-wrapper {
            .slot-wrapper {
                padding: 16px 80px;
                .plan-slider {
                    min-height: 56px;
                    border: 1px solid #DDD;
                    border-radius: 6px;
                    background-color: #fff;
                }
                .channel-plans {
                    margin: 16px 80px;
                    border: 1px solid @brand-primary;
                    padding: 16px;
                    background-color: #fff;
                    .date-range {
                        .start-date {
                            width: 25%;
                            display: inline-block;
                            text-align: center;
                        }
                        .divider {
                            width: 50%;
                            display: inline-block;
                            vertical-align: top;
                            .line {
                                height: 1px;
                                background: #ddd;
                                margin-bottom: 8px;
                            }
                        }
                        .end-date {
                            width: 25%;
                            display: inline-block;
                            text-align: center;
                        }
                    }
                    .plan-list {
                        .plan {
                            display: inline-block;
                            width: 33.33%;
                            .plan-info {
                                margin-right: 16px;
                                border: 1px solid #ddd;
                                border-top: 3px solid @brand-primary;
                                
                                .plan-title {
                                    border-bottom: 1px dashed #ddd;
                                    padding: 16px;
                                    margin: 0;
                                }
                                .plan-details {
                                    padding: 16px;
                                    ul {
                                        margin: 0;
                                        li {
                                            font-size: 12px;
                                            line-height: 16px;
                                            margin-bottom: 16px;
                                            &:last-child {
                                                margin: 0;
                                            }
                                        }
                                    }
                                }
                                .plan-amount {
                                    background: #DDD;
                                    padding: 16px;
                                    h4 {
                                        font-weight: 500;
                                    }
                                }
                            }
                            &:last-child {
                                .plan-info {
                                    margin-right: 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
