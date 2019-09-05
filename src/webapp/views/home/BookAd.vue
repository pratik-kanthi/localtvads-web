<template>
    <div class="book-ads">
        <div>
            <div class="form-group">
                <label for="" class="text-white">Broadcast location</label>
                <select class="form-control" v-model="selectedChannel">
                    <option value="" disabled hidden selected>Choose Channel</option>
                    <option :value="channel._id" v-for="channel in channels" :key="channel._id">{{channel.Name}}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="" class="text-white">Broadcast location</label>
                <select class="form-control" v-model="adLength">
                    <option value="" disabled hidden selected>Select your ad length</option>
                    <option value="15">15 Seconds</option>
                    <option value="20">20 Seconds</option>
                    <option value="25">25 Seconds</option>
                    <option value="30">30 Seconds</option>
                </select>
            </div>
            <div class="form-group">
                <label for="" class="text-white">Start Date</label>
                <flat-pickr v-model="startDate" :config="{ dateFormat: 'd/m/Y', minDate: new Date() }" class="form-control datepicker" placeholder="Select strating date"></flat-pickr>
            </div>
            <div class="action">
                <button class="btn btn-white btn-bordered btn-full" @click="goToChoosePlan" :disabled="isProceedable">Lets Go!</button>
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
            channels: [],
            selectedChannel: '',
            adLength: '',
            startDate: null
        }
    },
    methods: {
        goToChoosePlan() {
            this.$router.push({name: 'ChoosePlan', query: {channel: this.selectedChannel, seconds: this.adLength, startdate: this.startDate.replace(/\//g,'-')}});
        }
    },
    async created() {
        try {
            let result = await instance.get('/api/channel/all');
            this.channels = result.data;
        } catch (err) {
            this.$swal({
                title: "Some error occured",
                text: 'Some error has been occured.',
                type: "error"
            });
        }
    },
    computed: {
        isProceedable(){
            return !this.selectedChannel || !this.adLength || !this.startDate || this.moment(this.startDate,'DD/MM/YYYY') < this.moment();
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
        .channelplan {
            margin-top: 16px;
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