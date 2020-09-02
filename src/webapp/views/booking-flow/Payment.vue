<template>
    <div class="container mb80">
        <div v-show="!paymentLoading">
            <div v-if="isLoggedIn" class="payment-wrapper">
                <h3 class="mt64 brand-secondary">Payment</h3>
                <div class="row mt24">
                    <div class="col-md-8">
                        <div class="method-wrapper shadow-border">
                            <div class="t-xl brand-secondary">Billing Information</div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="t-m">Business Name</label>
                                        <input v-model="name" class="form-control input-small" type="text" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="t-m">VAT Number</label>
                                        <input v-model="vat" class="form-control input-small" type="text" />
                                    </div>
                                </div>
                            </div>

                            <div class="t-m black">Billing Address</div>
                            <div class="form-groupm mt16">
                                <AddressFinder :address.sync="address" type=""></AddressFinder>
                                <div v-if="address">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="line1">Line1</label>
                                                <input type="text" id="line1" v-model="address.Line1" class="form-control input-small" />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="line1">Line2</label>
                                                <input type="text" id="line1" v-model="address.Line2" class="form-control input-small" />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="town">Town/City</label>
                                                <input type="text" id="town" v-model="address.TownCity" class="form-control input-small" />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="postcode">PostCode</label>
                                                <input type="text" id="postcode" v-model="address.PostCode" class="form-control input-small" />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="country">Country</label>
                                        <input type="text" id="country" v-model="address.Country" class="form-control input-small" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="t-xl brand-secondary mt24">Select a Payment Method</div>
                        <div class="cards-wrapper">
                            <div class="method-wrapper shadow-border saved-cards mt16" v-if="savedCards.length > 0">
                                <div class="cards" :class="{ 'selection-card-option': activeToggle == 'SavedCards' }">
                                    <div class="method-title" @click="togglePaymentOptions('SavedCards')" :class="{ active: activeToggle === 'SavedCards' }">
                                        <div class="radio-btn-tick mr8">
                                            <input type="radio" v-model="activeToggle" value="SavedCards" />
                                            <label></label>
                                        </div>
                                        <span class="t-l black">Your Saved Cards</span>
                                    </div>
                                    <div v-show="activeToggle == 'SavedCards'" v-for="(card, key) in savedCards" :key="key" class="p16 card-info mt16" :class="{ active: existingCard === card._id }" @click="selectExistingCard(card._id)">
                                        <div class="d-flex">
                                            <div class="radio-btn-tick mr8">
                                                <input type="radio" v-model="existingCard" :value="card._id" :disabled="activeToggle !== 'SavedCards'" />
                                                <label></label>
                                            </div>

                                            <div class="w-100 d-flex justify-content-between">
                                                <div class="d-flex">
                                                    <img :src="getImageUrl(card.Card.Vendor)" alt />
                                                    <div class="card-number">xxxx xxxx xxxx {{ card.Card.LastFour }}</div>
                                                </div>
                                                <div class="card-number black">{{ card.Card.Name }}</div>
                                                <div class="card-number black">{{ card.Card.ExpiryMonth }} / {{ card.Card.ExpiryYear }}</div>
                                            </div>
                                        </div>
                                        <p class="red t-s mt0 mb0">{{ card._error }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="method-wrapper shadow-border mt16" :class="{ 'selection-card-option': activeToggle == 'NewCard' }">
                                <div class="method-title" @click="togglePaymentOptions('NewCard')" :class="{ active: activeToggle === 'NewCard' }">
                                    <div class="radio-btn-tick mr8">
                                        <input type="radio" v-model="activeToggle" value="NewCard" />
                                        <label></label>
                                    </div>
                                    <span class="t-l black">Credit or Debit Card</span>
                                    <!--div v-show="activeToggle == 'NewCard'" class="mt16 form-control" ref="card"></div-->
                                    <div v-show="activeToggle == 'NewCard'" class="mt16">
                                        <div class="form-group">
                                            <div class="form-control" ref="cardNumber"></div>
                                        </div>

                                        <div class="form-group">
                                            <input type="text" class="form-control black" placeholder="Name on the card" />
                                        </div>

                                        <div class="row mt16">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <div class="form-control" ref="cardExpiry"></div>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <div class="form-control" ref="cardCvc"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="cardError">
                                            <div class="error">{{ cardError }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mt-3 mt-md-0 rounded  d-flex flex-column justify-content-between ">
                        <div class="shadow-border p24">
                            <div class="booking-details ">
                                <h6 class="t-l medium text-center brand-secondary">Booking Receipt</h6>
                                <hr class="mt24 mb24" />
                                <div v-if="!$parent.isAnnouncement" class="row plan-items">
                                    <div class="col-md-8 col-6">
                                        <div class="brand-primary t-l">Channel Ad Plan</div>
                                    </div>
                                    <div class="col-md-4 col-6">
                                        <div class="black text-right">
                                            <div class="d-flex justify-content-end">
                                                <div>{{ $parent.clientAdPlan.PlanAmount | currency }}/week</div>
                                                <div class="pointer">
                                                    <i class="ml8 material-icons brand-primary t-xl" @mouseover="showPriceBreakdown(true)" @mouseout="showPriceBreakdown(false)">info</i>
                                                </div>
                                            </div>
                                            <div v-show="priceBreakDown" class="tooltip-info">
                                                <div class="t-s" :key="key" v-for="(slot, key) in $parent.clientAdPlan.ChannelProduct.ChannelSlots">{{ slot.Slot.Name }} - {{ (slot.RatePerSecond * slot.Duration * $parent.daysSelected.length) | currency }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="t-m">
                                            Plan Length:
                                            <span class="bold">{{ $parent.clientAdPlan.ChannelProduct.ProductLength.Name }}</span>
                                        </div>
                                        <div class="t-s d-block d-md-none">Days: {{ getSelectedDays(true) }}</div>
                                        <div class="t-m d-none d-md-block">
                                            Days:
                                            <span class="bold">{{ getSelectedDays(false) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row plan-items" v-else>
                                    <div class="col-md-8 col-6">
                                        <div class="brand-primary t-l">One Off</div>
                                    </div>
                                    <div class="col-md-4 col-6">
                                        <div class="black text-right">
                                            <div class="d-flex justify-content-end">
                                                <div>{{ $parent.clientAdPlan.PlanAmount | currency }}</div>
                                                <div class="pointer">
                                                    <i class="ml8 material-icons brand-primary t-xl" @mouseover="showPriceBreakdown(true)" @mouseout="showPriceBreakdown(false)">info</i>
                                                </div>
                                            </div>
                                            <div v-show="priceBreakDown" class="tooltip-info">
                                                <div class="t-s" :key="key" v-for="(slot, key) in $parent.clientAdPlan.ChannelProduct.ChannelSlots">{{ slot.Slot.Name }} - {{ (slot.RatePerSecond * slot.Duration * $parent.daysSelected.length) | currency }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="t-m">
                                            Plan Length:
                                            <span class="bold">{{ $parent.clientAdPlan.ChannelProduct.ProductLength.Name }}</span>
                                        </div>
                                        <div class="t-s d-block d-md-none">Days: {{ getSelectedDays(true) }}</div>
                                        <div class="t-m d-none d-md-block">
                                            Days:
                                            <span class="bold">{{ getSelectedDays(false) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between t-l mt48" v-if="$parent.clientAdPlan.Addons && $parent.clientAdPlan.Addons.length > 0">
                                    <div>
                                        <div>
                                            <div class="brand-primary d-flex flex-column flex-md-row align-items-md-end">
                                                <div>
                                                    {{ $parent.clientAdPlan.Addons[0].Name }}
                                                    <div>
                                                        <span class="tag-sm">Add On</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="t-s mt8" v-for="benefit in $parent.clientAdPlan.Addons[0].Benefits" :key="benefit">{{ benefit }}</div>
                                        </div>
                                    </div>
                                    <div class="black">{{ $parent.clientAdPlan.AddonsAmount | currency }}</div>
                                </div>
                                <hr class="mb24" />
                                <div class="total mt24">
                                    <div class="row">
                                        <div class="col-6 col-sm-6">
                                            <div class="taxes">
                                                <span class="t-l">Subtotal</span>
                                            </div>
                                        </div>
                                        <div class="col-6 col-sm-6 text-right">
                                            <div class="t-l black">{{ ($parent.clientAdPlan.PlanAmount + $parent.clientAdPlan.AddonsAmount) | currency }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="total mb32">
                                    <div class="row">
                                        <div class="col-6 col-sm-6">
                                            <div class="taxes">
                                                <span class="t-l">Taxes</span>
                                                <i class="material-icons" @mouseover="showTaxInfo(true)" @mouseout="showTaxInfo(false)">info</i>
                                                <div v-show="taxInfo" class="tooltip-info">
                                                    <div v-for="tax in taxes" :key="tax.Name">
                                                        <div class="name">
                                                            {{ tax.Name }}
                                                            <span>({{ tax.Description }})</span>
                                                        </div>
                                                        <div class="value text-right" v-if="tax.Type === 'PERCENTAGE'">{{ tax.Value }}%</div>
                                                        <div class="value text-right" v-else>{{ tax.Value | currency }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-6 col-sm-6 text-right" v-if="taxAmount">
                                            <div class="black">{{ taxAmount | currency }}</div>
                                        </div>
                                    </div>
                                    <div class="row mt32">
                                        <div class="col-6 col-sm-6">
                                            <h5 class="t-l">Total Payable</h5>
                                        </div>
                                        <div class="col-6 col-sm-6 text-right">
                                            <h5 class="amount t-l black pull-right">{{ ($parent.clientAdPlan.PlanAmount + $parent.clientAdPlan.AddonsAmount + taxAmount) | currency }}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="note black rounded">
                                    <i class="material-icons mt-icon-sub brand-primary">info</i>
                                    Total payable includes first week's charge plus any addons if selected.
                                </div>
                                <div class="note black rounded mt16">
                                    <i class="material-icons mt-icon-sub brand-primary">info</i>
                                    You will be charged on a weekly basis. Total amount for your plan will depend on the date your Ad starts airing
                                </div>
                                <div class="row mt24">
                                    <div class="col">
                                        <button :disabled="!isPayable" @click="payStripe" class="btn btn-success btn-icon form-control">
                                            <i class="material-icons">lock</i>
                                            Confirm Payment of
                                            <strong>{{ ($parent.clientAdPlan.PlanAmount + $parent.clientAdPlan.AddonsAmount + taxAmount) | currency }}</strong>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <h3 class="section-title-2 mb8 text-center">Please login to continue with your booking.</h3>
            </div>
        </div>
        <div v-show="paymentLoading" class="mt16 transaction-message">
            <p>Your transaction is being processed...</p>
            <p class="bold">Please do not click back or refresh</p>
        </div>
    </div>
</template>

<script>
import { get } from '@/services/ApiService';
import TaxService from '@/services/TaxService';
import ClientAdService from '@/services/ClientAdService';
import { paymentMixin } from '@/mixins/payment';
import Address from '@/models/Address';
import AddressFinder from '@/e9_components/components/AddressFinder';

export default {
    name: 'Payment',
    components: {
        AddressFinder
    },
    mixins: [paymentMixin],
    data() {
        return {
            taxes: [],
            taxAmount: 0,
            taxInfo: false,
            priceBreakDown: false,
            vat: '',
            name: '',
            address: new Address(),
            google: window.google,
            //eslint-disable-next-line
            elements: stripe.elements({
                fonts: [
                    {
                        cssSrc: 'https://use.typekit.net/xrc3emd.css'
                    }
                ]
            }),
            cardElement: null,
            cardExpiryElement: null,
            cardCvcElement: null,
            existingCard: null,
            paymentLoading: false,
            isCardValid: false,
            isExpValid: false,
            isCvcValid: false,
            cardError: null
        };
    },
    methods: {
        getSelectedDays(isMobile) {
            let days = ['', ' Monday', ' Tuesday', ' Wednesday', ' Thursday', ' Friday', ' Saturday', ' Sunday'];
            if (isMobile) days = ['', ' Mon', ' Tue', ' Wed', ' Thu', ' Fri', ' Sat', ' Sun'];
            return this.$parent.daysSelected
                .map(day => {
                    return days[day];
                })
                .join(',');
        },
        async getCards() {
            try {
                this.$parent.isLoading = true;
                let result = await get('api/:clientid/cards?client=' + this.$store.state.user.Owner._id);
                this.savedCards = result.data;
                if (this.savedCards.length > 0 && !this.activeToggle) {
                    this.activeToggle = 'SavedCards';
                } else {
                    this.activeToggle = 'NewCard';
                    this.loadCardJS();
                }
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
        async payStripe() {
            this.$swal({
                title: 'Proceed with payment?',
                text: 'Your card will be charged',
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Confirm'
            }).then(async isConfirm => {
                if (isConfirm.value) {
                    try {
                        window.scrollTo(0, 0);
                        this.paymentLoading = true;

                        let result, paymentMethod;

                        if (!this.existingCard) {
                            //eslint-disable-next-line
                            result = await stripe.createPaymentMethod({
                                type: 'card',
                                card: this.cardElement
                            });

                            if (result.error) {
                                this.cardError = result.error.message;
                                throw result.error;
                            } else {
                                paymentMethod = result.paymentMethod;
                            }
                        }

                        let obj = {
                            clientAdPlan: {
                                Client: this.$store.state.user.Owner._id,
                                Name: this.name,
                                VAT: this.vat,
                                Channel: this.$parent.clientAdPlan.Channel,
                                Days: this.$parent.clientAdPlan.Days,
                                ChannelProduct: this.$parent.clientAdPlan.ChannelProduct._id,
                                ChannelSlots: this.$parent.clientAdPlan.ChannelProduct.ChannelSlots.map(function(item) {
                                    return item.Slot._id;
                                }),
                                Addons: this.$parent.clientAdPlan.Addons && this.$parent.clientAdPlan.Addons.length > 0 ? [this.$parent.clientAdPlan.Addons[0]._id] : [],
                                BillingAddress: this.address
                            },
                            newCard: paymentMethod ? paymentMethod : null,
                            savedCard: this.existingCard ? this.existingCard : null
                        };
                        await ClientAdService.createSubscription(obj);
                        this.paymentLoading = false;
                        this.$swal({
                            title: 'Payment Successful',
                            text: 'Payment was successful',
                            type: 'success'
                        });
                        this.$emit('advanceToConfirmation');
                    } catch (err) {
                        this.paymentLoading = false;
                        this.$swal({
                            title: 'Error',
                            text: err.message,
                            type: 'error'
                        });
                        console.error(err);
                    }
                }
            });
        },
        showTaxInfo(isDisplay) {
            this.taxInfo = isDisplay;
        },
        showPriceBreakdown(isDisplay) {
            this.priceBreakDown = isDisplay;
        },
        togglePaymentOptions(option) {
            if (option === 'SavedCards' && this.savedCards.length > 0) {
                this.activeToggle = option;
            } else {
                this.existingCard = null;
                this.activeToggle = option;
                this.loadCardJS();
            }
        }
    },
    computed: {
        isProceedable() {
            return this.address.PostCode ? true : false;
        },
        isPayable() {
            if (this.address.PostCode && this.name && this.vat && (this.existingCard || (this.isCardValid && this.isExpValid && this.isCvcValid))) {
                return true;
            } else {
                return false;
            }
        }
    },
    mounted() {
        let style = {
            base: {
                color: '#',
                fontFamily: '"azo-sans-web", sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                },
                border: '1px solid #646464'
            },
            invalid: {
                color: '#ff65000',
                iconColor: '#fa755a'
            }
        };

        let cardNumberElement = this.elements.create('cardNumber', {
            showIcon: true,
            iconStyle: 'solid',
            placeholder: 'Credit/Debit Card Number',
            style: style
        });

        let cardExpiryElement = this.elements.create('cardExpiry', {
            style: style
        });
        let cardCvcElement = this.elements.create('cardCvc', {
            style: style
        });

        this.cardElement = cardNumberElement;
        this.cardExpiryElement = cardExpiryElement;
        this.cardCvcElement = cardCvcElement;

        cardNumberElement.mount(this.$refs.cardNumber);
        cardExpiryElement.mount(this.$refs.cardExpiry);
        cardCvcElement.mount(this.$refs.cardCvc);

        // validation
        this.cardElement.on('change', event => {
            if (event.complete) {
                this.isCardValid = true;
                this.cardError = null;
            } else if (event.error) {
                this.isCardValid = false;
            }
        });

        this.cardExpiryElement.on('change', event => {
            if (event.complete) {
                this.isExpValid = true;
                this.cardError = null;
            } else if (event.error) {
                this.isExpValid = false;
            }
        });

        this.cardCvcElement.on('change', event => {
            if (event.complete) {
                this.isCvcValid = true;
                this.cardError = null;
            } else if (event.error) {
                this.isCvcValid = false;
            }
        });
    },
    destroyed() {
        this.cardElement.destroy();
    },
    async created() {
        window.scrollTo(0, 0);
        if (!this.isLoggedIn()) {
            this.$store.commit('DIALOG_CHOSEN', 'login');
        } else {
            this.getCards();
        }

        this.taxes = await TaxService.getAllTaxes();
        for (let i = 0, len = this.taxes.length; i < len; i++) {
            if (this.taxes[i].Type === 'PERCENTAGE') {
                this.taxAmount += (this.taxes[i].Value * (this.$parent.clientAdPlan.PlanAmount + this.$parent.clientAdPlan.AddonsAmount)) / 100;
            } else {
                this.taxAmount += this.taxes[i].Value;
            }
        }
        this.loadCardJS();
    }
};
</script>

<style lang="scss" scoped>
.payment-wrapper {
    .booking-details {
        &:after {
            background: linear-gradient(-45deg, #ffffff 16px, transparent 0) linear-gradient(45deg, #ffffff 16px, transparent 0) repeat-x left bottom;
            background-size: 32px 32px;
            content: ' ';
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 32px;
        }

        .plan-items {
            i {
                position: relative;
                top: 4px;
                left: 4px;
                font-size: 18px;
                color: $brand-primary;
                cursor: pointer;
            }
        }
        .tooltip-info {
            width: 200px;
            text-align: left;
            position: absolute;
            right: 32px;
            color: $base;
            bottom: 8px;
            border-radius: 6px;
            background: #fff;
            padding: 8px 12px;
            box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
            font-size: 14px;
            z-index: 10;

            .name {
                display: inline-block;
                width: 80%;
            }

            .value {
                display: inline-block;
                width: 20%;
            }
        }

        img {
            display: block;
            max-width: 120px;
            margin: 0 auto 32px;
        }

        .content {
            margin-bottom: 32px;

            .addon-title {
                .desc {
                    text-transform: lowercase;
                }
            }

            .booking-items {
                margin-bottom: 24px;

                label {
                    font-size: 14px !important;
                    margin-bottom: 8px;
                    color: #acacac;
                }

                ul.benefits {
                    @include list-unstyled();

                    li {
                        font-size: 16px;
                        font-weight: 500;
                        margin-bottom: 8px;
                        padding-left: 24px;
                        font-family: $font-family-heading;
                        position: relative;

                        &:before {
                            content: '';
                            background-image: url('../../../assets/images/tick.svg');
                            height: 16px;
                            width: 16px;
                            left: 0;
                            top: 6px;
                            background-size: cover;
                            position: absolute;
                            background-repeat: no-repeat;
                        }
                    }
                }
            }
        }

        .dashed-line {
            position: relative;
            height: 1px;

            .line {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: linear-gradient(to right, #223049 50%, transparent 50%);
                background-size: 32px 100%;
            }
        }

        .total {
            .taxes {
                position: relative;

                i {
                    position: relative;
                    top: 4px;
                    left: 4px;
                    font-size: 18px;
                    color: $brand-primary;
                    cursor: pointer;
                }

                .tooltip-info {
                    width: 250px;
                    position: absolute;
                    left: 64px;
                    color: $base;
                    bottom: 6px;
                    border-radius: 6px;
                    background: #fff;
                    padding: 8px 12px;
                    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
                    font-size: 12px;
                    z-index: 10;

                    .name {
                        display: inline-block;
                        width: 80%;
                    }

                    .value {
                        display: inline-block;
                        width: 20%;
                    }
                }
            }

            h5 {
                font-weight: 500;
                line-height: 32px;

                .amount {
                    text-align: right !important;
                }
            }
        }
    }

    .method-wrapper {
        padding: 24px;
        border-radius: 6px;
    }

    .cards-wrapper {
        .saved-cards {
            border-radius: 6px;
            margin-bottom: 8px;

            .cards {
                max-height: 300px;
                overflow-y: auto;
                overflow-x: hidden;

                input[type='radio'] {
                    margin-left: 1px;
                }

                .method-title {
                    margin-bottom: 0px;
                    cursor: pointer;

                    .radio-btn-dot {
                        top: 2px;
                    }
                }

                .card-info {
                    opacity: 0.5;
                    border-radius: 6px;
                    cursor: pointer;
                    z-index: 100;

                    .radio-btn-tick {
                        top: 4px;
                    }

                    span.card-number {
                        letter-spacing: 2px;
                    }

                    img {
                        width: 32px;
                        margin-right: 16px;
                    }

                    &.active {
                        opacity: 1;
                        background: #fcf5ee;
                        border: 1px solid #fbd8b4;

                        span {
                            font-weight: 600;
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 767px) {
        .payment-wrapper {
            padding: 24px 0;

            .cards-wrapper {
                background: transparent;
                border-radius: 0;
                padding: 0;
                border: none;

                .saved-cards {
                    .cards {
                        max-height: 175px;
                    }
                }
            }
        }
    }

    @media only screen and (max-device-width: 320px) and (-webkit-min-device-pixel-ratio: 2) {
        .payment-wrapper {
            .cards-wrapper {
                .saved-cards {
                    .cards {
                        .card-info {
                            img {
                                width: 40px;
                            }
                        }
                    }
                }
            }
        }
    }

    /* iPad Portrait */
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        .payment-wrapper {
            .cards-wrapper {
                margin-top: 24px;
            }
        }
    }

    /* iPad Landscape */
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
        .payment-wrapper {
            padding: 24px 0;
        }
    }

    /* iPad Pro Portrait */
    @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        .payment-wrapper {
            .cards-wrapper {
                margin-top: 0;
            }
        }
    }
}

/* iPhone 5/SE Portrait */
@media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
    .payment-wrapper {
        padding: 0;
    }
}

/* iPhone 6, 6S, 7 and 8 Portrait */
@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
    .payment-wrapper {
        padding: 0;
    }
}

/* iPhone X Portrait */
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
    .payment-wrapper {
        padding: 0;

        .cards-wrapper {
            .saved-cards {
                .cards {
                    .card-info {
                        img {
                            width: 32px;
                        }
                    }
                }
            }
        }
    }
}

.transaction-message {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-items: center;
    justify-content: center;
    font-size: 20px;
    letter-spacing: 0.75px;
    background-color: #fff;
    height: 500px;
    width: 100%;
    color: $brand-secondary;
}
</style>
