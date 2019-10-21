<template>
    <section>
        <div class="container">
            my trasactions
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import instance from '@/api';
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
    async created() {
        try {
            let result = await instance.get('api/client/transactions?client=' + this.getUser().Owner._id);
            this.transactions = result.data;
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                type: 'error'
            });
            console.error(err);
        }
    }
};
</script>

<style>
</style>
