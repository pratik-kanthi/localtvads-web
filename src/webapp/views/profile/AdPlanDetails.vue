<template>
    <div class="container" v-if="clientAdPlan">
        <h3
            class="brand-secondary mt64"
        >{{ clientAdPlan.Channel.Name }} - {{ clientAdPlan.ChannelProduct.ProductLength.Name }}</h3>
        <div :class="getStatusClass(clientAdPlan.Status)" class="t-l mb48">{{ clientAdPlan.Status }}</div>
        <div>
            <b-tabs content-class="mt-3">
                <b-tab title="Plan Information" active>
                    <div class="row mt48 mb48">
                        <div class="plan-info col-md-4">
                            <div class="t-l black">Channel</div>
                            <div class="t-l">{{ clientAdPlan.Channel.Name }}</div>
                        </div>
                        <div class="plan-info col-md-4">
                            <div class="t-l black">Plan Duration</div>
                            <div
                                class="t-l"
                            >{{ clientAdPlan.ChannelProduct.ProductLength.Duration }} months</div>
                        </div>
                        <div class="plan-info col-md-4">
                            <div class="t-l black">Booked date</div>
                            <div
                                class="t-l"
                            >{{ clientAdPlan.BookedDate | formatDate('DD MMM YYYY') }}</div>
                        </div>
                    </div>

                    <div class="row mt48 mb48">
                        <div class="col-md-4">
                            <div class="t-l black">Start Date</div>
                            <div
                                v-if="clientAdPlan.StartDate"
                                class="t-l"
                            >{{ clientAdPlan.StartDate | formatDate('DD MMM YYYY') }}</div>
                            <div v-else class="brand-primary t-s">
                                The start date for your ad broadcast
                                <br />will be available once your ad is approved
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="t-l black">Slots Selected</div>
                            <div>
                                <div
                                    class
                                    v-for="(slot, key) in clientAdPlan.ChannelProduct.ChannelSlots"
                                    :key="key"
                                >
                                    <div
                                        class="t-l"
                                    >{{ slot.Slot.Name }} ( {{ slot.Slot.StartTime }} - {{ slot.Slot.EndTime }})</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="t-l black">Weekly Schedule</div>
                            <WeekDays mode="table" :value="clientAdPlan.Days"></WeekDays>
                        </div>
                    </div>

                    <hr />
                    <div class="row mt48 mb48">
                        <div class="col-md-4">
                            <div v-if="clientAdPlan.Addons">
                                <div class="t-l black">Add Ons Purchased</div>
                                <div
                                    v-for="(addon, key) in clientAdPlan.Addons"
                                    :key="key"
                                    class="plan-addon"
                                >
                                    <div class="t-l">{{ addon.Name }}</div>
                                    <div class="t-m mt8 brand-primary">Features:</div>
                                    <div
                                        class="t-s"
                                        v-for="(benefit, bkey) in addon.Benefits"
                                        :key="bkey"
                                    >{{ benefit }}</div>
                                    <div v-if="addon.IsUploadRequired">
                                        <div
                                            class="t-s italic brand-primary"
                                        >This add on requires you to upload your videos and images</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />

                    <div class="row mt48 mb48">
                        <div class="col-md-6">
                            <div class="payment-info">
                                <div class="t-l black">Payment Information</div>
                                <div class="mt48 shadow-sm p24">
                                    <div class="row">
                                        <div class="col-md-8 col-6">
                                            <div class="brand-primary t-l">Channel Ad Plan</div>
                                        </div>
                                        <div class="col-md-4 col-6">
                                            <div
                                                class="black text-right"
                                            >{{ clientAdPlan.WeeklyAmount | currency }}/week</div>
                                        </div>

                                        <div class="col-md-8">
                                            <div class="t-m">
                                                Plan Length:
                                                <span
                                                    class="bold"
                                                >{{ clientAdPlan.ChannelProduct.ProductLength.Name }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class="d-flex justify-content-between t-l mt48"
                                        v-if="clientAdPlan.Addons && clientAdPlan.Addons.length > 0"
                                    >
                                        <div>
                                            <div>
                                                <div
                                                    class="brand-primary d-flex flex-column flex-md-row align-items-md-end"
                                                >
                                                    <div>{{ clientAdPlan.Addons[0].Name }}</div>
                                                    <div class="ml-md-2">
                                                        <span class="tag-sm">Add On</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            class="black"
                                        >{{ clientAdPlan.AddonsAmount | currency }}</div>
                                    </div>
                                    <hr class="mb24" />
                                    <div class="total mt24">
                                        <div class="row">
                                            <div class="col-6 col-sm-6">
                                                <div class="taxes">
                                                    <span class="t-xl">Net Amount</span>
                                                </div>
                                            </div>
                                            <div class="col-6 col-sm-6 text-right">
                                                <div
                                                    class="t-xl black"
                                                >{{ (clientAdPlan.PlanAmount + clientAdPlan.AddonsAmount) | currency }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="total mb32">
                                        <div class="row">
                                            <div class="col-6 col-sm-6">
                                                <div class="taxes">
                                                    <span class="t-l">Taxes</span>
                                                    <i
                                                        class="material-icons"
                                                        @mouseover="showTaxInfo(true)"
                                                        @mouseout="showTaxInfo(false)"
                                                    >info</i>
                                                    <div v-show="taxInfo" class="tooltip-info">
                                                        <div v-for="tax in taxes" :key="tax.Name">
                                                            <div class="name">
                                                                {{ tax.Name }}
                                                                <span>({{ tax.Description }})</span>
                                                            </div>
                                                            <div
                                                                class="value text-right"
                                                                v-if="tax.Type === 'PERCENTAGE'"
                                                            >{{ tax.Value }}%</div>
                                                            <div
                                                                class="value text-right"
                                                                v-else
                                                            >{{ tax.Value | currency }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-6 col-sm-6 text-right" v-if="taxAmount">
                                                <div class="black">{{ taxAmount | currency }}</div>
                                            </div>
                                        </div>
                                        <div class="dashed-line mt16">
                                            <div class="line"></div>
                                        </div>
                                        <div class="row mt32">
                                            <div class="col-6 col-sm-6">
                                                <h5 class="t-xl">Total Amount</h5>
                                            </div>
                                            <div class="col-6 col-sm-6 text-right">
                                                <h5
                                                    class="amount t-xl black pull-right"
                                                >{{ (clientAdPlan.PlanAmount + clientAdPlan.AddonsAmount + taxAmount) | currency }}</h5>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mt32">
                                        <button
                                            @click="downloadReceipt"
                                            class="btn btn-primary-small"
                                        >Download Receipt</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-tab>
                <b-tab title="Video & Assets"></b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>
import ClientAdService from '@/services/ClientAdService';
import WeekDays from '@/e9_components/components/WeekDays';

export default {
    name: 'AdPlanDetails',
    components: {
        WeekDays
    },
    data() {
        return {
            isLoading: true,
            clientAdPlan: {}
        };
    },
    methods: {
        getStatusClass(status) {
            return status.toLowerCase();
        }
    },
    async created() {
        try {
            this.clientAdPlan = await ClientAdService.getPlanDetails(this.$route.query.id, this.$store.getters.getUser.Owner._id);
            this.isLoading = false;
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                type: 'error'
            });
            console.error(err);
            this.isLoading = false;
        }
    }
};
</script>
