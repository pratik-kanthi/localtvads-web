<template>
    <div class="container mt32">
        <div class="details">
            <div class="details-wrapper">
                <div class="row">
                    <div class="col-sm-12">
                        <h3 class="section-subtitle">Ad Details</h3>
                        <div class="t-l">Please provide the following details about your advetisement, this will help us place your ads better</div>
                    </div>
                </div>
                <form>
                    <div class="row mt24">
                        <div class="col-sm-12">
                            <label>Commodity Type*</label>
                            <Multiselect v-model="selectedCategory" class="multiselect" tag-placeholder="Add a new option..." placeholder="Search or add an option" :options="categories" select-label="" deselect-label=""></Multiselect>

                            <label class="mt24">Any other requests - we treat this as important</label>
                            <textarea v-model="comment" rows="8" class="form-control"></textarea>
                        </div>
                    </div>
                    <div class="action text-center mt24">
                        <button :disabled="!selectedCategory" type="button" @click="submitAdDetails" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import instance from '@/api';
import Multiselect from 'vue-multiselect';

export default {
    name: 'AdDetails',
    components: {
        Multiselect
    },
    data() {
        return {
            categories: ['AUTOMOTIVE', 'BANKING', 'CONSTRUCTION & BUILDING', 'CONSUMER GOODS', 'ELECTRONICS AND GAGDGETS', 'ENERGY', 'BOOKS & PUBLISHING', 'FOOD & BEVERAGE', 'HEALTHCARE & PHARMACEUTICALS', 'HIGH TECH INDUSTRIES', 'HOTELS, RESORTS & SPA', 'INSURANCE', 'MEDIA', 'REAL ESTATE', 'RETAIL', 'SERVICES', 'SOFTWARE PRODUCTS & SERVICES', 'TELECOM', 'TRANSPORTATION', 'TRAVEL', 'UTILITIES', 'WHOLESALE'],
            selectedCategory: null,
            comment: ''
        };
    },
    methods: {
        async submitAdDetails() {
            try {
                let clientAdPlan = this.$parent.clientAdPlan;
                clientAdPlan.Category = 'MEDIA';
                clientAdPlan.Comments = this.comment;
                await instance.put(`api/clientadplans/${this.$route.query.clientadplan}`, clientAdPlan);

                this.$swal({
                    title: 'Saved',
                    text: 'Saved succesffully. Now redirecting to video upload',
                    type: 'success',
                    confirmButtonColor: '#ff6500'
                });
                this.$emit('advanceToUpload', 'MEDIA');
            } catch (err) {
                console.error(err);
            }
        }
    }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
.multiselect__option--selected {
    background: $lighter-grey !important;
}

.multiselect__option--highlight {
    background: $brand-primary !important;
}

.details {
    margin: 0 16px;
    background-image: url('../../../assets/images/pattern.svg');
    background-color: $brand-primary;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    padding: 64px 64px;
    border-radius: 8px;

    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
        padding: 8px;
        font-size: 14px;
    }

    .details-wrapper {
        background: $white;
        box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 32px;

        @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
            .t-l {
                font-size: 12px !important;
            }
        }
    }
}
</style>
