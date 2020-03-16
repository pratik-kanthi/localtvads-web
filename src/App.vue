<template>
    <div id="app">
        <web-header></web-header>
        <div class="content-wrapper">
            <div class="cookie-policy" v-show="isShowCookiePolicy">
                <div class="row">
                    <div class="col-sm-10 col-8">
                        <p class="p16 mb0">This website or its third-party tools use cookies, which are necessary to its functioning and required to achieve the purposes illustrated in the cookie policy. By clicking on Allow, scrolling this page, clicking a link or continuing to browse otherwise, you agree to the use of cookies.</p>
                    </div>
                    <div class="col-sm-2 col-4">
                        <button class="btn btn-sm btn-primary mt16 mb16" @click="setCookiesPolicy">
                            Allow
                        </button>
                    </div>
                </div>
            </div>
            <router-view></router-view>
        </div>
        <web-footer></web-footer>
    </div>
</template>

<script>
import Header from './webapp/layout/Header';
import Footer from './webapp/layout/Footer';

export default {
    name: 'App',
    components: {
        webHeader: Header,
        webFooter: Footer
    },
    data() {
        return {
            isShowCookiePolicy: !window.localStorage.getItem('cookie-policy')
        };
    },
    methods: {
        setCookiesPolicy() {
            localStorage.setItem('cookie-policy', '1');
            this.isShowCookiePolicy = false;
        }
    }
};
</script>

<style lang="scss">
    #app {
        color: $body-text;
        font-family: $font-family-body;
        font-size: $base-font-size;
        line-height: $line-height-base;
        font-weight: 400;
        height: 100%;
        background-color: $body-background;
        overflow-x: hidden;

        .content-wrapper {
            min-height: calc(100vh - 80px);
            .cookie-policy {
                position: fixed;
                width: 100%;
                z-index: 100;
                background: $black;
                color: $white;
                top: 0;
                opacity: 0.9;
            }
        }
    }
</style>
