<template>
    <div class="addons-parent">
        <div class="container">
            <div class="mt64 brand-primary pointer" @click="goBack">Go Back</div>
            <h3 class="mt64 brand-secondary">Step 2 : Choose AddOns</h3>
            <div class="mt24 t-xl">Do you have your own ad as a video file? If not, our team of specialists will create one for you</div>

            <b-form-group class="mt48">
                <b-form-radio class="t-xl" v-model="isAddOn" value="clientad">I have my own ad.</b-form-radio>
                <b-form-radio class="t-xl mt32" v-model="isAddOn" value="addon">I don't have an ad.</b-form-radio>
            </b-form-group>

            <div v-if="isAddOn == 'addon'">
                <h4 class="brand-secondary mt64 mb48">Select Your Add On</h4>
                <div class="row addons-wrapper mb24">
                    <div class="col-lg-6 mb16" v-for="addon in addons" :key="addon._key">
                        <div class="addon" :class="{ 'active-addon': $parent.serviceAddOn._id === addon._id }">
                            <div class="name">
                                <h5>{{ addon.Name }}</h5>
                                <p class="desc">{{ addon.Description }}</p>
                            </div>
                            <div class="price">
                                <p class="lead brand-primary mb0">Now for just</p>
                                <h4 class="amount">{{ addon.TotalAmount | currency }}</h4>
                            </div>
                            <div class="benefits">
                                <ul class="mb8">
                                    <li v-for="benefit in addon.Benefits" :key="benefit">{{ benefit }}</li>
                                </ul>
                            </div>
                            <div class="selectaddon">
                                <button class="btn btn-primary btn-full" @click="selectAddon(addon)" :class="{ 'btn-selected': $parent.serviceAddOn._id === addon._id }">
                                    <span v-if="$parent.serviceAddOn._id === addon._id">Selected</span>
                                    <span v-else>Choose this Addon</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="action mt48 mb64 d-flex justify-content-center">
                <button class="btn btn-white w-25 border" @click="cancel">Cancel</button>
                <button class="btn btn-primary w-25 ml16" @click="saveAddOnOption">Proceed</button>
            </div>
        </div>
    </div>
</template>

<script>
import instance from '@/api';

import ChoosePlan from '../booking-flow/ChoosePlan';
export default {
    name: 'ChooseAddons',
    data() {
        return {
            addons: [],
            isAddOn: false
        };
    },
    methods: {
        goBack() {
            this.$parent.currentStep = 1;
            this.$parent.currentStage = ChoosePlan;
        },
        cancel() {
            this.$router.push('/', () => {});
        },
        selectAddon(addon) {
            this.$parent.serviceAddOn = addon;
        },
        saveAddOnOption() {
            if (this.isAddOn == 'addon') {
                this.$parent.hasAddOn = true;
                this.$emit('advanceToPayment');
            } else {
                this.$parent.hasAddOn = false;
                this.$emit('advanceToPayment');
            }
        }
    },
    async created() {
        this.$parent.isLoading = true;
        try {
            let result = await instance.get('api/serviceaddons/all');
            this.addons = result.data.addOns;
            this.$parent.taxes = result.data.taxes;
            this.$parent.serviceAddOn = this.addons[0];
            this.$parent.isLoading = false;
        } catch (err) {
            this.$parent.isLoading = false;
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
.custom-radio {
    .custom-control-input:checked ~ .custom-control-label::before {
        background: $brand-primary;
        border: none;
    }

    .custom-control-label::before {
        margin-top: -3px;
    }

    .custom-control-label::after {
        margin-top: -3px;
    }
}
</style>
