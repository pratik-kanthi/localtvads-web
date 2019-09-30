<template>
    <div class="container">
        <div class="text-white" v-show="$parent.clientAdPlan.ClientAd">
            <p class="t-l" v-if="$parent.clientAdPlan.ClientAd.Status === 'UNDERREVIEW'">
                Thank you for choosing Local TV Ads. We appreciate your business and welcome you to our long list of satisfied and much valued customers. Our success comes from the continuous faith in the excellence of our services to make your content reach millions of views, something we are committed to and would never sacrifice.
                <br />
                <br />
                Our Team usually takes 24-36 working hours to review your content, meanwhile please checkout our campaigns page to know more about us!
            </p>
            <p class="t-l" v-if="$parent.clientAdPlan.ClientAd.Status === 'APPROVED'">
                Greetings! Your content has been approved by our team and will be telecast from <b>{{moment($parent.clientAdPlan.StartDate).format('DD-MM-YYYY')}}</b> till <b>{{moment($parent.clientAdPlan.EndDate).format('DD-MM-YYYY')}}</b>, every <b>{{days[$parent.clientAdPlan.DayOfWeek]}}</b>
            </p>
            <a class="btn btn-white" :href="getPreviewUrl" target="_blank">View your Ad</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Review",
        data() {
            return {
                days: ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
            }
        },
        computed: {
            getPreviewUrl() {
                return this.GOOGLE_BUCKET_ENDPOINT + this.$parent.clientAdPlan.ClientAd.VideoUrl;
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        background-image: url('../../../assets/images/pattern.svg');
        background-color: $brand-primary;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        padding: 108px;
        border-radius: 8px;
        .content-box {
            background: #333;
            box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 16px;
            text-align: center;
        }
        .tv-stand {
            background: #333;
            height: 70px;
            width: 60px;
            margin: 0 auto;
        }
        .tv-stand-base {
            width: 200px;
            height: 20px;
            margin: 0 auto;
            background: #333;
        }
    }
</style>