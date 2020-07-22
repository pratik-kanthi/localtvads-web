<template>
    <section>
        <div class="container">
            <div class="confirmation-message-wrapper">
                <div class="confirmation-message d-flex flex-column align-items-center justify-content-center p32">
                    <div class="confirmation-tick">
                        <img src="@/assets/images/checked.svg" alt="" />
                    </div>
                    <div class="t-xl mt24 text-center">
                        Your purchase was successful!
                    </div>
                    <div class="t-l text-center">
                        A receipt of your payment has been sent to your registered e-mail address.
                    </div>
                </div>
                <div class="row mt32">
                    <div class="col-md-6 mt16">
                        <div class="confirmation-box h-100 p24  mt16  rounded-left">
                            <div class="t-xl bold text-center">Order Summary</div>
                            <hr />
                            <div class="row">
                                <div class="col-md-8 col-6"><div class="brand-primary t-l">Channel Ad Plan</div></div>
                                <div class="col-md-4 col-6">
                                    <div class="black text-right">
                                        {{ $parent.clientAdPlan.PlanAmount | currency }}/week
                                        <!--i class="material-icons pointer brand-primary t-xl" @mouseover="showPriceBreakdown(true)" @mouseout="showPriceBreakdown(false)">info</i>
                                        <div v-show="priceBreakDown" class="tooltip-info">
                                            <div class="t-s" :key="key" v-for="(slot, key) in $parent.clientAdPlan.ChannelProduct.ChannelSlots">{{ slot.Slot.Name }} - {{ (slot.RatePerSecond * slot.Duration * $parent.daysSelected.length) | currency }}</div>
                                        </div-->
                                    </div>
                                </div>

                                <div class="col-md-8">
                                    <div class="t-m">
                                        Plan Length: <span class="bold">{{ $parent.clientAdPlan.ChannelProduct.ProductLength.Name }}</span>
                                    </div>
                                    <!--div class="t-s d-block d-md-none">Days: {{ getSelectedDays(true) }}</div>
                                    <div class="t-m d-none d-md-block">
                                        Days: <span class="bold">{{ getSelectedDays(false) }}</span>
                                    </div-->
                                </div>
                            </div>
                            <div class="d-flex justify-content-between t-l mt48" v-if="$parent.clientAdPlan.Addons && $parent.clientAdPlan.Addons.length > 0">
                                <div>
                                    <div>
                                        <div class="brand-primary d-flex flex-column flex-md-row align-items-md-end">
                                            <div>{{ $parent.clientAdPlan.Addons[0].Name }}</div>
                                            <div class="ml-md-2"><span class="tag-sm">Add On</span></div>
                                        </div>
                                        <div class="t-s mt8" v-for="benefit in $parent.clientAdPlan.Addons[0].Benefits" :key="benefit">{{ benefit }}</div>
                                    </div>
                                </div>
                                <div class="black">{{ $parent.clientAdPlan.AddonsAmount | currency }}</div>
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
                                        <div class="t-xl black">{{ ($parent.clientAdPlan.PlanAmount + $parent.clientAdPlan.AddonsAmount) | currency }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="total mb32">
                                <div class="row">
                                    <div class="col-6 col-sm-6">
                                        <div class="taxes">
                                            <span class="t-l">Taxes</span>
                                            <i class="material-icons" @mouseover="showTaxInfo(true)" @mouseout="showTaxInfo(false)">info</i>
                                            <div v-show="taxInfo" class="tooltip-info">
                                                <div v-for="tax in taxes" :key="tax.Name">
                                                    <div class="name">
                                                        {{ tax.Name }}
                                                        <span>({{ tax.Description }})</span>
                                                    </div>
                                                    <div class="value text-right" v-if="tax.Type === 'PERCENTAGE'">{{ tax.Value }}%</div>
                                                    <div class="value text-right" v-else>{{ tax.Value | currency }}</div>
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
                                        <h5 class="amount t-xl black pull-right">{{ ($parent.clientAdPlan.PlanAmount + $parent.clientAdPlan.AddonsAmount + taxAmount) | currency }}</h5>
                                    </div>
                                </div>
                            </div>

                            <!-- <div class=" mt32">
                                <button @click="downloadReceipt" class="btn btn-primary-small">Download Receipt</button>
                            </div> -->
                        </div>
                    </div>
                    <div class="col-md-6 mt16">
                        <div class="confirmation-box h-100 p24  mt16 rounded-right">
                            <div class="t-l d-flex h-100 flex-column justify-content-between">
                                <div class="">
                                    <div class="t-xl bold text-center">Next Steps</div>
                                    <hr />
                                    <ol>
                                        <li class="t-l mt24">To continue building your ad, go to <router-link tag="a" to="/ads">My Ads</router-link> and select the ad you just booked</li>
                                        <li class="t-l mt24">You can upload your ad video ( and other assets if you bought an add-on )</li>
                                        <li class="t-l mt24">Once you have provided the video and other required details, our team will review your ad and get back to you.</li>
                                    </ol>
                                </div>
                                <div class="t-l bold">
                                    For any help, please reach out to us on
                                    <a href="mailto:support@localtvads.com">support@localtvads.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import TaxService from '@/services/TaxService';
export default {
    name: 'Confirmation',
    data() {
        return {
            orderSumamry: {},
            taxes: [],
            taxAmount: 0,
            taxInfo: false,
            isDisplay: false,
            priceBreakDown: false
        };
    },
    methods: {
        downloadReceipt() {},
        showTaxInfo(isDisplay) {
            this.taxInfo = isDisplay;
        }
    },
    async created() {
        this.taxes = await TaxService.getAllTaxes();
        for (let i = 0, len = this.taxes.length; i < len; i++) {
            if (this.taxes[i].Type === 'PERCENTAGE') {
                this.taxAmount += (this.taxes[i].Value * (this.$parent.clientAdPlan.PlanAmount + this.$parent.clientAdPlan.AddonsAmount)) / 100;
            } else {
                this.taxAmount += this.taxes[i].Value;
            }
        }
    }
};
</script>

<style scoped lang="scss">
.confirmation-message-wrapper {
    .confirmation-tick {
        height: 80px;
        img {
            height: 100%;
        }
    }
    .confirmation-box {
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        i {
            position: relative;
            top: 4px;
            left: 4px;
            font-size: 18px;
            color: $brand-primary;
            cursor: pointer;
        }
        .tooltip-info {
            width: 250px;
            text-align: left;
            position: absolute;
            left: 80px;
            color: $base;
            bottom: 8px;
            border-radius: 6px;
            background: #fff;
            padding: 8px 12px;
            box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
            font-size: 14px;
            z-index: 10;

            .name {
                display: inline-block;
                width: 80%;
            }

            .value {
                display: inline-block;
                width: 20%;
            }
        }
    }
    .dashed-line {
        position: relative;
        height: 1px;
        .line {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: linear-gradient(to right, #223049 50%, transparent 50%);
            background-size: 32px 100%;
        }
    }
}
</style>
