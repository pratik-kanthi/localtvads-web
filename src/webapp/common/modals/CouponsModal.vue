<template>
    <b-modal v-model="showCoupons" centered hide-header hide-footer no-close-on-esc no-close-on-backdrop>
        <div class="coupons-wrapper">
            <h3 class="section-title-2 mb24 pos-relative">Discount Coupons <a @click="close"><i class="material-icons pos-absolute pos-right brand-secondary light">close</i></a></h3>
            <div class="form-group">
                <input type="text" class="form-control" v-model="couponCode" placeholder="Enter coupon code">
                <button class="btn btn-primary pos-absolute pos-right pos-top" :disabled="!couponCode" @click="applyCoupon(undefined)">Apply Coupon</button>
            </div>
            <div class="coupons" v-for="coupon in coupons" :key="coupon._id">
                <div class="coupon-code mb16">
                    <p class="mb0">{{ coupon.CouponCode }}</p>
                </div>
                <h6 class="hero-text mb8">{{ coupon.Name }}</h6>
                
                <p class="lead t-s mb0">{{ coupon.Description }}</p>
                <p class="t-xs  text-muted mb16">Use code {{ coupon.CouponCode }} & get 60% discount on the base subscription amount.</p>
                <button class="btn btn-primary btn-bordered" @click="applyCoupon(coupon.CouponCode)" :disabled="isLoading">Apply Coupon</button>
            </div>
        </div>
    </b-modal>
</template>

<script>
import instance from '@/api';
import {mapGetters} from 'vuex';
export default {
    name: 'CouponsModal',
    props: ['showCoupons', 'options'],
    data() {
        return {
            coupons: [],
            couponCode: '',
            isLoading: false
        };
    },
    methods: {
        async applyCoupon(couponCode) {
            this.isLoading = true;
            if (couponCode) {
                this.couponCode = undefined;
            }
            try {
                let result = await instance.get('api/clientad/couponexists?clientid=' + this.$store.state.user.Owner._id + '&channel=' + this.options.channel + '&adschedule=' + this.options.adSchedule + '&startdate=' + this.options.startDate + '&couponcode=' + (this.couponCode || couponCode));
                this.isLoading = false;
                this.selectCoupon(result.data);
            } catch (err) {
                this.isLoading = false;
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        close() {
            this.selectCoupon(undefined);
        },
        selectCoupon(discount) {
            this.$emit('discountChosen', discount);
        },
        ...mapGetters(['getUser'])
    },
    async created() {
        try {
            let result = await instance.get('api/clientad/coupons?clientid=' + this.getUser().Owner._id + '&channel=' + this.options.channel + '&adschedule=' + this.options.adSchedule + '&startdate=' + this.options.startDate);
            this.coupons = result.data;
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
    .coupons-wrapper {
        background: $white;
        padding: 16px;
        .coupons {
            border: 1px solid #ddd;
            padding: 16px;
            margin-bottom: 24px;
            .coupon-code {
                display: inline-block;
                padding: 8px 16px;
                background: #fffae6;
                border: 1px solid #ddd;
                p {
                    letter-spacing: 1px;
                }
            }
        }
    }
</style>
