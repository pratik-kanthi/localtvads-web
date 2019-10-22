<template>
    <div class="create-ad">
        <section class="bg--grey">
            <div class="container">
                <div class="row addons-wrapper">
                    <div class="col-lg-6" v-for="addon in addons" :key="addon._key">
                        <div class="addon">
                            <div class="name">
                                <h5>{{ addon.Name }}</h5>
                                <p class="desc">{{ addon.Description }}</p>
                            </div>
                            <div class="price">
                                <p class="lead brand-primary mb0">Ad now for just</p>
                                <h4 class="amount">{{ addon.TotalAmount | currency }}</h4>
                            </div>
                            <div class="benefits">
                                <ul class="mb8">
                                    <li v-for="benefit in addon.Benefits" :key="benefit">{{ benefit }}</li>
                                </ul>
                            </div>
                            <div class="selectaddon">
                                <button class="btn btn-primary btn-full" @click="selectAddon(addon)" :class="{ 'btn-selected': selectedAddon._id === addon._id }">
                                    <span v-if="selectedAddon._id === addon._id">Selected</span>
                                    <span v-else>Choose this Addon</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="action">
                    <center>
                        <button class="btn btn-danger border" @click="cancel">Cancel</button>
                        <button class="btn btn-primary" @click="goToPayment">
                            Proceed
                        </button>
                    </center>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import instance from '@/api';
export default {
    name: 'ChooseAddons',
    data() {
        return {
            addons: [],
            selectedAddon: {}
        };
    },
    methods: {
        cancel() {
            this.$router.push('/', () => { });
        },
        goToPayment() {
            this.$parent.selectedAddon = this.selectedAddon;
            this.$emit('advanceToPayment');
        },
        selectAddon(addon) {
            this.selectedAddon = addon;
        }
    },
    async created() {
        this.$parent.isLoading = true;
        try {
            let result = await instance.get('api/serviceaddons/all');
            this.addons = result.data;
            this.selectedAddon = this.addons[0];
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
    },

};
</script>

<style lang="scss">
.create-ad {
    .addons-wrapper {
        .addon {
            background-color: $white;
            border: 1px solid $brand-primary;
            border-radius: 6px;
            text-align: center;
            .name {
                padding: 12px 16px;
                border-bottom: 1px solid #ddd;
                h5 {
                    font-weight: 500;
                    font-size: 24px;
                    color: $brand-primary;
                    margin-bottom: 4px;
                }
                .desc {
                    font-size: 16px;
                    font-family: $font-family-heading;
                    font-weight: 400;
                    margin-bottom: 0;
                    opacity: 0.6;
                }
            }
            .price {
                padding: 12px 16px;
                border-bottom: 1px solid #ddd;
                .amount {
                    font-weight: 500;
                    font-size: 36px;
                    margin-bottom: 4px;
                    color: $brand-secondary;
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
                    background-color: $brand-secondary !important;
                    border: none;
                }
            }
        }
    }
    .action {
        padding: 80px 40px;
        .btn {
            min-width: 250px !important;
            margin-right: 20px;
            &.border {
                background: transparent;
                border: 1px solid $error !important;
                color: $error;
            }
        }
    }
}
</style>
