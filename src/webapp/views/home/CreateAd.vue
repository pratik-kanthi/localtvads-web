<template>
    <div class="create-ad">
        <h4>Start creating your ad here.</h4>
        <ImageUpload :show="show" :config="config" @uploaded="postUpload" @close="close"></ImageUpload>
    </div>
</template>

<script>
    import ImageUpload from '@/e9_components/components/ImageUpload';
export default {
    name: "CreateAd",
    data() {
        return {
            show: true,
            config: {
                api: 'api/clientresource/image',
                ownerid: this.$store.state.user.Owner._id,
                owner: 'Client',
                attribute: 'ImageUrl',
                cropx: '',
                cropy: '',
                cropx2: '',
                cropy2: '',
                height: '',
                width: '',
                minWidth: '',
                maxSize: 2
            }
        }
    },
    components: {ImageUpload},
    methods: {
        postUpload(){
            this.show = false;
        },
        close(){
            this.show = false;
        }
    }
}
</script>

<style lang="less">
    .create-ad {
        padding: 40px;
        color: #FFF !important;
        h4 {
            color: #FFF !important;
        }
    }
</style>
