<template>
    <div class="container">
        <div class="payment-wrapper">
            <h5 class="mb8">Payment Method</h5>
            <div class="payment">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="card-details">
                            <div class="header">
                                <h5 class="mb0">Credit & Debit cards</h5>
                                <p class="mb0">Transaction fee may apply</p>
                            </div>
                            <div class="body">
                                <form class="form" ref="form">
                                    <div class="hidden-container"></div>
                                    <div class="form-group">
                                        <label class="mb8">Card Number</label>
                                        <div class="input-group">
                                            <input name="number" type="tel" class="form-control" v-model="cardNumber">
                                            <span class="input-group-btn jp-card-logo" :class="getCardType">visa</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="mb8">Cardholder Name</label>
                                        <input name="name" type="text" class="form-control" v-model="name" autocomplete="off">
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label class="mb8">Expiry Date</label>
                                                <input name="expiry" type="tel" class="form-control" v-model="expiry" placeholder="••/••••">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label class="mb8">CVV</label>
                                                <input name="cvc" type="password" class="form-control" v-model="cvv">
                                            </div>
                                        </div>
                                    </div>
                                    <input type="checkbox" id="consent" class="check" v-model="consent"/>
                                    <label for="consent" class="check-label box mt8 mr8"><span></span>  </label>
                                    <span>I have read and accept the terms of use, rules of Local Ads and privacy policy</span>
                                    <br/><br/>
                                    <button type="button" class="btn btn-success btn-full" :disabled="!isProceedable" @click="generateToken">Pay Now </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="booking-details">
                            <div class="content">
                                <h5 class="text-center">Booking Details</h5>
                                <div class="booking-items">
                                    <h6 class="title">Broadcast Location</h6>
                                    <p class="desc">West Midland Tv (Freeview 7, Skyguide, Virgin Media)</p>
                                </div>
                                <div class="booking-items">
                                    <h6 class="title">Broadcast Slot</h6>
                                    <p class="desc">Breakfast (6am to 9am)</p>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="booking-items">
                                            <h6 class="title">Broadcast Start</h6>
                                            <p class="desc">19th September 2019</p>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="booking-items">
                                            <h6 class="title">Broadcast End</h6>
                                            <p class="desc">18th March 2020</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="booking-items">
                                            <h6 class="title">Ad Length</h6>
                                            <p class="desc">20 Sec</p>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="booking-items">
                                            <div class="title">Broadcast Duration</div>
                                            <div class="desc">6 months</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="recurring">
                                    <h6><i class="material-icons">done</i> Recurring Broadcast</h6>
                                </div>
                            </div>
                            <div class="total">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <h5>Total Amount</h5>
                                    </div>
                                    <div class="col-sm-6">
                                        <h5 class="amount pull-right">200.00</h5>
                                    </div>
                                </div>
                                <p><small>*All tax inclusive</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import instance from '@/api';
    import Card from 'card';
    export default {
        name: "Payment",
        data() {
            return {
                name: '',
                cardNumber: null,
                expiry: null,
                cvv: null,
                consent: false,
                cardObj: null
            }
        },
        methods: {
            generateToken() {
                Stripe.card.createToken({
                    number: this.cardNumber,
                    cvc: this.cvv,
                    exp_month: this.expiry.substring(0,2),
                    exp_year: parseInt(this.expiry.substring(this.expiry.indexOf('/') + 1)),
                    name: this.name
                }, (code, result) => {
                    if (code === 200) {
                        this.payNow(result.id, this.$store.getters.getUser.Owner._id);
                    } else {
                        this.$swal({
                            title: "Error",
                            text: result.error.message,
                            type: "error"
                        });
                    }
                });
            },
            isLoggedIn() {
                return this.$store.getters.isLoggedIn
            },
            async payNow(token, client) {
                let obj = {
                    save: true,
                    clientadplan: {
                        Name: 'Client Ad',
                        Client: client,
                        StartDate: '2019-09-12',
                        IsRenewal: true
                    },
                    channelplan: "5d5e4238f8ea326e580a597c",
                    addons: [],
                    token: token,
                    client: client
                };
                try {
                    this.$parent.isLoading = true;
                    let result = await instance.post('api/clientad/new',obj);
                    this.$router.push({
                        name: 'BookingFlow',
                        query: {
                            clientadplan: result.data._id
                        }
                    });
                    this.$swal({
                        title: "Successful",
                        text: "Payment has been successful. You are now being redirected to upload",
                        type: "success"
                    });
                    this.$parent.fetchClientAdPlan(result.data._id);
                } catch (err) {
                    this.$parent.isLoading = false;
                    this.$swal({
                        title: "Error",
                        text: err.data && err.data.message ? err.data.message : 'Some error occurred',
                        type: "error"
                    });
                    throw err;
                }
            },
        },
        computed: {
            getCardType () {
                if (this.cardNumber) {
                    let re = new RegExp("^4");
                    if (this.cardNumber.match(re) != null)
                        return "jp-card-visa";

                    // Mastercard
                    // Updated for Mastercard 2017 BINs expansion
                    if (/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(this.cardNumber))
                        return "jp-card-mastercard";

                    // AMEX
                    re = new RegExp("^3[47]");
                    if (this.cardNumber.match(re) != null)
                        return "jp-card-amex";

                    // Discover
                    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
                    if (this.cardNumber.match(re) != null)
                        return "jp-card-discover";

                    // Diners
                    re = new RegExp("^36");
                    if (this.cardNumber.match(re) != null)
                        return "jp-card-dinersclub";

                    // Diners - Carte Blanche
                    re = new RegExp("^30[0-5]");
                    if (this.cardNumber.match(re) != null)
                        return "jp-card-dinersclub";

                    // JCB
                    re = new RegExp("^35(2[89]|[3-8][0-9])");
                    if (this.cardNumber.match(re) != null)
                        return "jp-card-jcb";

                    // Visa Electron
                    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
                    if (this.cardNumber.match(re) != null)
                        return "jp-card-visaelectron";
                }
                return "";
            },
            isProceedable() {
                return this.name && this.cvv && this.cardNumber.length > 12 && this.cardNumber.length <= 19 && this.consent && new Date(this.expiry.substring(this.expiry.indexOf('/') + 1), this.expiry.substring(0,2))
            }
        },
        created() {
            if (!this.isLoggedIn()) {
                this.$store.commit('DIALOG', true);
            }
            setTimeout(() => {
                this.cardObj = new Card({
                    form: this.$refs.form,
                    container: '.hidden-container',
                    placeholders: {
                        expiry: '••/••••'
                    }
                });
            });
        }
    }
</script>

<style lang="less" scoped>
    .payment-wrapper {
        padding: 16px 80px;
        .payment {
            border: 1px solid #ddd;
            background-color: #fff;
            padding: 16px;
            border-radius: 6px;
            .card-details {
                .header {
                    border: 1px solid #0C6CD4;
                    padding: 8px 16px;
                    border-radius: 2px;
                    h5 {
                        line-height: 16px;
                        font-size: 14px;
                    }
                    p {
                        font-size: 13px;
                        line-height: 16px;
                    }
                }
                .body {
                    border: 1px solid #0C6CD4;
                    border-radius: 2px;
                    padding: 16px;
                    .form {
                        label {
                            font-size: 14px;
                            font-weight: 300;
                        }
                        .button {
                            span {
                                font-weight: 8px;
                            }
                        }
                    }
                    .input-group {
                        width: 100%;
                    }
                    .hidden-container {
                        display: none;
                    }
                }
            }
            .booking-details {
                border-left: 1px solid #ccc;
                padding: 0 24px;
                .content {
                    margin-bottom: 24px;
                    .booking-items {
                        .title {
                            font-size: 14px !important;
                            margin-bottom: 8px;
                            color: @base;
                        }
                    }
                    .recurring {
                        h6 {
                            font-size: 14px !important;
                            color: #4c4c4c;
                            position: relative;
                            padding-left: 28px;
                            i {
                                background: @brand-primary;
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
                    border-bottom: 2px solid #333;
                }
                .total {
                    h5 {
                        font-weight: 500;
                        .amount {
                            text-align: right !important;
                        }
                    }
                }
            }
        }
    }
</style>