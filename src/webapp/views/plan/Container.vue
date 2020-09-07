<template>
    <div class="container">
        <div class="mt64 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <div class="t-xxl bold brand-secondary">{{ clientAdPlan.Name }}</div>
                <div class="ml8">
                    <span class="status-tag" :class="getStatusClass(clientAdPlan.Status)">{{ clientAdPlan.Status }}</span>
                </div>
            </div>
            <div class="actions d-flex">
                <button class="btn btn-secondary-small">Submit Ad</button>
            </div>
        </div>
        <Tabs :data="navigableTabs" type="simple"></Tabs>
        <router-view></router-view>
    </div>
</template>

<script>
import { Tabs } from '@e9ine/vue_components';
import ClientAdService from '@/services/ClientAdService';

export default {
    name: 'PlanContainer',
    components: {
        Tabs
    },
    data() {
        return {
            clientAdPlan: {},
            navigableTabs: [
                {
                    name: 'Ad Plan',
                    path: `/plan/${this.$route.params.planId}/info`,
                    selected: true
                },
                {
                    name: 'Add On',
                    path: `/plan/${this.$route.params.planId}/addon`
                },
                {
                    name: 'Ad Script',
                    path: `/plan/${this.$route.params.planId}/text`
                },
                {
                    name: 'Billing',
                    path: `/plan/${this.$route.params.planId}/billing`
                }
            ]
        };
    },
    methods: {
        async getClientAdPlan() {
            try {
                this.clientAdPlan = await ClientAdService.getPlanDetails(this.$route.params.planId);
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        getStatusClass(status) {
            return status.toLowerCase();
        }
    },
    created() {
        this.getClientAdPlan();
    }
};
</script>
