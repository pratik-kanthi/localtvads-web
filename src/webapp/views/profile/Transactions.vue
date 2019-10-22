<template>
    <section>
        <div class="container">
            my trasactions
            <div>
                <div class="radio-btn">
                    <input id="radio1" type="radio">
                    <label for="radio1"></label>
                </div>
            </div>
            <div>
                <div class="radio-btn">
                    <input id="radio2" type="radio">
                    <label for="radio2"></label>
                </div>
            </div>

        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
// import instance from '@/api';
export default {
    name: 'Transactions',
    data() {
        return {
            transactions: []
        };
    },
    methods: {
        ...mapGetters(['getUser'])
    },
    // async created() {
    //     try {
    //         let result = await instance.get('api/client/transactions?client=' + this.getUser().Owner._id);
    //         this.transactions = result.data;
    //     } catch (err) {
    //         this.$swal({
    //             title: 'Error',
    //             text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
    //             type: 'error'
    //         });
    //         console.error(err);
    //     }
    // }
};
</script>

<style>
</style>
