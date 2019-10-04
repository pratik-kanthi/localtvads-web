<template>
    <b-modal v-model="showCoupons" centered hide-header hide-footer no-close-on-esc no-close-on-backdrop>
        <div class="coupons-wrapper">
            <h3 class="section-title-2 mb24" @click="close">Discount Coupons</h3>
            <div class="form-group">
                <input type="text" class="form-control" v-model="couponCode" placeholder="Enter coupon code">
                <button class="btn btn-primary btn-coupon" :disabled="!couponCode" @click="applyCoupon(undefined)">Apply Coupon</button>
            </div>
            <div class="coupons" v-for="coupon in coupons" :key="coupon._id">
                <h6 class="hero-text">{{coupon.Name}}</h6>
                <p class="lead mb0">{{coupon.CouponCode}}</p>
                <p class="text-muted t-s">{{coupon.Description}}</p>
                <button class="btn btn-primary btn-bordered" @click="applyCoupon(coupon.CouponCode)" :disabled="isLoading">Apply Coupon</button>
            </div>
        </div>
    </b-modal>
</template>

<script>
import instance from "@/api";
export default {
    name: "CouponsModal",
    props: ['showCoupons', 'options'],
    data() {
        return {
            coupons: [],
            couponCode: '',
            isLoading: false
        }
    },
    methods: {
        async applyCoupon(couponCode) {
            this.isLoading = true;
            if (couponCode) {
                this.couponCode = undefined;
            }
            try {
                let result = await instance.get('api/clientad/couponexists?clientid=' + this.$store.state.user.Owner._id + '&channel=' + this.options.channel + '&channelplan=' + this.options.channelPlan + '&startdate=' + this.options.startDate + '&couponcode=' + (this.couponCode || couponCode));
                this.isLoading = false;
                this.selectCoupon(result.data);
            } catch (err) {
                this.isLoading = false;
                this.$swal({
                    title: "Error",
                    text: err && err.data && err.data.message ? err.data.message : "Some error occurred",
                    type: "error"
                });
                console.error(err);
            }
        },
        close() {
            this.selectCoupon(undefined);
        },
        selectCoupon(discount) {
            this.$emit('discountChosen', discount);
        }
    },
    async created() {
        try {
            let result = await instance.get('api/clientad/coupons?clientid=' + this.$store.state.user.Owner._id + '&channel=' +  this.options.channel + '&channelplan=' + this.options.channelPlan + '&startdate=' + this.options.startDate);
            this.coupons = result.data;
        } catch (err) {
            this.$swal({
                title: "Error",
                text: err && err.data && err.data.message ? err.data.message : "Some error occurred",
                type: "error"
            });
            console.error(err);
        }
    }
}
</script>

<style lang="scss" scoped>
    .coupons-wrapper {
        background: $white;
        padding: 16px;
        .btn-coupon {
            position: absolute;
            top: 0;
            right: 0;
        }
        .coupons {
            border: 1px solid #ddd;
            padding: 16px;
        }
    }
</style>
