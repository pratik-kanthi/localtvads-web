<template>
    <div v-if="imageUrl" class="image-container">
        <div class="image" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + imageUrl + ')' }"></div>
        <div class="image-overlay d-flex justify-content-center align-items-center"><i @click="openImage" class="option material-icons t-xxl white pointer">zoom_in</i></div>
    </div>
</template>

<script>
export default {
    name: 'AssetImageCard',
    props: {
        id: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        }
    },
    methods: {
        deleteImage() {
            this.$swal({
                title: 'Delete this image?',
                text: 'Image will be deleted from your asset library',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                closeOnConfirm: false
            }).then(isConfirm => {
                if (isConfirm.value) {
                    this.$emit('delete');
                }
            });
        },
        openImage() {
            this.$emit('openimage');
        }
    }
};
</script>

<style lang="scss" scoped>
.image-container {
    width: 278px;
    height: 134px;
    position: relative;

    .image {
        height: 100%;
        width: 100%;
        border-radius: 5px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
    }

    .image-overlay {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        transition: 0.5s ease;
        display: none;
        border-radius: 5px;
        z-index: 999;
    }

    .option {
        display: none;
        z-index: 999;
    }

    .image-container:hover .image-overlay {
        display: block;
        background: rgba(0, 0, 0, 0.6);
    }

    .image-container:hover .option {
        display: block;
        transition: 0.5s ease;
    }

    .image-options {
    }
}
</style>
