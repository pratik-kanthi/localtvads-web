<template>
    <div v-if="clientAdPlan && clientAdPlan.Addons.length > 0" class="shadow-border mt24 p24">
        <div class="row">
            <div class="col d-flex justify-content-between" v-for="(addon, key) in clientAdPlan.Addons" :key="key">
                <div>
                    <span class="t-18 brand-secondary">{{ addon.Name }}</span>
                </div>
            </div>
        </div>

        <div class="panel panel-default mt16">
            <div class="panel-heading">
                Images
            </div>
            <div class="panel-body mt8">
                <div class="resource-type-wrapper row">
                    <div v-for="(image, index) in images" :key="index" class="col-sm-3 resource-container">
                        <div class="resource image pointer" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + image.ResourceUrl + ')' }"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt24">
            <div class="col-auto"><span class="t-l brand-secondary">Videos</span></div>
        </div>
        <div class="row mt24">
            <div class="col-auto"><span class="t-l brand-secondary">Documents</span></div>
        </div>
    </div>
</template>

<script>
import ClientAdService from '@/services/ClientAdService';
export default {
    name: 'AddOn',
    data() {
        return {
            clientAdPlan: null,
            planAssets: null
        };
    },
    methods: {
        async getClientAdPlan() {
            try {
                this.clientAdPlan = await ClientAdService.getPlanDetails(this.$route.params.planId);
                this.planAssets = this.clientAdPlan.AddOnAssets;
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        }
    },
    computed: {
        images() {
            return this.planAssets.filter(resource => {
                return resource.ResourceType == 'IMAGE';
            });
        },
        videos() {
            return this.planAssets.filter(resource => {
                return resource.ResourceType == 'VIDEO';
            });
        },
        documents() {
            return this.planAssets.filter(resource => {
                return resource.ResourceType == 'DOCUMENT';
            });
        }
    },
    created() {
        this.getClientAdPlan();
    }
};
</script>

<style lang="scss" scoped>
.resource-type-wrapper {
    .resource-container {
        .resource {
            width: auto;
            height: 200px;
            border-radius: 6px;
            background-position: center center;
            background-size: cover;
        }
    }
}
</style>
