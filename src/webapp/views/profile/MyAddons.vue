<template>
    <section class="bg--grey myaddons">
        <LoaderModal :showloader="isLoading" message="Please wait while we fetch the data..."></LoaderModal>
        <div class="container">
            <h3 class="section-title-2 mb24">My Addons</h3>
            <div class="addons-wrapper">
                <div v-if="!isLoading && addons.length === 0" class="no-data">
                    <p class="lead">No addon has been added</p>
                </div>
                <div class="addons-table" v-else>
                    <b-table :items="addons" :fields="fields" :per-page="perPage" :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc="true" responsive id="addons-table">
                        <template v-slot:cell(ClientId)="data">
                            <button class="btn btn-sm btn-link pl0 pr0" @click="goToContentUpload(data.value)">View Details</button>
                        </template>
                    </b-table>
                    <b-pagination v-model="currentPage" :total-rows="addons.length" :per-page="perPage" first-text="First" prev-text="Prev" next-text="Next" last-text="Last" aria-controls="addons-table" align="right" class="pt0 pb16 pr16"></b-pagination>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { mapGetters } from 'vuex';
import instance from '@/api';
export default {
    name: 'MyAddons',
    data() {
        return {
            isLoading: false,
            sortBy: 'Date',
            fields: [{
                key: 'Date',
                sortable: false
            }, {
                key: 'Name',
                sortable: false
            }, {
                key: 'ClientId',
                label: 'Action',
                sortable: false
            }],
            addons: [],
            perPage: 15,
            currentPage: 1
        };
    },
    methods: {
        goToContentUpload(id) {
            this.$router.push({
                name: 'Addons',
                query: {
                    clientaddon: id
                }
            });
        },
        ...mapGetters(['getUser'])
    },
    async created() {
        this.isLoading = true;
        try {
            let result = await instance.get('api/serviceaddons/client/all?client=' + this.getUser().Owner._id);
            this.addons = result.data.map((item) => {
                return {
                    Date: this.moment(item.DateTime).format('DD/MM/YYYY'),
                    Name: item.ServiceAddOn.Name + ' ' + item.ServiceAddOn.Description,
                    ClientId: item._id
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

<style lang="scss">
.myaddons {
    min-height: calc(100vh - 80px);
    .addons-wrapper {
        background-color: $white;
        border-radius: 8px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
        .no-data {
            padding: 40px;
        }
        .addons-table {
            table {
                border-collapse: collapse;
                border-spacing: 0 5px;
                width: 100%;
                thead {
                    tr {
                        background-color: $brand-primary;
                        color: $white;
                        th {
                            border: none !important;
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
