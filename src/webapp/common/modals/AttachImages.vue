<template>
    <b-modal size="lg" v-model="show" title="Attach images to your add-on" hide-footer centered no-close-on-esc no-close-on-backdrop>
        <div class="t-l d-flex justify-content-between">
            <div>Select images to attach to your ad</div>
            <div>{{ imagesSelected.length }} image(s) selected</div>
        </div>
        <div class="row mt16 d-flex justify-content-start">
            <div class="p16" v-for="(img, key) in clientImages" :key="key">
                <div class="image" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + img.ResourceUrl + ')' }" @click="selectImage(img)">
                    <div :class="{ overlay: imagesSelected.indexOf(img._id) > -1 }"></div>
                    <input :id="img._id" type="checkbox" class="check" v-model="imagesSelected" :value="img._id" :disabled="true" />
                    <label :for="img._id" class="check-label box mb8 mr8">
                        <span></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="footer d-flex justify-content-end">
            <button class="btn btn-secondary-small">Cancel</button>
            <button @click="attachImages" class="btn btn-primary-small ml16">Confirm</button>
        </div>
    </b-modal>
</template>

<script>
import ResourceService from '@/services/ResourceService';

export default {
    name: 'AttachImages',
    props: {
        planImages: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            //flags
            show: true,
            imagesSelected: [],

            //data
            clientImages: []
        };
    },
    methods: {
        attachImages() {
            this.$emit('imagesselected', this.imagesSelected);
        },
        async getClientImages() {
            try {
                let result = await ResourceService.getResources();
                result.map(resource => {
                    if (resource.ResourceType == 'IMAGE') {
                        this.clientImages.push(resource);
                    }
                });
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        async getPlanImages() {
            try {
                let result = await ResourceService.getResources();
                result.map(resource => {
                    if (resource.ResourceType == 'IMAGE') {
                        this.clientImages.push(resource);
                    }
                });
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        },
        selectImage(img) {
            let index = this.imagesSelected.indexOf(img._id);
            if (index > -1) this.imagesSelected.splice(index, 1);
            else this.imagesSelected.push(img._id);
        }
    },
    created() {
        this.getClientImages();
    }
};
</script>

<style lang="scss">
.image {
    border-radius: 6px;
    height: 150px;
    width: 150px;
    background-size: cover;
    background-position: center center;
}
</style>
