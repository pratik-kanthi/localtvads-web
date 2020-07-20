<template>
    <div class="payment bg--grey">
        <div v-if="showCoupons">
            <CoupnsModal :show-coupons="showCoupons" :options="{ channel: $route.query.channel, adSchedule: $parent.selectedPlan.adSchedule, startDate: $parent.selectedPlan.broadcastStartDate }" @discountChosen="setDiscount"></CoupnsModal>
        </div>
        <div v-if="!paymentLoading">
            <div class="container">
                <div class="payment-wrapper">
                    <h3 class="mt64 brand-secondary">Step 3 : Payment</h3>
                    <div class="row mt48">
                        <div class="col-lg-6">
                            <div class="booking-details">
                                <img class src="@/assets/images/new_logo_dark.png" alt />
                                <div class="header">
                                    <h6>Booking Receipt</h6>
                                </div>
                                <hr class="mb24" />
                                <div class="content">
                                    <div class="booking-items">
                                        <label>Channel</label>
                                        <h6 class="hero-text">{{ $parent.selectedPlan.Channel.Name }}</h6>
                                    </div>
                                    <div class="booking-items">
                                        <label>Selected Slots</label>
                                        <h6 class="hero-text" :key="key" v-for="(slot, key) in $parent.selectedPlan.slots">{{ slot.Name }} ( {{ slot.StartTime }} - {{ slot.EndTime }})</h6>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="booking-items">
                                                <label>Plan Duration</label>
                                                <h6 class="hero-text">{{ $parent.selectedPlan.planLength }} months</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="recurring mb40" v-if="$parent.selectedPlan.isRenewal">
                                        <h6 class="hero-text"><i class="material-icons">done</i> Recurring Broadcast</h6>
                                    </div>
                                </div>
                                <div class="dashed-line">
                                    <div class="line"></div>
                                </div>
                                <div class="total mt32 mb32">
                                    <div class="row">
                                        <div class="col-6 col-sm-6">
                                            <p>Subscription Amount</p>
                                        </div>
                                        <div class="col-6 col-sm-6 text-right">
                                            <p>{{ $parent.selectedPlan.baseAmount | currency }}</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 col-sm-6">
                                            <p v-if="discount">Discount {{ discount.AmountType === 'PERCENTAGE' ? '(' + discount.Amount + '%' + ')' : '' }}</p>
                                        </div>
                                        <div class="col-6 col-sm-6 text-right">
                                            <p class="green" v-if="discount">- {{ discountAmount | currency }}</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 col-sm-6">
                                            <div class="taxes">
                                                <span>Taxes</span>
                                                <i class="material-icons" @mouseover="showTaxInfo(true)" @mouseout="showTaxInfo(false)">info</i>
                                                <div v-show="taxInfo" class="tooltip-info">
                                                    <div v-for="tax in this.$parent.selectedPlan.taxes" :key="tax.Name">
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
                                        <div class="col-6 col-sm-6 text-right">
                                            <p>{{ taxAmount | currency }}</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 col-sm-6">
                                            <h5>Total Amount</h5>
                                        </div>
                                        <div class="col-6 col-sm-6 text-right">
                                            <h5 class="amount pull-right">{{ getTotalAmount | currency }}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="dashed-line">
                                    <div class="line"></div>
                                </div>
                                <p class="mt32">
                                    <small>*All tax inclusive</small>
                                </p>
                            </div>
                        </div>
                        <div v-if="isLoggedIn()" class="col-lg-6 mt-xs16">
                            <div class="cards-wrapper">
                                <div class="saved-cards" v-if="savedCards.length > 0">
                                    <div class="cards">
                                        <div class="card-title mb24" @click="togglePaymentOptions('SavedCards')" :class="{ active: activeToggle === 'SavedCards' }">
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
                                            <span>xxxx xxxx xxxx {{ card.Card.LastFour }}</span>
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
                                        <div class="consents">
                                            <input type="checkbox" id="save" class="check" v-model="save" :disabled="(savedCards.length === 0 && $parent.selectedPlan.isRenewal) || activeToggle !== 'NewCard'" />
                                            <label for="save" class="check-label box mt8 mr8">
                                                <span></span>
                                            </label>
                                            <span class="brand-primary medium">Save Card</span>
                                            <i class="material-icons" v-if="savedCards.length === 0 && $parent.selectedPlan.isRenewal" @mouseover="showInfo(true)" @mouseout="showInfo(false)">info</i>
                                            <span v-show="tooltip" class="tooltip-info">Your current plan is a recurring one and you don't have any saved cards. Saving a card is mandatory in this case.</span>
                                        </div>
                                    </form>
                                </div>
                                <div class="coupon">
                                    <div class="coupon-area">
                                        <div v-if="!discount">APPLY COUPON</div>
                                        <div class="bold t-l" v-else>{{ discount.CouponCode }}</div>
                                    </div>
                                    <div class="action">
                                        <a @click="openCouponsModal" v-if="!discount">
                                            <i class="material-icons brand-primary">keyboard_arrow_right</i>
                                        </a>
                                        <a @click="setDiscount(undefined)" v-else>
                                            <i class="material-icons brand-primary">close</i>
                                        </a>
                                    </div>
                                </div>
                                <p class="mt16 mb16">By proceeding you agree that you have read and accept the terms of use, rules of Local TV Ads and privacy policy</p>
                                <button type="button" class="btn btn-success btn-full" :disabled="!isProceedable && !existingCard" @click="generateToken">Pay Now</button>
                            </div>
                        </div>
                        <div v-else class="col-sm-6 p24">
                            <div class="t-xl d-none d-md-block">Please login to continue with payment</div>
                            <div class="t-l mt16 text-center d-block d-md-none">Please login to continue with payment</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt16 transaction-message" v-else>
            <div class="p24 text-center">
                <p>Your transaction is being processed...</p>
                <p class="bold">Please do not click back or refresh</p>
            </div>
        </div>
    </div>
</template>

<script>
import instance from '@/api';
import { paymentMixin } from '@/mixins/payment';
import CoupnsModal from '@/webapp/common/modals/CouponsModal';

export default {
    name: 'Payment',
    components: {
        CoupnsModal
    },
    mixins: [paymentMixin],
    data() {
        return {
            consent: false,
            discount: null,
            discountAmount: 0,
            showCoupons: false,
            taxInfo: false,
            tooltip: false,
            taxAmount: 0
        };
    },
    methods: {
        calculateDiscount() {
            if (this.discount.AmountType === 'PERCENTAGE') {
                return (this.discount.Amount * this.$parent.selectedPlan.baseAmount) / 100;
            } else return this.discount.Amount;
        },
        async getCards() {
            try {
                this.$parent.isLoading = true;
                let result = await instance.get('api/client/cards?client=' + this.$store.state.user.Owner._id);
                this.savedCards = result.data;
                if (this.$parent.selectedPlan.isRenewal && this.savedCards.length === 0) {
                    this.save = true;
                }
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
        getTaxAmount() {
            let subTotal = this.$parent.selectedPlan.baseAmount - this.discountAmount;
            this.taxAmount = 0;
            this.$parent.selectedPlan.taxes.map(tax => {
                if (tax.Type === 'PERCENTAGE') {
                    this.taxAmount += (tax.Value * subTotal) / 100;
                } else this.taxAmount = tax.Value;
            });
        },
        showLogin() {
            this.$store.commit('DIALOG_CHOSEN', 'login');
        },
        openCouponsModal() {
            this.showCoupons = true;
        },
        async payNow(token, client) {
            let clientAdPlanName = this.$parent.selectedPlan.Channel.Name;
            this.$parent.selectedPlan.slots.map(slot => {
                clientAdPlanName += '_' + slot.Name;
            });

            this.$parent.selectedPlan.Channel = this.$parent.selectedPlan.Channel._id;
            this.$parent.selectedPlan.slots = this.$parent.selectedPlan.slots.map(slot => {
                return slot._id;
            });

            let obj = {
                save: this.save,
                clientadplan: {
                    Name: clientAdPlanName,
                    Client: client
                },
                channelplan: this.$parent.selectedPlan,
                cardid: this.existingCard,
                addons: [],
                token: token,
                client: client,
                coupon: this.discount ? this.discount.CouponCode : ''
            };
            let result;
            try {
                result = await instance.post('api/clientad/new', obj);
                this.$router.push(
                    {
                        name: 'BookingFlow',
                        query: {
                            clientadplan: result.data._id
                        }
                    },
                    () => {}
                );
                this.$swal({
                    title: 'Successful',
                    text: 'Payment has been successful. You are now being redirected to ad details and video upload',
                    type: 'success'
                });
                await this.$parent.fetchClientAdPlan(result.data._id);
            } catch (err) {
                this.paymentLoading = false;
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },

        setDiscount(discount) {
            this.showCoupons = false;
            this.discount = discount;
            if (discount) this.discountAmount = this.calculateDiscount();
            else this.discountAmount = 0;
            this.getTaxAmount();
        },
        showInfo(isDisplay) {
            this.tooltip = isDisplay;
        },
        showTaxInfo(isDisplay) {
            this.taxInfo = isDisplay;
        },
        togglePaymentOptions(option) {
            if (option === 'SavedCards' && this.savedCards.length > 0) {
                this.activeToggle = option;
                this.existingCard = this.savedCards.find(s => s.IsPreferred)._id;
            } else {
                this.existingCard = null;
                this.activeToggle = option;
                if (this.$parent.selectedPlan.isRenewal && this.savedCards.length === 0) {
                    this.save = true;
                }
                this.loadCardJS();
            }
        }
    },
    computed: {
        getTotalAmount() {
            let total = 0;
            if (this.$parent.selectedPlan.planLength == 3) {
                this.$parent.selectedPlan.slots.map(slot => {
                    total += slot.BaseAmount;
                });
            } else {
                this.$parent.selectedPlan.slots.map(slot => {
                    total += slot.BaseAmount2;
                });
            }

            return total;
        }
    },
    created() {
        window.scrollTo(0, 0);
        if (this.isLoggedIn()) {
            this.getCards();
        }
        this.loadCardJS();
        //this.getTaxAmount();
    }
};
</script>

<style lang="scss" scoped>
.payment {
    .payment-wrapper {
        padding: 24px 64px;
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
            img {
                display: block;
                max-width: 120px;
                margin: 0 auto 32px;
            }
            .header {
                h6 {
                    font-size: 16px;
                    font-weight: 500;
                }
            }
            .content {
                margin-bottom: 32px;
                .booking-items {
                    margin-bottom: 24px;
                    label {
                        font-size: 14px !important;
                        margin-bottom: 4px;
                        color: #acacac;
                    }
                    .desc {
                        font-size: 16px;
                        font-weight: 500;
                        color: $brand-secondary;
                    }
                }

                .recurring {
                    h6 {
                        color: #4c4c4c;
                        position: relative;
                        padding-left: 28px;
                        line-height: 22px;
                        i {
                            background: $brand-primary;
                            color: white;
                            font-size: 16px;
                            position: absolute;
                            padding: 2px;
                            left: 0;
                            top: 1px;
                            border-radius: 3px;
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
                        .radio-btn-tick {
                            top: 4px;
                        }
                        span {
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
            .coupon {
                border: 1px solid #4a90e2;
                border-radius: 6px;
                padding: 16px;
                .coupon-area {
                    display: inline-block;
                    width: 85%;
                    input {
                        width: 100%;
                        background-color: transparent;
                        border: 0;
                        height: 20px;
                        color: $base;
                        -webkit-appearance: none;
                        &:focus {
                            outline: none;
                        }
                    }
                    margin-right: 16px;
                }
                .action {
                    display: inline-block;
                    width: 10%;
                    a {
                        line-height: 32px;
                        padding: 9px 6px;
                        border-radius: 50%;
                        border: 1px solid #ddd;
                        i {
                            vertical-align: middle;
                            margin-bottom: 5px;
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
                .coupon {
                    .coupon-area {
                        width: 80%;
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
</style>
