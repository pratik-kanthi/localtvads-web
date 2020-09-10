<template>
    <b-modal v-model="show" centered no-close-on-esc no-close-on-backdrop hide-footer title="Select New Card">
        <div slot="modal-header">
            <strong>Update Payment Method</strong>
            <button class="close float-right" type="button" @click="closeModal">
                <i class="material-icons">close</i>
            </button>
        </div>

        <div v-if="cards && cards.length > 0">
            <div class="t-l">Other Saved Cards</div>
            <div class="row mt16" v-for="(card, key) in cards" :key="key">
                <div class="col">
                    <div class="saved-card pointer border p24 rounded" @click="selectCard(card)" :class="{ 'selected-card': selectedCard && card._id == selectedCard._id }">
                        <div>
                            <img :src="getImageUrl(card.Card.Vendor)" alt />
                        </div>
                        <div class="mt24">
                            <div class="row">
                                <div class="col-md-3">XXXX</div>
                                <div class="col-md-3">XXXX</div>
                                <div class="col-md-3">XXXX</div>
                                <div class="col-md-3">{{ card.Card.LastFour }}</div>
                            </div>
                        </div>
                        <div class="mt16 d-flex justify-content-between">
                            <div>
                                <span class="t-s">EXPIRY</span>
                                <div class="t-l brand-secondary">{{ card.Card.ExpiryMonth }} / {{ card.Card.ExpiryYear }}</div>
                            </div>
                            <div>
                                <span class="t-s">CARDHOLDER</span>
                                <div class="t-l brand-secondary">{{ card.Card.Name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary btn-full mt16" :disabled="!selectedCard" @click="updateCard">Select Card</button>
    </b-modal>
</template>

<script>
import { get, post } from '@/services/ApiService';
import { mapGetters } from 'vuex';
export default {
    name: 'UpdateCard',
    props: {
        show: {
            type: Boolean,
            required: true
        },
        clientAdPlanId: {
            type: String,
            required: true
        },
        currentCard: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            cards: [],
            selectedCard: null,
            loading: false
        };
    },
    methods: {
        closeModal(data) {
            if (data.type != 'click') {
                this.$emit('close', data);
            } else {
                this.$emit('close');
            }
        },
        getImageUrl(vendor) {
            return require('@/assets/images/cards/' + vendor.toUpperCase() + '.svg');
        },
        async getSavedCards() {
            try {
                this.loading = true;
                let result = await get('api/:clientid/cards?client=' + this.getUser().Owner._id);
                this.cards = result.data.filter(card => {
                    return card._id != this.currentCard;
                });
                this.loading = false;
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                this.loading = false;
                console.error(err);
            }
        },
        selectCard(card) {
            this.selectedCard = card;
        },
        async updateCard() {
            try {
                this.loading = true;
                let result = await post(`api/:clientid/clientadplans/${this.clientAdPlanId}/updatepayment`, {
                    payment: this.selectedCard
                });

                this.$swal({
                    title: 'Updated',
                    text: 'Payment Updated Sucessfully',
                    type: 'success'
                });
                this.loading = false;
                this.closeModal(result.data);
            } catch (err) {
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
    created() {
        this.getSavedCards();
    }
};
</script>

<style lang="scss" scoped>
.saved-card {
    &.selected-card {
        border: 1px solid $brand-primary !important;
    }
}
</style>
