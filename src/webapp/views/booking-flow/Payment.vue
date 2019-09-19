<template>
  <div class="container">
    <div class="payment-wrapper">
      <div class="payment">
        <div class="row">
          <div v-if="isLoggedIn()" class="col-sm-6">
            <h5 class="mb8">Payment Method</h5>
            <div class="card-details">
              <div
                class="header"
                @click="togglePaymentOptions('SavedCards')"
                :class="{'active':activeToggle === 'SavedCards'}"
                v-if="savedCards.length > 0"
              >
                <h5 class="mb0">Saved cards</h5>
                <i class="material-icons">keyboard_arrow_down</i>
              </div>
              <div class="cards" v-if="activeToggle === 'SavedCards'">
                <div
                  v-for="(card,key) in savedCards"
                  :key="key"
                  class="card"
                  :class="{'active': existingCard === card._id}"
                  @click="selectExistingCard(card._id)"
                >
                  <span>xxxx xxxx xxxx {{card.Card.LastFour}}</span>
                  <img :src="getImageUrl(card.Card.Vendor)" alt class="pull-right" />
                </div>
              </div>
              <div
                class="header mt8"
                @click="togglePaymentOptions('NewCard')"
                :class="{'active':activeToggle === 'NewCard'}"
              >
                <h5 class="mb0">New card</h5>
                <i class="material-icons">keyboard_arrow_down</i>
              </div>
              <form ref="form" v-if="activeToggle==='NewCard'">
                <div class="hidden-container"></div>
                <div class="form-group">
                  <label class="mb8">Card Number</label>
                  <div class="input-card-number">
                    <input name="number" type="tel" class="form-control" v-model="cardNumber" />
                    <img :src="getCardType" alt class="pull-right" />
                  </div>
                </div>
                <div class="form-group">
                  <label for class="mb8">Cardholder Name</label>
                  <input
                    name="name"
                    type="text"
                    class="form-control"
                    v-model="name"
                    autocomplete="off"
                  />
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label class="mb8">Expiry Date</label>
                      <input
                        name="expiry"
                        type="tel"
                        class="form-control"
                        v-model="expiry"
                        placeholder="••/••••"
                      />
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="form-group">
                      <label class="mb8">CVV</label>
                      <input name="cvc" type="password" class="form-control" v-model="cvv" />
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="save"
                  class="check"
                  v-model="save"
                  :disabled="savedCards.length === 0 && $parent.selectedPlan.isRenewal"
                />
                <label for="save" class="check-label box mt8 mr8">
                  <span></span>
                </label>
                <span class="brand-primary bold">Save Card</span>
                <i class="material-icons">info</i>
                <br />
                <input type="checkbox" id="consent" class="check" v-model="consent" />
                <label for="consent" class="check-label box mt8 mr8">
                  <span></span>
                </label>
                <span>I have read and accept the terms of use, rules of Local Ads and privacy policy</span>
              </form>
            </div>
            <br class="clearfix" />
            <button
              type="button"
              class="btn btn-success btn-full"
              :disabled="!isProceedable && !existingCard"
              @click="generateToken"
            >Pay Now</button>
          </div>
          <div v-else class="col-sm-6">
            <h5 class="mb8">Please login to continue with your booking.</h5>
          </div>
          <div class="col-sm-6">
            <div class="booking-details">
              <div class="content">
                <h5 class="text-center">Booking Details</h5>
                <div class="booking-items">
                  <h6 class="title">Broadcast Location</h6>
                  <p class="desc">
                    {{$parent.selectedPlan.broadcastLocation.Name}}
                    <span
                      v-if="$parent.selectedPlan.broadcastLocation.Description"
                    >({{$parent.selectedPlan.broadcastLocation.Description}})</span>
                  </p>
                </div>
                <div class="booking-items">
                  <h6 class="title">Broadcast Slot</h6>
                  <p
                    class="desc"
                  >{{$parent.selectedPlan.broadcastSlot}} ({{$parent.selectedPlan.adStartTime}} to {{$parent.selectedPlan.adEndTime}})</p>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    <div class="booking-items">
                      <h6 class="title">Broadcast Start</h6>
                      <p
                        class="desc"
                      >{{moment($parent.selectedPlan.broadcastStartDate, 'YYYY-MM-DD').format('Do MMMM YYYY')}}</p>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="booking-items">
                      <h6 class="title">Broadcast End</h6>
                      <p
                        class="desc"
                      >{{moment($parent.selectedPlan.broadcastEndDate, 'YYYY-MM-DD').format('Do MMMM YYYY')}}</p>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    <div class="booking-items">
                      <h6 class="title">Ad Length</h6>
                      <p class="desc">{{$parent.selectedPlan.adLength}} Seconds</p>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="booking-items">
                      <div class="title">Broadcast Duration</div>
                      <div class="desc">6 months</div>
                    </div>
                  </div>
                </div>
                <div class="recurring" v-if="$parent.selectedPlan.isRenewal">
                  <h6>
                    <i class="material-icons">done</i> Recurring Broadcast
                  </h6>
                </div>
              </div>
              <div class="total">
                <div class="row">
                  <div class="col-sm-6">
                    <h5>Total Amount</h5>
                  </div>
                  <div class="col-sm-6">
                    <h5 class="amount pull-right">{{$parent.selectedPlan.totalAmount | currency}}</h5>
                  </div>
                </div>
                <p>
                  <small>*All tax inclusive</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import instance from "@/api";
import Card from "card";
export default {
  name: "Payment",
  data() {
    return {
      name: "",
      cardNumber: null,
      expiry: null,
      cvv: null,
      consent: false,
      cardObj: null,
      savedCards: [],
      save: false,
      existingCard: null,
      activeToggle: ""
    };
  },
  methods: {
    generateToken() {
      this.$swal({
        title: "Are you sure?",
        text: "Payment will be processed",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        closeOnConfirm: false
      }).then(isConfirm => {
        if (isConfirm.value) {
          this.$parent.isLoading = true;
          if (this.existingCard) {
            this.payNow(null, this.getUser.Owner._id);
          } else {
            Stripe.card.createToken(
              {
                number: this.cardNumber,
                cvc: this.cvv,
                exp_month: this.expiry.substring(0, 2),
                exp_year: parseInt(
                  this.expiry.substring(this.expiry.indexOf("/") + 1)
                ),
                name: this.name
              },
              (code, result) => {
                if (code === 200) {
                  this.payNow(result.id, this.getUser.Owner._id);
                } else {
                  this.$parent.isLoading = false;
                  this.$swal({
                    title: "Error",
                    text: result.error.message,
                    type: "error"
                  });
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
        let result = await instance.get(
          "api/client/cards?client=" + this.$store.state.user.Owner._id
        );
        this.savedCards = result.data;
        if (
          this.$parent.selectedPlan.isRenewal &&
          this.savedCards.length === 0
        ) {
          this.save = true;
        }
        if (this.savedCards.length > 0 && !this.activeToggle) {
          this.activeToggle = "SavedCards";
        } else {
          this.activeToggle = "NewCard";
        }
        this.$parent.isLoading = false;
      } catch (err) {
        this.$parent.isLoading = false;
        this.$swal({
          title: "Error",
          text:
            err.data && err.data.message
              ? err.data.message
              : "Some error occurred",
          type: "error"
        });
        throw err;
      }
    },
    getImageUrl(vendor) {
      return require("@/assets/images/cards/" + vendor + ".svg");
    },
    loadCardJS() {
      setTimeout(() => {
        this.cardObj = new Card({
          form: this.$refs.form,
          container: ".hidden-container",
          placeholders: {
            expiry: "••/••••"
          }
        });
      }, 100);
    },
    async payNow(token, client) {
      let obj = {
        save: this.save,
        clientadplan: {
          Name:
            this.$parent.selectedPlan.broadcastStartDate +
            "_" +
            this.$parent.selectedPlan.broadcastLocation.Name +
            "_" +
            this.$parent.selectedPlan.broadcastSlot,
          Client: client,
          StartDate: this.$parent.selectedPlan.broadcastStartDate,
          IsRenewal: this.$parent.selectedPlan.isRenewal
        },
        channelplan: this.$parent.selectedPlan.plan,
        cardid: this.existingCard,
        addons: [],
        token: token,
        client: client
      };
      let result;
      try {
        result = await instance.post("api/clientad/new", obj);
      } catch (err) {
        this.$parent.isLoading = false;
        this.$swal({
          title: "Error",
          text:
            err.data && err.data.message
              ? err.data.message
              : "Some error occurred",
          type: "error"
        });
        throw err;
      }
      this.$router.push({
        name: "BookingFlow",
        query: {
          clientadplan: result.data._id
        }
      });
      this.$swal({
        title: "Successful",
        text:
          "Payment has been successful. You are now being redirected to upload",
        type: "success"
      });
      this.$parent.fetchClientAdPlan(result.data._id);
    },
    selectExistingCard(card) {
      this.existingCard = card;
    },
    async togglePaymentOptions(option) {
      this.activeToggle = option;
      if (option === "SavedCards" && this.savedCards.length > 0) {
        this.existingCard = this.savedCards.find(s => s.IsPreferred)._id;
      } else {
        this.existingCard = null;
        this.loadCardJS();
      }
    },
    ...mapGetters(["isLoggedIn", "getUser"])
  },
  computed: {
    getCardType() {
      if (this.cardNumber) {
        let re = new RegExp("^4");
        if (this.cardNumber.match(re) != null)
          return require("@/assets/images/cards/VISA.svg");

        // Mastercard
        // Updated for Mastercard 2017 BINs expansion
        if (
          /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(
            this.cardNumber
          )
        )
          return require("@/assets/images/cards/MASTERCARD.svg");

        // AMEX
        re = new RegExp("^3[47]");
        if (this.cardNumber.match(re) != null)
          return require("@/assets/images/cards/AMERICANEXPRESS.svg");

        // Discover
        re = new RegExp(
          "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)"
        );
        if (this.cardNumber.match(re) != null)
          return require("@/assets/images/cards/DISCOVER.svg");

        // Diners
        re = new RegExp("^36");
        if (this.cardNumber.match(re) != null)
          return require("@/assets/images/cards/DINERSCLUB.svg");

        // Diners - Carte Blanche
        re = new RegExp("^30[0-5]");
        if (this.cardNumber.match(re) != null)
          return require("@/assets/images/cards/DINERSCLUB.svg");

        // JCB
        re = new RegExp("^35(2[89]|[3-8][0-9])");
        if (this.cardNumber.match(re) != null)
          return require("@/assets/images/cards/JCB.svg");

        // Visa Electron
        re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
        if (this.cardNumber.match(re) != null)
          return require("@/assets/images/cards/VISA.svg");
      }
      return "";
    },
    isProceedable() {
      return (
        this.name &&
        this.cvv &&
        this.cardNumber &&
        this.cardNumber.length > 12 &&
        this.cardNumber.length <= 19 &&
        this.consent &&
        this.expiry &&
        new Date(
          this.expiry.substring(this.expiry.indexOf("/") + 1),
          this.expiry.substring(0, 2)
        )
      );
    },
    ...mapState(["isAuth"])
  },
  watch: {
    isAuth(newValue) {
      if (newValue) {
        this.getCards();
      }
    }
  },
  async created() {
    if (!this.isLoggedIn()) {
      this.$store.commit("DIALOG_CHOSEN", "login");
    } else this.getCards();
    this.loadCardJS();
  }
};
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
        background-color: @brand-primary;
        padding: 16px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        h5 {
          line-height: 16px;
          color: #fff;
        }
        opacity: 0.5;
        i {
          position: absolute;
          color: #fff;
          top: 12px;
          right: 12px;
        }
        &.active {
          opacity: 1;
        }
      }
      .cards {
        padding: 8px 0;
        max-height: 300px;
        overflow-y: auto;
        overflow-x: hidden;
        .card {
          padding: 8px;
          background-color: #f9f9f9;
          margin-bottom: 4px;
          opacity: 0.5;
          border-radius: 6px;
          cursor: pointer;
          span {
            letter-spacing: 2px;
          }
          img {
            width: 34px;
          }
          &.active {
            border: 1px solid @brand-secondary;
            opacity: 1;
            span {
              font-weight: 700;
            }
          }
        }
      }
      form {
        padding: 16px 0;
        label {
          font-size: 14px;
          font-weight: 300;
        }
        i {
          position: relative;
          top: 3px;
          left: 6px;
          font-size: 18px;
          color: @brand-primary;
        }
        .button {
          span {
            font-weight: 8px;
          }
        }
      }
      .input-card-number {
        width: 100%;
        position: relative;
        img {
          position: absolute;
          right: 8px;
          width: 40px;
          top: 29px;
          overflow: auto;
          z-index: 2 !important;
        }
      }
      .hidden-container {
        display: none;
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