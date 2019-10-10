<template>
    <div class="create-ad">
        <h1 class="text-white">Create a new ad</h1>
        <div class="create-video">
            <h4>Choose photos & audio, and create outstanding video ads. </h4>
            <router-link tag="div" to="/create-ad">
                <button class="btn btn-white mb0">Create your ad</button>
            </router-link>
        </div>
        <div class="separator">
            <span class="text">or</span>
        </div>
        <div class="upload-video">
            <h4>Upload your own video ads</h4>
            <button class="btn btn-white mb0">Upload your ad</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CreateAd',
    data() {
        return {

        };
    }

};
</script>

<style lang="scss">
    .create-ad {
        padding: 40px;
        text-align: center;
        color: #FFF !important;
        h4 {
            color: #FFF !important;
        }
        .separator {
            border-top: 1px solid #DDD;
            margin: 40px 0;
            .text {
                background: $brand-primary;
                padding: 0 12px;
                font-size: 18px;
                color: #FFF !important;
                position: relative;
                top: -14px;
            }
        }
    }
</style>
