<template>
    <div>
        <div class="google-address" v-click-outside="closeAddressList">
            <input type="text" aria-label="google-address" v-model.lazy="searchTxt" class="google-address-text" @change="searchChanged" autocomplete="no" placeholder="Start typing to search..." />
            <div ref="mapDiv"></div>
            <ul class="places-result" v-if="!addressSelected && predictions.length > 0">
                <li v-for="(_pred, key) in predictions" :key="key">
                    <a v-text="_pred.description" @click="setAddress(_pred)"></a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Address from '@/models/Address';

export default {
    name: 'AddressFinder',
    props: {
        address: {
            type: Object,
            default: () => {
                return {};
            }
        },
        google: {
            type: Object,
            required: true
        },
        options: {
            type: Object
        }
    },
    data() {
        return {
            searchTxt: '',
            addressSelected: false,
            addressObj: this.address,
            autocomplete: null,
            predictions: []
        };
    },
    methods: {
        closeAddressList() {
            this.predictions = [];
        },
        setAddress(pred) {
            this.addressObj = {};
            new this.google.maps.places.PlacesService(this.$refs.mapDiv).getDetails(
                {
                    placeId: pred.place_id,
                    fields: ['address_component', 'geometry', 'formatted_address']
                },
                place => {
                    this.addressSelected = true;
                    this.searchTxt = place.formatted_address;
                    let street_number = place.address_components.filter(function(ac) {
                        return ac.types.indexOf('street_number') !== -1 || ac.types.indexOf('premise') !== -1;
                    });
                    let street_route = place.address_components.filter(function(ac) {
                        return ac.types.indexOf('route') !== -1;
                    });
                    this.addressObj.Line1 = (street_number.length ? street_number[0].long_name : '') + ' ' + (street_route.length ? street_route[0].long_name : '');

                    let area = place.address_components.filter(function(ac) {
                        return ac.types.indexOf('locality') !== -1 || ac.types.indexOf('neighborhood') !== -1;
                    });
                    this.addressObj.Line2 = area.length ? area[0].long_name : null;

                    let townCity = place.address_components.filter(function(ac) {
                        return ac.types.indexOf('postal_town') !== -1;
                    });
                    this.addressObj.TownCity = townCity.length ? townCity[0].long_name : null;

                    let county = place.address_components.filter(function(ac) {
                        return ac.types.indexOf('administrative_area_level_2') !== -1;
                    });
                    this.addressObj.County = county.length ? county[0].long_name : null;

                    let postcode = place.address_components.filter(function(ac) {
                        return ac.types.indexOf('postal_code') !== -1;
                    });
                    this.addressObj.PostCode = postcode.length ? postcode[0].long_name : null;

                    let country = place.address_components.filter(function(ac) {
                        return ac.types.indexOf('country') !== -1;
                    });
                    this.addressObj.Country = country.length ? country[0].long_name : null;

                    if (place.geometry && place.geometry.location) {
                        this.addressObj.Location = {
                            type: 'Point',
                            coordinates: [place.geometry.location.lat(), place.geometry.location.lng()]
                        };
                    }
                    this.$emit('updated', new Address(this.addressObj));
                    this.$emit('update:address', new Address(this.addressObj));
                }
            );
        },
        searchChanged() {
            if (this.searchTxt.length >= 3) {
                new this.google.maps.places.AutocompleteService().getPlacePredictions(
                    {
                        input: this.searchTxt,
                        ...this.options
                    },
                    preds => {
                        this.predictions = [];
                        if (preds) {
                            this.addressSelected = false;
                            this.predictions = preds;
                        }
                    }
                );
            } else {
                this.predictions = [];
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.google-address {
    position: relative;
    margin-bottom: 1rem;
    width: 100%;
    label {
        margin-bottom: 0.5rem;
        display: block;
    }
    .google-address-text {
        background-image: url('../../assets/images/google.png');
        background-repeat: no-repeat;
        background-position: center left 4px;
        background-size: 24px;
        padding-left: 2rem;
        // width: calc(100% - 2rem);
        width: 100%;
        display: block;
        height: calc(1.5em + 0.75rem + 2px);
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid $line-color;
        border-radius: 0.25rem;
        &:focus {
            outline: 0;
        }
    }
    ul.places-result {
        position: relative;
        margin-top: 8px;
        background: #fff;
        z-index: 100;
        border: 1px solid $line-color;
        border-radius: 4px;
        padding-left: 0;
        list-style: none;
        li {
            display: block;
            padding: 0.5rem;
            border-bottom: 1px solid $line-color;
            a {
                width: 100%;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 14px;
                cursor: pointer;
            }
        }
    }
}
</style>
