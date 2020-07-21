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
                <div class="row mt48 p8">
                    <div class="col-md-6 border mt16 p24 b-r rounded-left">
                        <div class="t-xl bold text-center">Order Summary</div>
                        <hr />
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="brand-primary t-l">Ad Plan:</div>
                                <div class="t-m">Length: {{ $parent.clientAdPlan.ChannelProduct.ProductLength.Name }}</div>
                            </div>
                            <div>{{ $parent.clientAdPlan.PlanAmount | currency }}</div>
                        </div>
                        <div class="dashed-line mt24">
                            <div class="line"></div>
                        </div>
                        <div class="d-flex justify-content-between mt24">
                            <div class="bold">Total Amount</div>
                            <div>{{ $parent.clientAdPlan.TotalAmount | currency }}</div>
                        </div>
                        <div class=" mt32">
                            <button @click="downloadReceipt" class="btn btn-primary-small">Download Receipt</button>
                        </div>
                    </div>
                    <div class="col-md-6 border mt16 p24 rounded-right">
                        <div class="t-xl bold text-center">Next Steps</div>
                        <hr />
                        <div class="t-l mt24 ">
                            <div class="t-l">- To continue building your ad, go to <router-link tag="a" to="/ads">My Ads</router-link> and select the ad you just booked</div>
                            <div class="t-l">- You can upload your ad video ( and other assets if you bought an add-on )</div>
                            <div class="t-l">- Once you have provided the video and other required details, our team will review your ad and get back to you.</div>
                            <div class="t-l bold mt16">
                                For any help, please reach out to us on
                                <a href="mailto:support@localtvads.com">support@localtvads.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    name: 'Confirmation',
    data() {
        return {
            orderSumamry: {}
        };
    },
    methods: {
        downloadReceipt() {}
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
