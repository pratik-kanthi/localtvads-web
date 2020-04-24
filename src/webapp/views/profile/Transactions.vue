<template>
    <section class="transactions bg--grey">
        <LoaderModal :showloader="isLoading" message="Please wait while we fetch the data..."></LoaderModal>
        <div class="container">
            <h3 class="section-title-2 mb24">Transaction History</h3>
            <div class="transactions-wrapper">
                <div v-if="!isLoading && transactions.length === 0" class="no-data">
                    <p class="lead">No transactions found.</p>
                </div>
                <div class="transaction-table" v-else>
                    <b-table striped hover :items="transactions" :fields="fields" :per-page="perPage" :current-page="currentPage" responsive id="transaction-table">
                        <template v-slot:cell(Action)="data">
                            <button @click="downloadReceipt(data.item.ReferenceID)" class="btn btn-sm btn-link pl0 pt0 pr0 t-m">
                                Download
                            </button>
                        </template>
                    </b-table>
                    <b-pagination v-model="currentPage" :total-rows="transactions.length" :per-page="perPage" first-text="First" prev-text="Prev" next-text="Next" last-text="Last" aria-controls="transaction-table" align="right" class="pt0 pb16 pr16"></b-pagination>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import instance from '@/api';
import axios from 'axios';

import VueCookies from 'vue-cookies';

export default {
    name: 'Transactions',
    data() {
        return {
            isLoading: false,
            fields: ['DateTime', 'Details', 'Status', 'Total', 'Action'],
            transactions: [],
            perPage: 15,
            currentPage: 1
        };
    },
    methods: {
        async downloadReceipt(transaction) {
            this.isLoading = true;
            let result = await axios.get(window.endpoint + 'api/client/transaction/' + transaction, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'bearer ' + VueCookies.get('token')
                }
            });
            window.open(result.data);
            this.isLoading = false;
        },
        ...mapGetters(['getUser'])
    },
    async created() {
        this.isLoading = true;
        try {
            let result = await instance.get('api/client/transactions?client=' + this.getUser().Owner._id);
            this.transactions = result.data.map(item => {
                return {
                    DateTime: this.moment(item.DateTime).format('DD/MM/YYYY HH:mm'),
                    ReferenceID: item.ReferenceId,
                    Details: item.ChannelPlan && item.ChannelPlan.Channel ? item.ChannelPlan.Channel.Name + ', ' + item.ChannelPlan.AdSchedule.Name : 'Add On - ' + item.ServiceAddOn.Name,
                    Status: item.Status.substring(0, 1).toUpperCase() + item.Status.substring(1),
                    Total: '£' + item.TotalAmount.toFixed(2)
                };
            });
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
