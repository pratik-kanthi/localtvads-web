<template>
    <b-modal v-model="show" centered no-close-on-esc no-close-on-backdrop hide-footer title="Select New Card">
        <button slot="modal-header-close" @click="closeModal" class="close">×</button>

        <div v-if="cards && cards.length > 0">
            <div class="row mt16" v-for="(card, key) in cards" :key="key">
                <div class="col">
                    <div class="saved-card border p24 rounded" @click="selectCard(card)" :class="{ 'selected-card': selectedCard && card._id == selectedCard._id }">
                        <div>
                            <img :src="getImageUrl(card.Card.Vendor)" alt />
                            <span class="t-l brand-secondary">&nbsp;&nbsp;XXXX XXXX XXXX {{ card.Card.LastFour }}</span>
                        </div>
                        <div>
                            <span class="t-l brand-secondary">{{ card.Card.Name }}</span>
                            <span class="t-l brand-secondary">{{ card.Card.ExpiryMonth }} / {{ card.Card.ExpiryYear }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary btn-full mt16" :disabled="!selectedCard" @click="updateCard">Update Card</button>
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
        }
    },
    data() {
        return {
            cards: [],
            selectedCard: null
        };
    },
    methods: {
        closeModal(data) {
            this.$emit('close', data);
        },
        getImageUrl(vendor) {
            return require('@/assets/images/cards/' + vendor.toUpperCase() + '.svg');
        },
        async getSavedCards() {
            try {
                let result = await get('api/client/cards?client=' + this.getUser().Owner._id);
                this.cards = result.data;
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        selectCard(card) {
            this.selectedCard = card;
        },
        async updateCard() {
            try {
                let result = await post(`api/:clientid/clientadplans/${this.clientAdPlanId}/updatepayment`, {
                    payment: this.selectedCard
                });

                this.$swal({
                    title: 'Updated',
                    text: 'Payment Updated Sucessfully',
                    type: 'success'
                });
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
