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
                                <p class="mb0">Transection fee may apply</p>
                            </div>
                            <div class="body">
                                <form class="form">
                                    <div class="form-group">
                                        <label for="" class="mb8">Cardholder Name</label>
                                        <input type="text" class="form-control" v-model="card.Name">
                                    </div>
                                    <div class="form-group">
                                        <label class="mb8">Card Number</label>
                                        <input type="tel" class="form-control" v-model="card.Number">
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label class="mb8">Expiry Date</label>
                                                <input type="tel" class="form-control" v-model="card.Expiry">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label class="mb8">CVV</label>
                                                <input type="password" class="form-control" v-model="card.Cvv">
                                            </div>
                                        </div>
                                    </div>
                                    <input type="checkbox" id="consent" class="check" v-model="consent"/>
                                    <label for="consent" class="check-label box mt8 mr8"><span></span>  </label>
                                    <span>I have read and accept the terms of use, rules of Local Ads and privacy policy</span>
                                    <br/><br/>
                                    <button class="btn btn-success btn-full" :disabled="!consent">Pay Now </button>
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
    export default {
        name: "Payment",
        data() {
            return {
                card: {
                    Name: '',
                    Number: null,
                    Expiry: null,
                    Cvv: null
                },
                consent: false
            }
        },
        methods: {
            isLoggedIn() {
                return this.$store.getters.isLoggedIn
            }
        },
        created() {
            if (!this.isLoggedIn()) {
                this.$store.commit('DIALOG', true);
            }
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