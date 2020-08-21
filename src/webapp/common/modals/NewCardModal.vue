<template>
    <b-modal v-model="showNewCard" centered no-close-on-esc no-close-on-backdrop hide-footer title="Add your credit and debit card">
        <button slot="modal-header-close" @click="closeModal" class="close">×</button>

        <div class="form-group">
            <div class="form-control" ref="newCardNumber"></div>
        </div>

        <div class="form-group">
            <input type="text" class="form-control" placeholder="Cardholder's Name" />
        </div>

        <div class="row mt16">
            <div class="col-md-6">
                <div class="form-group">
                    <div class="form-control" ref="newCardExpiry"></div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="form-group">
                    <div class="form-control" ref="newCardCvc"></div>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-primary btn-full mt8" :disabled="!isProceedable" @click="generateToken">Save Card</button>
    </b-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import instance from '@/api';
import Card from 'card';
export default {
    name: 'NewCardModal',
    props: ['showNewCard'],
    data() {
        return {
            // eslint-disable-next-line
            elements: stripe.elements(),
            cardElement: null
        };
    },
    methods: {
        closeModal() {
            this.$emit('close', false);
        },
        getImageUrl(vendor) {
            return require('@/assets/images/cards/' + vendor + '.svg');
        },
        generateToken() {
            this.$parent.isLoading = true;
            Stripe.card.createToken(
                {
                    number: this.cardNumber,
                    cvc: this.cvv,
                    exp_month: this.expiry.substring(0, 2),
                    exp_year: parseInt(this.expiry.substring(this.expiry.indexOf('/') + 1)),
                    name: this.name
                },
                (code, result) => {
                    let user = this.getUser();
                    if (code === 200) {
                        this.saveCard(user.Owner._id, result.id);
                    } else {
                        this.$parent.isLoading = false;
                        this.$swal({
                            title: 'Error',
                            text: result && result.error && result.error.message ? result.error.message : 'Some error occurred',
                            type: 'error'
                        });
                        console.error(result);
                    }
                }
            );
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
        async saveCard(owner, token) {
            try {
                await instance.post('api/client/addcard', { client: owner, token: token });
                this.$swal({
                    title: 'Card saved',
                    text: 'Your card has been saved successfully.',
                    type: 'success'
                });
                this.$emit('close', true);
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
        ...mapGetters(['getUser'])
    },
    computed: {
        getCardType() {
            if (this.cardNumber) {
                let re = new RegExp('^4');
                if (this.cardNumber.match(re) != null) return require('@/assets/images/cards/VISA.svg');

                // Mastercard
                // Updated for Mastercard 2017 BINs expansion
                if (/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(this.cardNumber)) return require('@/assets/images/cards/MASTERCARD.svg');

                // AMEX
                re = new RegExp('^3[47]');
                if (this.cardNumber.match(re) != null) return require('@/assets/images/cards/AMERICANEXPRESS.svg');

                // Discover
                re = new RegExp('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)');
                if (this.cardNumber.match(re) != null) return require('@/assets/images/cards/DISCOVER.svg');

                // Diners
                re = new RegExp('^36');
                if (this.cardNumber.match(re) != null) return require('@/assets/images/cards/DINERSCLUB.svg');

                // Diners - Carte Blanche
                re = new RegExp('^30[0-5]');
                if (this.cardNumber.match(re) != null) return require('@/assets/images/cards/DINERSCLUB.svg');

                // JCB
                re = new RegExp('^35(2[89]|[3-8][0-9])');
                if (this.cardNumber.match(re) != null) return require('@/assets/images/cards/JCB.svg');

                // Visa Electron
                re = new RegExp('^(4026|417500|4508|4844|491(3|7))');
                if (this.cardNumber.match(re) != null) return require('@/assets/images/cards/VISA.svg');
            }
            return '';
        },
        isProceedable() {
            return this.name && this.cvv && this.cardNumber && this.cardNumber.length > 12 && this.cardNumber.length <= 19 && this.expiry && new Date(this.expiry.substring(this.expiry.indexOf('/') + 1), this.expiry.substring(0, 2));
        }
    },
    mounted() {
        let cardNumberElement = this.elements.create('cardNumber', {
            showIcon: true,
            iconStyle: 'solid',
            placeholder: 'Credit/Debit Card Number'
        });

        this.cardElement = cardNumberElement;
        let cardExpiryElement = this.elements.create('cardExpiry');
        let cardCvcElement = this.elements.create('cardCvc');

        cardNumberElement.mount(this.$refs.newCardNumber);
        cardExpiryElement.mount(this.$refs.newCardExpiry);
        cardCvcElement.mount(this.$refs.newCardCvc);
    },
    created() {
        this.loadCardJS();
    }
};
</script>

<style lang="scss" scoped>
form {
    .input-card-number {
        width: 100%;
        position: relative;

        img {
            position: absolute;
            right: 8px;
            width: 40px;
            top: 37px;
            overflow: auto;
            z-index: 2 !important;
        }
    }

    .hidden-container {
        display: none;
    }
}
</style>
