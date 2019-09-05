<template>
    <div class="book-ads">
        <div class="plan-type">
            <!-- div.form-gru -->
            <!-- <input type="radio" v-model="recurring"> Recurring
            <input type="radio" v-model="recurring"> On-off (free of charge for new clients) -->
        </div>
        <div>
            <div class="form-group">
                <select class="form-control" v-model="selected" @change="loadSecondsbyChannel">
                    <option disabled value="">Select Broadcast Location</option>
                    <option :value="channel._id" v-for="channel in channels" :key="channel._id">{{channel.Name}}</option>
                </select>
            </div>
            <div class="form-group">
                <select class="form-control" v-model="adLength">
                    <option disabled value="">Select Ad length</option>
                    <option v-for="(sec,key) in seconds" :key="key" :value="sec">{{sec}} Seconds</option>
                </select>
            </div>
            <div class="form-group">
                <flat-pickr v-model="startDate" :config="{ dateFormat: 'd/m/Y', minDate: new Date() }" class="form-control datepicker" placeholder="DD/MM/YYY"></flat-pickr>
            </div>

            <button class="btn btn-white btn-bordered" @click="getChannelPlans" :disabled="isProceedable">Lets Go!</button>
        </div>
        <div v-if="nearbyChannels.length > 0" class="channelplan">
            chanel plans
        </div>
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
            nearbyChannels: [],
            seconds: [],
            selected: '',
            startDate: null
        }
    },
    methods: {
        async getChannelPlans() {
            try {
                let result = await instance.get('/api/channel/nearbychannelplans?channel=' + this.selected + '&seconds=' + this.adLength);
                this.nearbyChannels = result.data;
            } catch (err) {
                this.$swal({
                    title: "Some error occured",
                    text: 'Some error has been occured.',
                    type: "error"
                });
            }
        },
        async loadSecondsbyChannel() {
            try {
                let result = await instance.get('/api/channel/seconds?channel=' + this.selected);
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
            return !this.selected || !this.adLength || !this.startDate || this.moment(this.startDate,'DD/MM/YYYY') < this.moment();
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
                &:before {
                    background-image: url('../../../assets/images/datepicker.png');
                    width: 14px;
                    height: 30px;
                }
            }
        }
        .btn {
            width: calc(~'100% - 888px');
            display: inline-block;
            margin-bottom: 3px;
            &:hover,
            &:visited {
                background-color: mix(#000,@brand-primary,10%) !important;
                .box-shadow(1px 1px 8px 0 rgba(0,0,0,0.3));
            }
        }
        .channelplan {
            margin-top: 16px;
        }
    }
</style>