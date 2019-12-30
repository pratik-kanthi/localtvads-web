<template>
    <section class="bg--grey pt0">
        <div class="container">
            <div class="ad-video-wrapper">
                <h3 class="section-title-2 text-white text-center mt0">Your request for '{{ this.$parent.clientServiceAddOn.ServiceAddOn.Name }}' has been submitted</h3>
                <div class="checked">
                    <img src="@/assets/images/checked.svg" alt="">
                </div>
                <p class="t-l text-center">
                    Thank you for choosing Local TV Ads. We appreciate your business and welcome you to our long list of satisfied and much valued customers. Our success comes from the continuous faith in the excellence of our services to make your content reach millions of views, something we are committed to and would never sacrifice.
                    <br />
                    <br /> Our Team will get reach out to you via email or phone very soon, meanwhile please checkout our campaigns page to know more about us!
                </p>
                <div class="action text-center">
                    <router-link to="/">
                        <button class="btn btn-white mr16">Go to home page</button>
                    </router-link>
                    <button class="btn btn-white mr16" v-if="$parent.clientServiceAddOn.ServiceAddOn.IsUploadRequired" @click="goToSelectMedia">Edit resources</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import ChooseAddon from './ChooseAddon';
import SelectMedia from './SelectMedia';

export default {
    name: 'Review',
    data() {
        return {
            days: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        };
    },
    methods: {
        goToSelectMedia() {
            this.$parent.currentStage = SelectMedia;
        }
    },
    created() {
        if (!this.$parent.clientServiceAddOn) {
            this.$parent.currentStage = ChooseAddon;
        }
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
    @media (max-width: 768px) {
        margin: 16px 0;
        padding: 40px 16px;
        .checked {
            img {
                width: 120px;
            }
        }
        .action {
            .btn {
                &:first-child {
                    margin-bottom: 16px;
                }
            }
        }
    }
    /* iPhone x Landscape */
    @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
        margin: 0;
        padding: 40px;
    }
    /* iPad Landscape */
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
        padding: 40px;
    }
    /* iPad Pro Portrait */
    @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        padding: 40px;
    }
}
</style>
