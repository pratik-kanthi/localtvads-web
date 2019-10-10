<template>
    <section class="bg--grey pt0">
        <div class="container">
            <div class="ad-video-wrapper" v-show="$parent.clientAdPlan.ClientAd">
                <h3 class="section-title-2 text-white text-center mt0">Your Video Has Been Submitted</h3>
                <div class="checked">
                    <img src="@/assets/images/checked.svg" alt="">
                </div>
                <p class="t-l text-center" v-if="$parent.clientAdPlan.ClientAd.Status === 'UNDERREVIEW'">
                    Thank you for choosing Local TV Ads. We appreciate your business and welcome you to our long list of satisfied and much valued customers. Our success comes from the continuous faith in the excellence of our services to make your content reach millions of views, something we are committed to and would never sacrifice.
                    <br />
                    <br />
                    Our Team usually takes 24-36 working hours to review your content, meanwhile please checkout our campaigns page to know more about us!
                </p>
                <p class="t-l text-center" v-if="$parent.clientAdPlan.ClientAd.Status === 'APPROVED'">
                    Greetings! Your content has been approved by our team and will be telecast from <b>{{ moment($parent.clientAdPlan.StartDate).format('DD-MM-YYYY') }}</b> till <b>{{ moment($parent.clientAdPlan.EndDate).format('DD-MM-YYYY') }}</b>, every <b>{{ days[$parent.clientAdPlan.DayOfWeek] }}</b>
                </p>
                <div class="action text-center">
                    <router-link to="/">
                        <button class="btn btn-white">Go to home page</button>
                    </router-link>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Review',
    data() {
        return {
            days: ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
        };
    }
};
</script>

<style scoped lang="scss">
    .ad-video-wrapper {
        color: $white;
        margin: 24px 88px;
        background-image: url('../../../assets/images/pattern.svg');
        background-color: $brand-primary;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        padding: 64px 120px;
        border-radius: 8px;
        .checked {
            img {
                display: block;
                margin: 40px auto;
            }
        }
        .action {
            margin-top: 40px;
            button {
                min-width: 240px;
            }
        }
    }
</style>