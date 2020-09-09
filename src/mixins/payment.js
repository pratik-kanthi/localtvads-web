import Card from 'card';
import {
    mapGetters,
    mapState
} from 'vuex';
export const paymentMixin = {
    data() {
        return {
            cardObj: null,
            activeToggle: '',
            cardNumber: null,
            newCardError: '',
            cvv: null,
            paymentLoading: false,
            expiry: null,
            existingCard: null,
            name: '',
            savedCards: [],
            save: false
        };
    },
    methods: {
        getImageUrl(vendor) {
            return require('@/assets/images/cards/' + vendor.toUpperCase() + '.svg');
        },
        generateToken() {
            this.$swal({
                title: 'Are you sure?',
                text: 'Payment will be processed',
                type: 'warning',
                showCancelButton: true
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
                        }, (code, result) => {
                            if (code === 200) {
                                this.payNow(result.id, user.Owner._id);
                            } else {
                                this.paymentLoading = false;
                                this.newCardError = result.error.message;
                                this.$swal({
                                    title: 'Error',
                                    text: result && result.error && result.error.message ? result.error.message : 'Some error occurred',
                                    type: 'error'
                                });
                                console.error(result);
                            }
                        });
                    }
                }
            });
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
        selectExistingCard(card) {
            if (this.activeToggle === 'SavedCards')
                this.existingCard = card;
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
                    return require('@/assets/images/cards/AMEX.svg');

                // Discover
                re = new RegExp('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)');
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
                new Date(this.expiry.substring(this.expiry.indexOf('/') + 1), this.expiry.substring(0, 2)) &&
                this.getUser()
            );
        },
        ...mapState(['isAuth'])
    },
    watch: {
        isAuth(newValue) {
            if (newValue) {
                this.getCards();
            }
        }
    },
};