<template>
    <section class="transactions bg--grey">
        <LoaderModal :showloader="isLoading" :message="isLoadingMessage"></LoaderModal>
        <div class="container">
            <h3 class="brand-secondary">Transactions</h3>

            <div class="table-wrapper">
                <Table :items="transactions" :headings="fields" :pagination="pagination" :sort.sync="sort" responsive table-class="table-responsive-xs table-responsive-stable-responsive-md">
                    <template v-slot:Status="data">
                        <div class="bold" :class="data.value.Status.toLowerCase()">{{ data.value.Status }}</div>
                    </template>
                    <template v-slot:DateTime="data">
                        <div>{{ data.value.DateTime | formatDate('DD MMM YYYY') }}</div>
                    </template>
                    <template v-slot:TotalAmount="data">
                        <div class="text-right">{{ data.value.TotalAmount | currency }}</div>
                    </template>
                    <template v-slot:Action="data">
                        <div v-if="data.value.Status == 'SUCCEEDED'" class="brand-primary pointer" @click="downloadReceipt(data.value._id)">Download Receipt</div>
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
import Table from '@/e9_components/components/Table';
import TransactionService from '@/services/TransactionService';

export default {
    name: 'Transactions',
    components: {
        Table
    },
    data() {
        return {
            isLoading: true,
            isLoadingMessage: '',
            fields: [
                {
                    key: 'ReceiptNo',
                    field: 'Receipt Number'
                },
                {
                    key: 'DateTime',
                    label: 'Transaction Date'
                },
                {
                    key: 'Status'
                },
                {
                    key: 'TotalAmount',
                    label: 'Total Amount'
                },
                {
                    key: 'ReferenceId',
                    label: 'Reference ID'
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
            this.isLoadingMessage = 'Generating your receipt';

            const result = await TransactionService.downloadReceipt(transaction);
            window.open(result);

            this.isLoading = false;
            this.isLoadingMessage = '';
        },
        ...mapGetters(['getUser'])
    },
    async created() {
        this.isLoading = true;
        try {
            this.transactions = await TransactionService.getTransactions(this.getUser().Owner._id);
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
