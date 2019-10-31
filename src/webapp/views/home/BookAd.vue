<template>
    <div class="book-ads">
        <div>
            <div class="form-group">
                <label for="" class="text-white">Broadcast location</label>
                <select class="form-control" v-model="broadcastLocation" @change="loadSecondsbyChannel">
                    <option disabled selected hidden value="">Select Broadcast Location</option>
                    <option :value="channel._id" v-for="channel in channels" :key="channel._id" :disabled="channel.Status !== 'LIVE'">{{ channel.Name + ((channel.Status !== 'LIVE') ? ' (Coming Soon)' : '') }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="" class="text-white">Ad Length</label>
                <select class="form-control" v-model="adLength" @change="loadScheduleAvailability">
                    <option disabled selected hidden value="">Select Ad Length</option>
                    <option v-for="(sec,key) in seconds" :key="key" :value="sec">{{ sec }} Seconds</option>
                </select>
            </div>
            <div class="form-group">
                <label for="" class="text-white">Start Date</label>
                <flat-pickr v-model="startDate" :config="config" class="form-control datepicker no-border" placeholder="Select starting date" :disabled="!broadcastLocation || !adLength" ref="calendar"></flat-pickr>
            </div>
            <div class="action">
                <button class="btn btn-white btn-bordered btn-full" @click="getChannelPlans()" :disabled="isProceedable">Lets Go!</button>
            </div>
        </div>
        <div class="ad-views" v-if="broadcastLocation && adLength"><img src="@/assets/images/eye.svg" class="mr8" alt="">Estimated Views
            <span>{{ getMaximumViewCount() || 0 | formatValue(0) }}</span>
        </div>
    </div>
</template>

<script>
import instance from '@/api';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
    name: 'BookAd',
    components: {
        flatPickr
    },
    data() {
        return {
            adLength: '',
            broadcastLocation: '',
            config: {
                dateFormat: 'd/m/Y',
                minDate: new Date(),
                monthSelectorType: 'static',
                yearSelectorType: 'static',
                showNonCurrentDates: false,
                onMonthChange: () => {
                    this.sDate = new this.moment().year(this.$refs.calendar.fp.currentYear).month(this.$refs.calendar.fp.currentMonth).date(1);
                    this.loadScheduleAvailability();
                },
                disable: []
            },
            dateValidations: [],
            channels: [],
            seconds: [],
            startDate: null,
            endDate: null,
            sDate: new this.moment().add(1, 'days'),
            disabledDates: [
                this.moment().format('DD/MM/YYYY')
            ]
        };
    },
    methods: {
        getChannelPlans() {
            this.$router.push({
                name: 'BookingFlow',
                query: {
                    channel: this.broadcastLocation,
                    seconds: this.adLength,
                    startdate: this.moment(this.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
                    // startdate: this.startDate.replace(/\//g, '-')
                }
            }, () => { });
        },
        async loadScheduleAvailability() {
            this._switchShimmer(true);
            try {
                let result = await instance.get('/api/channel/availability?channel=' + this.broadcastLocation + '&seconds='
                    + this.adLength + '&startdate=' + this.sDate.format('YYYY-MM-DD') + '&enddate=' + this.sDate.endOf('month').format('YYYY-MM-DD'));
                let totalActiveSchedules = result.data.totalActiveSchedules;
                let disableDates = [new Date];
                for (let key in result.data.dates) {
                    if (result.data.dates.hasOwnProperty(key) && result.data.dates[key].length === totalActiveSchedules) {
                        let counter = 0;
                        while (counter < totalActiveSchedules) {
                            if (result.data.dates[key][counter] === true) {
                                break;
                            }
                            counter++;
                        }
                        if (counter === totalActiveSchedules) {
                            disableDates.push(this.moment(key, 'YYYY-MM-DD').format('DD/MM/YYYY'));
                        }
                    }
                }
                this.$refs.calendar.fp.set('disable', disableDates);
                this._switchShimmer(false);
            } catch (err) {
                this._switchShimmer(false);
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                throw (err);
            }
        },
        async loadSecondsbyChannel() {
            try {
                let result = await instance.get('/api/channel/seconds?channel=' + this.broadcastLocation);
                this.seconds = result.data;
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
            if (channel.Viewerships) {
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
        _switchShimmer(isAppend) {
            let str = '<div class=\'shimmer-item\'>';
            str += '<div class=\'animated-background calendar-box-title\'></div>';
            for (let i = 0; i < 5; i++) {
                str +=
                    '<div>' +
                    '<div class=\'animated-background calendar-box\'></div>' +
                    '<div class=\'animated-background calendar-box\'></div>' +
                    '<div class=\'animated-background calendar-box\'></div>' +
                    '<div class=\'animated-background calendar-box\'></div>' +
                    '<div class=\'animated-background calendar-box\'></div>' +
                    '<div class=\'animated-background calendar-box\'></div>' +
                    '<div class=\'animated-background calendar-box\'></div>' +
                    '</div>';
            }
            str += '</div></div>';

            if (isAppend)
                $('.flatpickr-calendar ').append(str);
            else
                $('.shimmer-item').remove();
        }
    },
    computed: {
        isProceedable() {
            return !this.broadcastLocation || !this.adLength || !this.startDate || this.moment(this.startDate, 'DD/MM/YYYY') < this.moment();
        }
    },
    async created() {
        try {
            let result = await instance.get('/api/channel/all');
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

<style lang="scss" scoped>
.book-ads {
    color: #fff !important;
    position: relative;

    .plan-type {
        margin-bottom: 16px;
    }

    .form-group {
        width: 280px;
        margin-right: 16px;
        display: inline-block;
        margin-bottom: 0;

        .form-control {
            margin-bottom: 0;
        }

        .datepicker {
            background-color: #fff;
        }
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
        width: 300px;
        font-family: $font-family-heading;
        text-align: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        padding: 12px;
        margin: 40px auto -40px;
        line-height: 16px;
        font-weight: 100;
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
    @media (max-width: 767px) {
        padding: 20px 0;
        .form-group {
            width: 100%;
            margin-bottom: 16px;
        }
        .action {
            width: 100%;
            display: block;
            margin: 16px 0 16px;
        }
        .ad-views {
            margin: 20px auto -20px;
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
    /* iPad Landscape */
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
        padding: 40px 0;
        .form-group {
            width: 240px;
        }
        .action {
            width: calc(100% - 3 * (240px + 16px));
        }
    }
    /* iPad Pro Landscape */
    @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        padding: 40px 24px;
        .form-group {
            width: 240px;
        }
        .action {
            width: calc(100% - 3 * (240px + 16px));
        }
    }
}
</style>
