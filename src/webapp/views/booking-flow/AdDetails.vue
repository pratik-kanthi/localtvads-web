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
            categories: [
                'Advertising Agency',
                'Agency',
                'Agriculture',
                'Alcohol Aware',
                'Appliance Shop',
                'Apps (Phone)',
                'Art/Artist',
                'Auction Room/House',
                'Autorent/Car Hire',
                'Baby Products',
                'Banks',
                'Bathroom Showroom',
                'Beauty & Health',
                'Beauty & Health - Face',
                'Beauty & Health - Feet',
                'Beauty & Health - Hair Removal',
                'Beauty Salon',
                'Bed Store',
                'Book Shop',
                'Bookmakers',
                'Broadband/Television',
                'Car Showroom',
                'Caravan',
                'Caravan Park',
                'Cars',
                'Catering Company',
                'Charity',
                'Cleaning Company',
                'Clothing',
                'Clothing Shop',
                'Coaches',
                'Comparision Website',
                'Competitions',
                'Computer',
                'Construction',
                'Contraception',
                'Cookery School',
                'Cosmetics',
                'Courier',
                'Credit Card',
                'Dating Services',
                'Dental Surgery',
                'DIY',
                'Drinks',
                'Driving School',
                'Dry Cleaning Services',
                'Education',
                'Electrical Products',
                'Electronic Cigarettes',
                'Employment Agencies',
                'Engery Companies',
                'Entertainment ',
                'Entertainment Home',
                'Enviromental Services',
                'Estate Agent',
                'Exhibitions / Event',
                'Eye Care',
                'Family Planning / Sexual Matters',
                'Fashion',
                'Fast Food',
                'Feminine Hygiene',
                'Finanical Services',
                'Fitness',
                'Flooring',
                'Florist / Flowers',
                'Food Delivery',
                'Food Delivery',
                'Fostering',
                'Fuel',
                'Funerals Directors',
                'Furniture Shop',
                'Gambling / Casinos',
                'Garden Centre',
                'Gas Services',
                'Gifts',
                'Government',
                'Hairdressing / Beauty Services',
                'Health',
                'Health Services',
                'Hearing Aids',
                'Heating',
                'Holidays',
                'Home',
                'Home Improvement',
                'Hotel',
                'Household Products',
                'Household Products - Bathroom',
                'Household Products - Cleaning',
                'Household Products - Clothing',
                'Household Products - Dishwasher',
                'Household Products - Floors',
                'Household Products - Fragrance',
                'Household Products - Kitchen',
                'Household Storage',
                'Insurance',
                'Interior Designers',
                'Internet Services',
                'IT',
                'Jewellery',
                'Kitchen Showroom',
                'Landcaping',
                'Leisure Centre',
                'Light Showroom',
                'Loans',
                'Local Produce',
                'Market Place',
                'Media',
                'Medicine',
                'Medicine - Cold & Flu',
                'Medicine - Cold Sore',
                'Medicine - Heartburn / Indigestion',
                'Medicine - Pills',
                'Medicine - Throat',
                'Mens Health',
                'Motabilty ',
                'Motor Garage',
                'Motorcyles',
                'Music Shop',
                'Office Furniture',
                'Office Rentals',
                'Optical Services',
                'Oral Health',
                'Pet Shop',
                'Pets / Vets',
                'Pharmacutical',
                'Phoneservices',
                'Photographer',
                'Plant Hire',
                'Plumbing Services',
                'Press',
                'Printers',
                'Property Development',
                'Public Service',
                'Public Service',
                'Recruitment',
                'Religion / Superstition',
                'Rental Services',
                'Restaurants',
                'Retail',
                'Roofs & Windows',
                'Sexpress / Text',
                'Shopping Centre',
                'Slimming / Weight Loss',
                'Smoking / Anti-smoking',
                'Solicitors',
                'Sport',
                'Supermarket',
                'Taxi',
                'Technology',
                'Teleshopping',
                'Tourism',
                'Toys',
                'Trade',
                'Transport',
                'Travel Agent',
                'Womens Health'
            ],
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
                    text: 'Redirecting to video upload',
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
