<template>
    <div>
        <div class="create-video">create video ads</div>
        <button class="btn btn-primary" @click="show = true">Upload</button>
        <div v-if="show">
            <ImageUpload :config="config" :show="show" :data="data" @close="close"></ImageUpload>
        </div>
    </div>
</template>

<script>
    import ImageUpload from '@/e9_components/components/ImageUpload';

    export default {
        name: 'CreateVideoAd',
        data() {
            return {
                config: {
                    api: 'api/clientresource/image',
                    aspectRatio: 1.77,
                    minWidth: 500
                },
                show: false,
                data: {
                    name: 'First Image',
                    owner: 'Client',
                    ownerid: '5d5d55d91eb4c86fba0305b6'
                }
            }
        },
        components: {
            ImageUpload
        },
        methods: {
            close(){
                this.show = false;
            }
        }
    }
</script>

<style lang="less">
</style>
