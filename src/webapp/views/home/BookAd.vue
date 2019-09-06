<template>
    <div class="book-ads">
        <div>
            <div class="form-group">
                <label for="" class="text-white">Broadcast location</label>
                <select class="form-control" v-model="broadcastLocation" @change="loadSecondsbyChannel">
                    <option disabled selected hidden value="">Select Broadcast Location</option>
                    <option :value="channel._id" v-for="channel in channels" :key="channel._id">{{channel.Name}}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="" class="text-white">Ad Length</label>
                <select class="form-control" v-model="adLength">
                    <option disabled selected hidden value="">Select Ad length</option>
                    <option v-for="(sec,key) in seconds" :key="key" :value="sec">{{sec}} Seconds</option>
                </select>
            </div>
            <div class="form-group">
                <label for="" class="text-white">Start Date</label>
                <flat-pickr v-model="startDate" :config="{ dateFormat: 'd/m/Y', minDate: new Date() }" class="form-control datepicker" placeholder="DD/MM/YYY"></flat-pickr>
            </div>
            <div class="action">
                <button class="btn btn-white btn-bordered btn-full" @click="getChannelPlans()" :disabled="isProceedable">Lets Go!</button>
            </div>
        </div>
        <div class="ad-views"><img src="@/assets/images/eye.svg" class="mr8" alt="">Estimated Views<span>845,00,00</span></div>
    </div>
</template>

<script>
import instance from "@/api";
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
            channels: [],
            seconds: [],
            broadcastLocation: '',
            startDate: null
        }
    },
    methods: {
        getChannelPlans() {
            this.$router.push({name: 'ChoosePlan', query: {channel: this.broadcastLocation, seconds: this.adLength, startdate: this.startDate.replace(/\//g,'-')}});
        },
        async loadSecondsbyChannel() {
            try {
                let result = await instance.get('/api/channel/seconds?channel=' + this.broadcastLocation);
                this.seconds = result.data;
            } catch (err) {
                this.$swal({
                    title: "Some error occured",
                    text: 'Some error has been occured.',
                    type: "error"
                });
            }
        }
    },
    async created() {
        try {
            let result = await instance.get('/api/channel/all');
            this.channels = result.data;
        } catch (err) {
            this.$swal({
                title: "Some error occurred",
                text: 'Some error has been occurred.',
                type: "error"
            });
        }
    },
    computed: {
        isProceedable(){
            return !this.broadcastLocation || !this.adLength || !this.startDate || this.moment(this.startDate,'DD/MM/YYYY') < this.moment();
        }
    }
}
</script>

<style lang="less">
    .book-ads {
        padding: 40px;
        color: #FFF !important;
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
            width: calc(~'100% - 888px');
            display: inline-block;
            vertical-align: bottom;
            margin-bottom: 1px;
            .btn {
                &:hover,
                &:visited {
                    background-color: mix(#000,@brand-primary,10%) !important;
                    .box-shadow(1px 1px 8px 0 rgba(0,0,0,0.3));
                }
            }
        }
        .ad-views {
            margin-left: auto;
            margin-right: auto;
            margin-top: 40px;
            background-color: @brand-secondary;
            width: 300px;
            text-align: center;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            padding: 16px;
            margin-bottom: -40px;
            img {
                margin-bottom: 6px;
            }
            span {
                font-size: 20px;
                font-weight: 700;
                padding-left: 8px;
            }
        }
    }
</style>