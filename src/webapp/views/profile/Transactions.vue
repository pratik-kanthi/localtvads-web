<template>
    <section class="transactions bg--grey">
        <LoaderModal :showloader="isLoading" message="Please wait while we fetch the data..."></LoaderModal>
        <div class="container">
            <h3 class="section-title-2 mb24">Transaction Details</h3>
            <div class="transactions-wrapper">
                <div v-if="!isLoading && transactions.length === 0" class="no-data">
                    <p class="lead">No transactions has been added</p>
                </div>
                <div class="transaction-table" v-else>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Reference ID</th>
                                <th>Channel</th>
                                <th>Ad Schedule</th>
                                <th>Status</th>
                                <th class="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tr in transactions" :key="tr._id">
                                <td>{{ tr.DateTime | formatDate('DD/MM/YYYY') }}</td>
                                <td>{{ tr.ReferenceId }}</td>
                                <td v-text="(tr.ChannelPlan && tr.ChannelPlan.Channel) ? tr.ChannelPlan.Channel.Name : '-'"></td>
                                <td v-text="(tr.ChannelPlan && tr.ChannelPlan.AdSchedule) ? tr.ChannelPlan.AdSchedule.Name : '-'"></td>
                                <td>{{ tr.Status }}</td>
                                <td class="text-right">{{ tr.TotalAmount | currency }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
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
            isLoading: false,
            transactions: []
        };
    },
    methods: {
        ...mapGetters(['getUser'])
    },
    async created() {
        this.isLoading = true;
        try {
            let result = await instance.get('api/client/transactions?client=' + this.getUser().Owner._id);
            this.transactions = result.data;
            this.isLoading = false;
        } catch (err) {
            this.isLoading = false;
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

<style lang="scss" scopped>
.transactions {
    min-height: calc(100vh - 80px);
    .transactions-wrapper {
        background-color: $white;
        border-radius: 8px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
        .no-data {
            padding: 40px;
        }
        .transaction-table {
            table {
                border-collapse: collapse;
                border-spacing: 0 5px;
                width: 100%;
                thead {
                    tr {
                        background-color: $brand-primary;
                        color: $white;
                        th {
                            border: none;
                            font-size: 16px;
                            font-weight: 500;
                            font-family: $font-family-heading;
                            &:first-child {
                                border-top-left-radius: 6px;
                            }
                            &:last-child {
                                border-top-right-radius: 6px;
                            }
                        }
                    }
                }
                tbody {
                    tr {
                        color: $base;
                        background-color: $white;
                    }
                }
            }
        }
    }
}
</style>
