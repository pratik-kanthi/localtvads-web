<template>
    <div class="book-ads">
        <div class="row mt-n8">
            <div class="col-md-4 col-lg-5 booking-option booking-location">
                <label for class="text-white mt8">Broadcast location</label>
                <select class="form-control" v-model="broadcastLocation" @change="loadLowestPrices">
                    <option style="text-color: #ccc" class="placeholder" selected value>Select Broadcast Location</option>
                    <option :value="channel._id" v-for="channel in channels" :key="channel._id" :disabled="channel.Status !== 'LIVE'">{{ channel.Name + (channel.Status !== 'LIVE' ? ' (Coming Soon)' : '') }}</option>
                </select>
            </div>

            <div class="col-md-6 col-lg-5 booking-option">
                <label for class="text-white mt8">Select days</label>
                <WeekDays :value="daysSelected"></WeekDays>
            </div>

            <div class="col-md-2 col-lg-2 booking-option book-now-button">
                <button class="btn btn-white btn-bordered btn-full" @click="getChannelPlans()" :disabled="isProceedable">Go!</button>
            </div>
        </div>
        <div class="ad-views d-flex align-items-center justify-content-center" v-if="broadcastLocation && lowestValue">
            <i class="material-icons">local_offer</i>
            <span class="t-l">Prices as low as {{ lowestValue | currency }} per week</span>
        </div>
    </div>
</template>

<script>
import WeekDays from '@/e9_components/components/WeekDays';
import ChannelService from '@/services/ChannelService';
import { query } from '@/services/ApiService';

export default {
    name: 'BookAd',
    components: {
        WeekDays
    },
    data() {
        return {
            adLength: '',
            broadcastLocation: '',
            config: {
                dateFormat: 'd/m/Y',
                minDate: new Date(new Date().setDate(new Date().getDate() + 7)),
                monthSelectorType: 'static',
                yearSelectorType: 'static',

                disable: []
            },
            lowest: '',
            daysSelected: [],
            dateValidations: [],
            channels: [],
            seconds: [],
            startDate: null,
            endDate: null,
            sDate: new this.moment().add(1, 'days'),
            disabledDates: [this.moment().format('DD/MM/YYYY')],
            disableAdLength: true
        };
    },
    methods: {
        getChannelPlans() {
            this.$router.push(
                {
                    name: 'BookingFlow',
                    query: {
                        channel: this.broadcastLocation,
                        daysSelected: btoa(this.daysSelected)
                    }
                },
                () => {}
            );
        },
        async loadLowestPrices() {
            try {
                if (this.broadcastLocation) {
                    let result = await ChannelService.getLowestPrice(this.broadcastLocation);
                    this.lowest = result;
                } else {
                    this.lowest = null;
                }
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        getMaximumViewCount() {
            let channel = this.channels.find(channel => channel._id === this.broadcastLocation);
            if (channel.Viewerships && channel.Viewerships[0]) {
                let max = channel.Viewerships[0].Count;
                channel.Viewerships.map(views => {
                    if (views.Count > max) {
                        max = views.Count;
                    }
                });
                return max;
            }
            return '';
        },
        getExpectedAdViews() {
            let channel = this.channels.find(channel => channel._id === this.broadcastLocation);
            return channel.ExpectedAdViews || false;
        },
        _switchShimmer(isAppend) {
            let str = '<div class=\'shimmer-item\'>';
            str += '<div class=\'animated-background calendar-box-title\'></div>';
            for (let i = 0; i < 5; i++) {
                str += '<div>' + '<div class=\'animated-background calendar-box\'></div>' + '<div class=\'animated-background calendar-box\'></div>' + '<div class=\'animated-background calendar-box\'></div>' + '<div class=\'animated-background calendar-box\'></div>' + '<div class=\'animated-background calendar-box\'></div>' + '<div class=\'animated-background calendar-box\'></div>' + '<div class=\'animated-background calendar-box\'></div>' + '</div>';
            }
            str += '</div></div>';

            if (isAppend) $('.flatpickr-calendar ').append(str);
            else $('.shimmer-item').remove();
        }
    },
    computed: {
        lowestValue() {
            if (this.daysSelected) {
                return this.lowest * this.daysSelected.length;
            } else {
                return null;
            }
        },
        isProceedable() {
            return !this.broadcastLocation || !this.daysSelected.length > 0;
        }
    },
    async created() {
        try {
            const result = await query('api/channel/all');
            this.channels = result.data;
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                type: 'error'
            });
            console.error(err);
        }
    }
};
</script>

<style lang="scss">
.book-ads {
    color: #fff !important;
    position: relative;
    margin-top: -8px;

    .booking-location {
        @media (max-width: 767px) {
            margin-top: -6px !important;
        }
    }

    .booking-option {
        select {
            font-size: 14px;
            background-image: url('../../../assets/images/select.png');
            background-color: white;
            background-size: 18px;
            background-repeat: no-repeat;
            background-position: right 18px center;

            /* iPad Landscape */
            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                font-size: 13px;
                background-size: 12px;
                background-position: right 12px center;
            }
            /* iPad Landscape */
            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                font-size: 13px;
                background-size: 12px;
                background-position: right 12px center;
            }
        }

        /* iPad Landscape */
        @media (max-width: 767px) {
            margin-top: 8px;
        }

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            padding-right: 0px;
        }
        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            padding-right: 0px;
        }
    }

    .book-now-button {
        margin-top: 40px;
        @media (max-width: 767px) {
            margin-top: 24px;
        }

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            padding-right: 16px;
        }

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            padding-right: 16px;
        }
    }

    .form-control {
        height: 48px;
        border: none;

        &:disabled {
            background-color: #f9f9f9 !important;
        }

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            font-size: 13px;
        }
        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            font-size: 13px;
        }
    }

    .plan-type {
        margin-bottom: 16px;
    }

    .datepicker {
        background-color: #fff;
        height: 48px;

        background-image: url('../../../assets/images/datepicker.svg');
        background-color: white;
        background-size: 18px;
        background-repeat: no-repeat;
        background-position: right 18px center;
    }

    .action {
        width: calc(100% - 3 * (280px + 16px));
        display: inline-block;
        vertical-align: bottom;
        margin-bottom: 1px;

        .btn {
            height: 48px;

            &:hover,
            &:visited {
                background-color: mix(#000, $brand-primary, 10%) !important;
                box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.3);
            }
        }
    }

    .ad-views {
        background-color: $brand-secondary;
        width: 380px;
        font-family: $font-family-heading;
        text-align: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        padding: 12px;
        margin: 40px auto -32px;
        line-height: 16px;
        font-weight: 100;

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            margin: 18px auto -24px;
        }

        img {
            margin-bottom: 6px;
            margin-right: 8px;
        }

        span {
            font-size: 20px;
            font-weight: 500;
            padding-left: 8px;
        }
    }

    .second-el {
        padding-left: 28px;
        &.cta {
            width: 50%;
        }
        @media (max-width: 767px) {
            padding-left: 8px;
            &.cta {
                width: 100%;
            }
        }
    }

    @media (max-width: 767px) {
        .form-group {
            width: 100%;
            margin-bottom: 16px;

            .form-control {
                font-size: 12px;
                height: 32px !important;
            }
        }

        .cta {
            margin-top: 24px;
        }
        .action {
            width: 100%;
            display: block;
            margin: 16px 0 16px;
        }

        .ad-views {
            position: absolute;
            bottom: 0;
            width: 100%;
            margin: 20px auto -20px;
            span {
                font-size: 14px;
            }
        }
    }

    /* iPhone x Landscape */
    @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
        .form-group {
            width: 100%;
            margin-bottom: 16px;
        }

        .action {
            width: 100%;
            display: block;
            margin: 16px 0 16px;
        }
    }

    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        .form-group {
            width: 288px;
            margin-bottom: 16px;
        }

        .action {
            width: 288px;
            margin: 16px 0 16px;
        }
    }

    /* iPhone x Landscape */
    @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
        padding: 0px !important;
    }

    /* iPad Landscape */
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
        .form-group {
            width: 240px;
        }

        .action {
            width: calc(100% - 3 * (240px + 16px));
        }
    }

    /* iPad Pro Landscape */
    @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        .form-group {
            width: 240px;
        }

        .action {
            width: calc(100% - 3 * (240px + 16px));
        }
    }
}
</style>
