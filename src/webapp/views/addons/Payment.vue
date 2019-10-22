<template>
    <section>
        <div class="container" v-if="!paymentLoading">
            <div v-if="isLoggedIn()" class="payment-wrapper">
                <h3 class="section-title-2 mb24">Payment Method</h3>
                <div class="row">
                    <div class="col-lg-6">
                        <div class="booking-details">
                            <img class="" src="@/assets/images/logo-dark.svg" alt="">
                            <div class="header">
                                <h6>Booking Receipt</h6>
                            </div>
                            <hr class="mb24">
                            <div class="content">
                                <div class="booking-items">
                                    <label>Benefits</label>
                                    <ul class="benefits">
                                        <li v-for="benefit in this.$parent.selectedAddon.Benefits" :key="benefit">{{ benefit }}</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="dashed-line">
                                <div class="line"></div>
                            </div>
                            <div class="total mt32 mb32">
                                <div class="row">
                                    <div class="col-6 col-sm-6">
                                        <p>Addon Amount</p>
                                    </div>
                                    <div class="col-6 col-sm-6 text-right">
                                        <p>
                                            {{ $parent.selectedAddon.Amount | currency }}
                                        </p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 col-sm-6">
                                        <p>Taxes</p>
                                    </div>
                                    <div class="col-6 col-sm-6 text-right">
                                        <p>{{ $parent.selectedAddon.TaxAmount | currency }}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 col-sm-6">
                                        <h5>Total Amount</h5>
                                    </div>
                                    <div class="col-6 col-sm-6 text-right">
                                        <h5 class="amount pull-right"> {{ $parent.selectedAddon.TotalAmount | currency }}</h5>
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
                    <div class="col-lg-6 mt-xs16">
                        <div class="cards-wrapper">
                            <div class="saved-cards" v-if="savedCards.length > 0">
                                <div class="cards">
                                    <h6 class="hero-text mb24" @click="togglePaymentOptions('SavedCards')" :class="{'active':activeToggle === 'SavedCards'}">
                                        <input type="radio" class="mr8" v-model="activeToggle" value="SavedCards">
                                        <span>Your saved cards</span>
                                    </h6>
                                    <div v-for="(card,key) in savedCards" :key="key" class="card-info" :class="{'active': existingCard === card._id}" @click="selectExistingCard(card._id)">
                                        <input type="radio" class="mr8" v-model="existingCard" :value="card._id" :disabled="activeToggle !== 'SavedCards'">
                                        <img :src="getImageUrl(card.Card.Vendor)" alt />
                                        <span>xxxx xxxx xxxx {{ card.Card.LastFour }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="new-card">
                                <form ref="form" class="p0">
                                    <h6 class="hero-text mb16" @click="togglePaymentOptions('NewCard')">
                                        <input type="radio" class="mr8" v-model="activeToggle" value="NewCard">
                                        <span :class="{'active':activeToggle === 'NewCard'}">New credit and debit card</span>
                                    </h6>
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
    </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import instance from '@/api';
import Card from 'card';
export default {
    name: 'Payment',
    data() {
        return {
            activeToggle: '',
            cardNumber: null,
            cvv: null,
            cardObj: null,
            paymentLoading: false,
            expiry: null,
            existingCard: null,
            name: '',
            savedCards: [],
            save: false,
        };
    },
    methods: {
        generateToken() {
            this.$swal({
                title: 'Are you sure?',
                text: 'Payment will be processed',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                closeOnConfirm: true
            }).then(isConfirm => {
                if (isConfirm.value) {
                    this.paymentLoading = true;
                    window.scrollTo(0, 0);
                    let user = this.getUser();
                    if (this.existingCard) {
                        this.payNow(null, user.Owner._id);
                    } else {
                        Stripe.card.createToken({
                            number: this.cardNumber,
                            cvc: this.cvv,
                            exp_month: this.expiry.substring(0, 2),
                            exp_year: parseInt(
                                this.expiry.substring(this.expiry.indexOf('/') + 1)
                            ),
                            name: this.name
                        },
                        (code, result) => {
                            if (code === 200) {
                                this.payNow(result.id, user.Owner._id);
                            } else {
                                this.paymentLoading = false;
                                this.$swal({
                                    title: 'Error',
                                    text: result && result.error && result.error.message ? result.error.message : 'Some error occurred',
                                    type: 'error'
                                });
                                throw result;
                            }
                        }
                        );
                    }
                }
            });
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
        getImageUrl(vendor) {
            return require('@/assets/images/cards/' + vendor + '.svg');
        },
        loadCardJS() {
            setTimeout(() => {
                this.cardObj = new Card({
                    form: this.$refs.form,
                    container: '.hidden-container',
                    placeholders: {
                        expiry: '••/••••',
                        number: '•••• •••• •••• ••••'
                    }
                });
            }, 100);
        },
        async payNow(token, client) {
            let obj = {
                save: this.save,
                addon: this.$parent.selectedAddon,
                cardid: this.existingCard,
                token: token,
                client: client
            };
            try {
                let result = await instance.post('api/serviceaddons/save', obj);
                this.$router.push({
                    name: 'Addons',
                    query: {
                        clientaddon: result.data._id
                    }
                }, () => {
                });
                this.$swal({
                    title: 'Successful',
                    text: 'Payment has been successful. You are now being redirected to upload',
                    type: 'success'
                });
                // await this.$parent.fetchClientAdPlan(result.data._id);
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
        selectExistingCard(card) {
            if (this.activeToggle === 'SavedCards')
                this.existingCard = card;
        }, async togglePaymentOptions(option) {
            if (option === 'SavedCards' && this.savedCards.length > 0) {
                this.existingCard = this.savedCards.find(s => s.IsPreferred)._id;
            } else {
                this.existingCard = null;
                this.loadCardJS();
            }
        },
        ...mapGetters(['isLoggedIn', 'getUser'])
    },
    computed: {
        getCardType() {
            if (this.cardNumber) {
                let re = new RegExp('^4');
                if (this.cardNumber.match(re) != null)
                    return require('@/assets/images/cards/VISA.svg');

                // Mastercard
                // Updated for Mastercard 2017 BINs expansion
                if (/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(this.cardNumber))
                    return require('@/assets/images/cards/MASTERCARD.svg');

                // AMEX
                re = new RegExp('^3[47]');
                if (this.cardNumber.match(re) != null)
                    return require('@/assets/images/cards/AMERICANEXPRESS.svg');

                // Discover
                re = new RegExp('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)'
                );
                if (this.cardNumber.match(re) != null)
                    return require('@/assets/images/cards/DISCOVER.svg');

                // Diners
                re = new RegExp('^36');
                if (this.cardNumber.match(re) != null)
                    return require('@/assets/images/cards/DINERSCLUB.svg');

                // Diners - Carte Blanche
                re = new RegExp('^30[0-5]');
                if (this.cardNumber.match(re) != null)
                    return require('@/assets/images/cards/DINERSCLUB.svg');

                // JCB
                re = new RegExp('^35(2[89]|[3-8][0-9])');
                if (this.cardNumber.match(re) != null)
                    return require('@/assets/images/cards/JCB.svg');

                // Visa Electron
                re = new RegExp('^(4026|417500|4508|4844|491(3|7))');
                if (this.cardNumber.match(re) != null)
                    return require('@/assets/images/cards/VISA.svg');
            }
            return '';
        },
        isProceedable() {
            return (
                this.name &&
                this.cvv &&
                this.cardNumber &&
                this.cardNumber.length > 12 &&
                this.cardNumber.length <= 19 &&
                this.expiry &&
                new Date(this.expiry.substring(this.expiry.indexOf('/') + 1), this.expiry.substring(0, 2))
            );
        },
        ...mapState(['isAuth'])
    },
    created() {
        window.scrollTo(0, 0);
        if (!this.isLoggedIn()) {
            this.$store.commit('DIALOG_CHOSEN', 'login');
        } else {
            this.getCards();
        }
        this.loadCardJS();
    },
};
</script>

<style lang="scss" scoped>
.payment-wrapper {
    padding: 24px 64px;
    .booking-details {
        height: 100%;
        padding: 24px;
        position: relative;
        background-color: $white;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        &:after {
            background: linear-gradient(-45deg, #ffffff 16px, transparent 0)
                linear-gradient(45deg, #ffffff 16px, transparent 0) repeat-x
                left bottom;
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
                    margin-bottom: 8px;
                    color: #acacac;
                }
                ul.benefits {
                    @include list-unstyled();
                    li {
                        font-size: 16px;
                        font-weight: 500;
                        color: $brand-secondary;
                        margin-bottom: 8px;
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
                background-image: linear-gradient(
                    to right,
                    #223049 50%,
                    transparent 50%
                );
                background-size: 32px 100%;
            }
        }
        .total {
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
                .card-info {
                    margin-bottom: 24px;
                    opacity: 0.5;
                    border-radius: 6px;
                    cursor: pointer;

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
