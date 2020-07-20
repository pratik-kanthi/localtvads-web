<template>
    <section class="transactions bg--grey">
        <LoaderModal :showloader="isLoading" message="Loading..."></LoaderModal>
        <div class="container">
            <h3 class=" brand-secondary">Transactions</h3>

            <div class="table-wrapper d-none d-md-block">
                <Table :items="transactions" :headings="fields" :pagination="pagination" :sort.sync="sort" table-class="table-responsive-xs table-responsive-stable-responsive-md">
                    <template v-slot:DateTime="data">
                        <div>{{ data.value.DateTime | formatDate('DD MMM YYYY') }}</div>
                    </template>
                    <template v-slot:Total="data">
                        <div>{{ data.value.Total | currency }}</div>
                    </template>
                    <template v-slot:Action="data">
                        <button @click="downloadReceipt(data.value.ReferenceID)" class="btn btn-sm btn-link pl0 pt0 pr0 t-m">
                            Download Invoice
                        </button>
                    </template>
                </Table>
            </div>

            <div class="transactions-wrapper">
                <div v-if="!isLoading && transactions.length === 0" class="no-data">
                    <p class="lead">No transactions found.</p>
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
import Table from '@/e9_components/components/Table';

export default {
    name: 'Transactions',
    components: {
        Table
    },
    data() {
        return {
            isLoading: false,
            fields: [
                {
                    key: 'Details',
                    sortable: true
                },
                {
                    key: 'DateTime',
                    label: 'Transaction Date',
                    sortable: true
                },
                {
                    key: 'Status',
                    sortable: true
                },
                {
                    key: 'Total',
                    sortable: true
                },
                {
                    key: 'Action',
                    label: ' '
                }
            ],
            transactions: [],
            perPage: 15,
            currentPage: 1,
            pagination: {
                currentPage: 1,
                perPage: 10
            },
            sort: {
                name: 'Name',
                value: 'asc'
            }
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
                    DateTime: item.DateTime,
                    ReferenceID: item.ReferenceId,
                    Status: item.Status.substring(0, 1).toUpperCase() + item.Status.substring(1),
                    Total: item.TotalAmount
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
        background-color: #f9f9f9;
        border-radius: 8px;

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
