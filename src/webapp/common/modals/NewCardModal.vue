<template>
    <b-modal v-model="showNewCard" centered no-close-on-esc no-close-on-backdrop title="Add your credit and debit card">
        <form ref="form">
            <div class="hidden-container"></div>
            <div class="form-group">
                <label class="mb8">Card Number</label>
                <div class="input-card-number">
                    <input name="number" type="tel" class="form-control" v-model="cardNumber"/>
                    <img :src="getCardType" alt class="pull-right"/>
                </div>
            </div>
            <div class="form-group">
                <label for class="mb8">Cardholder Name</label>
                <input name="name" type="text" class="form-control" v-model="name" autocomplete="off"/>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label class="mb8">Expiry Date</label>
                        <input name="expiry" type="tel" class="form-control" v-model="expiry" placeholder="••/••••"/>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label class="mb8">CVV</label>
                        <input name="cvc" type="password" class="form-control" v-model="cvv"/>
                    </div>
                </div>
            </div>
        </form>
    </b-modal>
</template>

<script>
export default {
    name: "NewCardModal",
    props: ['showNewCard']
}
</script>

<style lang="scss" scoped>
    
</style>