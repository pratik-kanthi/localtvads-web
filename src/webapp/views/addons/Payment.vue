<template>
    <div class="container">
        <div v-if="!paymentLoading">
            <div v-if="isLoggedIn" class="payment-wrapper">
                <h3 class="mt64 brand-secondary">Step 3 : Payment</h3>
                <div class="row mt48">
                    <div class="col-lg-7">
                        <div class="booking-details">
                            <h6 class="t-l medium text-center brand-secondary">Booking Receipt</h6>
                            <hr class="mb24" />

                            <div class="row plan-items">
                                <div class="col-md-8 col-6"><div class="brand-primary t-l">Channel Ad Plan</div></div>
                                <div class="col-md-4 col-6">
                                    <div class="black text-right">
                                        <div class="d-flex justify-content-end">
                                            <div>{{ $parent.clientAdPlan.PlanAmount | currency }}/week</div>
                                            <div class="pointer"><i class="ml8 material-icons brand-primary t-xl" @mouseover="showPriceBreakdown(true)" @mouseout="showPriceBreakdown(false)">info</i></div>
                                        </div>
                                        <div v-show="priceBreakDown" class="tooltip-info">
                                            <div class="t-s" :key="key" v-for="(slot, key) in $parent.clientAdPlan.ChannelProduct.ChannelSlots">{{ slot.Slot.Name }} - {{ (slot.RatePerSecond * slot.Duration * $parent.daysSelected.length) | currency }}</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-8">
                                    <div class="t-m">
                                        Plan Length: <span class="bold">{{ $parent.clientAdPlan.ChannelProduct.ProductLength.Name }}</span>
                                    </div>
                                    <div class="t-s d-block d-md-none">Days: {{ getSelectedDays(true) }}</div>
                                    <div class="t-m d-none d-md-block">
                                        Days: <span class="bold">{{ getSelectedDays(false) }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between t-l mt48" v-if="$parent.clientAdPlan.Addons && $parent.clientAdPlan.Addons.length > 0">
                                <div>
                                    <div>
                                        <div class="brand-primary d-flex flex-column flex-md-row align-items-md-end">
                                            <div>{{ $parent.clientAdPlan.Addons[0].Name }}</div>
                                            <div class="ml-md-2"><span class="tag-sm">Add On</span></div>
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
                                            <span class="t-xl">Net Amount</span>
                                        </div>
                                    </div>
                                    <div class="col-6 col-sm-6 text-right">
                                        <div class="t-xl black">{{ ($parent.clientAdPlan.PlanAmount + $parent.clientAdPlan.AddonsAmount) | currency }}</div>
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
                                <div class="dashed-line mt16">
                                    <div class="line"></div>
                                </div>
                                <div class="row mt32">
                                    <div class="col-6 col-sm-6">
                                        <h5 class="t-xl">Total Payable</h5>
                                    </div>
                                    <div class="col-6 col-sm-6 text-right">
                                        <h5 class="amount t-xl black pull-right">{{ ($parent.clientAdPlan.PlanAmount + $parent.clientAdPlan.AddonsAmount + taxAmount) | currency }}</h5>
                                    </div>
                                </div>
                                <div class="t-m italic mt16 mb0">
                                    Note: Total payable includes first week's charge plus any addons if selected.
                                </div>
                            </div>
                            <div class="dashed-line">
                                <div class="line"></div>
                            </div>
                            <div class="t-m italic mt16 mb0">
                                Note: You will be charged on a weekly basis. Total amount for your plan will depend on the date your Ad starts airing.
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-5 mt-xs16">
                        <div class="cards-wrapper">
                            <div class="saved-cards" v-if="savedCards.length > 0">
                                <div class="cards">
                                    <div class="card-title" @click="togglePaymentOptions('SavedCards')" :class="{ active: activeToggle === 'SavedCards' }">
                                        <div class="radio-btn-dot mr8">
                                            <input type="radio" v-model="activeToggle" value="SavedCards" />
                                            <label></label>
                                        </div>
                                        <span>Your saved cards</span>
                                    </div>
                                    <div v-for="(card, key) in savedCards" :key="key" class="card-info" :class="{ active: existingCard === card._id }" @click="selectExistingCard(card._id)">
                                        <div class="radio-btn-tick mr8">
                                            <input type="radio" v-model="existingCard" :value="card._id" :disabled="activeToggle !== 'SavedCards'" />
                                            <label></label>
                                        </div>
                                        <img :src="getImageUrl(card.Card.Vendor)" alt />
                                        <span class="card-number">xxxx xxxx xxxx {{ card.Card.LastFour }}</span>
                                        <p class="red t-s mt0 mb0">{{ card._error }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="new-card">
                                <form ref="form" class="p0">
                                    <div class="card-title" @click="togglePaymentOptions('NewCard')" :class="{ active: activeToggle === 'NewCard' }">
                                        <div class="radio-btn-dot mr8">
                                            <input type="radio" v-model="activeToggle" value="NewCard" />
                                            <label></label>
                                        </div>
                                        <span>New credit and debit card</span>
                                    </div>
                                    <div class="hidden-container"></div>
                                    <div class="form-group">
                                        <label class="mb8">Card Number</label>
                                        <div class="input-card-number">
                                            <input name="number" type="tel" class="form-control" v-model="cardNumber" :disabled="activeToggle !== 'NewCard'" />
                                            <img :src="getCardType" alt class="pull-right" />
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for class="mb8">Cardholder Name</label>
                                        <input name="name" type="text" class="form-control" v-model="name" autocomplete="off" :disabled="activeToggle !== 'NewCard'" />
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label class="mb8">Expiry Date</label>
                                                <input name="expiry" type="tel" class="form-control" v-model="expiry" placeholder="••/••••" :disabled="activeToggle !== 'NewCard'" />
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label class="mb8">CVV</label>
                                                <input name="cvc" type="password" class="form-control" v-model="cvv" :disabled="activeToggle !== 'NewCard'" />
                                            </div>
                                        </div>
                                    </div>
                                    <p class="red t-s mb0">{{ newCardError }}</p>
                                    <!-- <div class="consents">
                                        <input type="checkbox" id="save" class="check" v-model="save" :disabled="activeToggle !== 'NewCard'" />
                                        <label for="save" class="check-label box mt8 mr8">
                                            <span></span>
                                        </label>
                                        <span class="brand-primary medium">Save Card</span>
                                    </div> -->
                                </form>
                            </div>
                            <p class="mt16 mb16">I have read and accept the terms of use,rules of Local TV Ads and privacy policy</p>
                            <button type="button" class="btn btn-success btn-full" :disabled="!isProceedable && !existingCard" @click="generateToken">Pay Now</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <h3 class="section-title-2 mb8 text-center">Please login to continue with your booking.</h3>
            </div>
        </div>
        <div class="mt16 transaction-message" v-else>
            <p>Your transaction is being processed...</p>
            <p class="bold">Please do not click back or refresh</p>
        </div>
    </div>
</template>

<script>
import instance from '@/api';
import TaxService from '@/services/TaxService';
import { paymentMixin } from '@/mixins/payment';
export default {
    name: 'Payment',
    mixins: [paymentMixin],
    data() {
        return {
            taxes: [],
            taxAmount: 0,
            taxInfo: false,
            priceBreakDown: false
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
                let result = await instance.get('api/client/cards?client=' + this.$store.state.user.Owner._id);
                this.savedCards = result.data;

                if (this.savedCards.length > 0 && !this.activeToggle) {
                    this.activeToggle = 'SavedCards';
                    this.existingCard = this.savedCards.find(s => s.IsPreferred)._id;
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
        async payNow(token, client) {
            let obj = {
                save: this.save,
                clientAdPlan: {
                    Client: client,
                    Channel: this.$parent.clientAdPlan.Channel,
                    Days: this.$parent.clientAdPlan.Days,
                    ChannelProduct: this.$parent.clientAdPlan.ChannelProduct._id,
                    ChannelSlots: this.$parent.clientAdPlan.ChannelProduct.ChannelSlots.map(function(item) {
                        return item.Slot._id;
                    }),
                    Addons: this.$parent.clientAdPlan.Addons && this.$parent.clientAdPlan.Addons.length > 0 ? [this.$parent.clientAdPlan.Addons[0]._id] : []
                },
                cardId: this.existingCard,
                token: token
            };
            let result;
            try {
                result = await instance.post('api/clientad/new', obj);
                this.$swal({
                    title: 'Successful',
                    text: 'Payment has been successful.',
                    type: 'success'
                });
                this.$parent.transaction = result.data;
                this.$emit('advanceToConfirmation');
            } catch (err) {
                this.paymentLoading = false;
                if (err.status == 402) {
                    if (this.existingCard) {
                        this.newCardError = '';
                        for (let i = 0, len = this.savedCards.length; i < len; i++) {
                            if (this.savedCards[i]._id == this.existingCard) {
                                this.savedCards[i]._error = err.data;
                            } else {
                                this.savedCards[i]._error = '';
                            }
                        }
                    } else {
                        this.newCardError = err.data;
                    }
                    this.$swal({
                        title: 'Payment Error',
                        text: err.error,
                        type: 'error'
                    });
                } else
                    this.$swal({
                        title: 'Error',
                        text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                        type: 'error'
                    });
                console.error(err);
            }
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
                this.existingCard = this.savedCards.find(s => s.IsPreferred)._id;
            } else {
                this.existingCard = null;
                this.activeToggle = option;
                this.loadCardJS();
            }
        }
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
        height: 100%;
        padding: 24px;
        position: relative;
        background-color: $white;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

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

    .cards-wrapper {
        background-color: $white;
        border-radius: 8px;
        padding: 24px;
        height: 100%;
        border: solid 1.4px #cecece;

        .saved-cards {
            border: 1px solid #4a90e2;
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 8px;

            .cards {
                max-height: 158px;
                overflow-y: auto;
                overflow-x: hidden;

                input[type='radio'] {
                    margin-left: 1px;
                }

                .card-title {
                    margin-bottom: 20px;
                    cursor: pointer;

                    .radio-btn-dot {
                        top: 2px;
                    }

                    span {
                        font-family: $font-family-heading;
                        font-size: 16px;
                        font-weight: 500;
                        color: rgba(0, 0, 0, 0.87);
                    }
                }

                .card-info {
                    margin-bottom: 24px;
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
                        width: 56px;
                        margin-right: 16px;
                    }

                    &.active {
                        opacity: 1;

                        span {
                            font-weight: 600;
                        }
                    }
                }
            }
        }

        .new-card {
            border: 1px solid #4a90e2;
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 8px;

            form {
                padding: 16px 0;

                .card-title {
                    margin-bottom: 20px;
                    cursor: pointer;

                    .radio-btn-dot {
                        top: 2px;
                    }

                    span {
                        font-family: $font-family-heading;
                        font-size: 16px;
                        font-weight: 500;
                        color: rgba(0, 0, 0, 0.87);
                    }
                }

                label {
                    font-size: 14px;
                    font-weight: 300;
                }

                .consents {
                    position: relative;

                    i {
                        position: relative;
                        top: 3px;
                        left: 6px;
                        font-size: 18px;
                        color: $brand-primary;
                        cursor: pointer;
                    }

                    .tooltip-info {
                        width: 250px;
                        position: absolute;
                        left: 126px;
                        top: -80px;
                        border-radius: 6px;
                        background: #fff;
                        padding: 8px 12px;
                        box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
                    }
                }
            }

            .input-card-number {
                width: 100%;
                position: relative;

                img {
                    position: absolute;
                    right: 10px;
                    width: 40px;
                    top: 36px;
                    overflow: auto;
                    z-index: 2 !important;
                }
            }

            .hidden-container {
                display: none;
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
