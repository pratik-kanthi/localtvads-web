<template>
    <div class="container">
        <h3 class="mt64 page-heading">Choose AddOns</h3>
        <div class="mt24 t-xl">Do you have your own ad as a video file? If not, our team of specialists will create one for you</div>
        <div class="addon-options-wrapper d-flex mt24">
            <div class="addon-option mt24 rounded" :class="!isAddOn ? 'active' : ''" @click="setAddon(false)">
                <span class="black">I have my own ad.</span>
            </div>
            <div class="addon-option mt24 rounded" :class="isAddOn ? 'active' : ''" @click="setAddon(true)">
                <span class="black">I don't have an ad</span>
            </div>
        </div>

        <transition name="addon">
            <div v-if="isAddOn">
                <h4 class="brand-secondary mt64 mb48">Select Your Add On</h4>

                <div class="addons-wrapper mb24">
                    <div class="addon-container" v-for="addon in addons" :key="addon._id">
                        <div class="addon" :class="{ 'active-addon': $parent.clientAdPlan.Addons[0]._id === addon._id }">
                            <div class="name">
                                <h5>{{ addon.Name }}</h5>
                                <p class="desc">{{ addon.Description }}</p>
                            </div>
                            <div class="price">
                                <p class="lead brand-primary mb0">Now for just</p>
                                <h4 class="amount">{{ addon.Amount | currency }}</h4>
                            </div>
                            <div class="benefits">
                                <ul class="mb8">
                                    <li v-for="benefit in addon.Benefits" :key="benefit">{{ benefit }}</li>
                                </ul>
                            </div>
                            <div class="selectaddon">
                                <button class="btn btn-primary-small" @click="selectAddon(addon)" :class="{ 'btn-selected': $parent.clientAdPlan.Addons[0]._id === addon._id }">
                                    <span v-if="$parent.clientAdPlan.Addons[0]._id === addon._id">Selected</span>
                                    <span v-else>Choose this Addon</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <div class="action mt80 mb64 d-flex justify-content-center">
            <button class="btn btn-white w-25 border" @click="cancel">Cancel</button>
            <button class="btn btn-primary w-25 ml16" @click="saveAddOnOption">Proceed</button>
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
            isAddOn: false,
            activeToggle: 'IsAd'
        };
    },
    methods: {
        setAddon(value) {
            this.isAddOn = value;
            if (this.isAddOn) {
                this.activeToggle = 'IsAddon';
                this.$parent.clientAdPlan.Addons = [this.addons[0]];
                this.$parent.clientAdPlan.AddonsAmount = this.addons[0].Amount;
            } else {
                this.activeToggle = 'IsAd';
                this.$parent.clientAdPlan.Addons = [];
                this.$parent.clientAdPlan.AddonsAmount = 0;
            }
        },
        goBack() {
            this.$parent.currentStep = 1;
            this.$parent.currentStage = ChoosePlan;
        },
        cancel() {
            this.$router.push('/', () => {});
        },
        selectAddon(addon) {
            let plan = { ...this.$parent.clientAdPlan };
            plan.Addons = [addon];
            plan.AddonsAmount = addon.Amount;
            this.$parent.clientAdPlan = plan;
        },
        saveAddOnOption() {
            if (this.isAddOn) {
                this.$parent.hasAddOn = true;
                this.$parent.clientAdPlan.AddonsAmount = this.$parent.clientAdPlan.Addons[0].Amount;
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
            this.$parent.clientAdPlan.AddonsAmount = 0;
            this.addons = result.data;
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
<style lang="scss" scoped>
.addon-options-wrapper {
    .addon-option {
        padding: 32px;
        border: 1px solid #eee;
        margin-right: 8px;
        font-size: 16px;
        cursor: pointer;
        &.active {
            background: #ff65000d;
            border: 1px solid #fbd8b4;
        }

        @include media-breakpoint-up(md) {
            padding: 32px;
            font-size: 24px;
        }
    }
}

.addon-enter-active,
.addon-leave-active {
    transition: all 1s;
}
.addon-enter, .addon-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
}
.addons-wrapper {
    display: flex;
    overflow-x: auto;

    .addon-container {
        min-width: 280px;
        margin: 8px;
        &::-webkit-scrollbar {
            display: none;
        }
        .addon {
            background-color: $white;
            border: 1px solid #ddd;
            border-radius: 6px;
            text-align: center;
            &.active-addon {
                box-shadow: 0 0 8px 0 rgba(255, 101, 0, 0.5);
                border: 1px solid #fbd8b4;
            }
            .name {
                padding: 12px 16px;
                border-bottom: 1px solid #ddd;
                h5 {
                    font-weight: 500;
                    font-size: 18px;
                    color: $brand-primary;
                    margin-bottom: 4px;
                    @include media-breakpoint-up(md) {
                        font-weight: 500;
                        font-size: 24px;
                        color: $brand-primary;
                        margin-bottom: 4px;
                    }
                }
                .desc {
                    font-size: 14px;
                    font-family: $font-family-heading;
                    font-weight: 400;
                    margin-bottom: 0;
                    opacity: 0.6;
                    @include media-breakpoint-up(md) {
                        font-size: 16px;
                        font-family: $font-family-heading;
                        font-weight: 400;
                        margin-bottom: 0;
                        opacity: 0.6;
                    }
                }
            }
            .price {
                padding: 0 16px;
                border-bottom: 1px solid #ddd;
                @include media-breakpoint-up(md) {
                    padding: 12px 16px;
                }
                .amount {
                    font-weight: 500;
                    font-size: 32px;
                    margin-bottom: 4px;
                    color: $brand-secondary;
                    @include media-breakpoint-up(md) {
                        font-weight: 500;
                        font-size: 36px;
                        margin-bottom: 4px;
                        color: $brand-secondary;
                    }
                }
            }
            .benefits {
                padding: 16px 36px;
                ul {
                    @include list-unstyled();
                    li {
                        font-family: $font-family-heading;
                        font-size: 13px;
                        color: $base;
                        text-align: left;
                        margin-bottom: 16px;
                        line-height: 20px;
                        cursor: pointer !important;
                        padding-left: 32px;
                        position: relative;
                        @include media-breakpoint-up(md) {
                            font-size: 14px;
                        }
                        &:last-child {
                            margin-bottom: 0;
                        }
                        &:before {
                            content: '';
                            background-image: url('../../../assets/images/tick.svg');
                            height: 16px;
                            width: 16px;
                            left: 0;
                            top: 2px;
                            background-size: cover;
                            position: absolute;
                            background-repeat: no-repeat;
                        }
                    }
                }
            }
            .selectaddon {
                padding: 0 32px 24px;
                opacity: 1;
                z-index: 2;
                .btn-selected {
                    background-color: $brand-primary !important;
                    border: none;
                }
            }
        }
    }
}
</style>

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
Collapse
