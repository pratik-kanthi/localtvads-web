<template>
    <div class="home">
        <div class="cover">
            <div class="overlay-layer"></div>
            <div class="container">
                <div class="tagline">
                    <h1>Grow Your Business <span class="brand-primary">Faster</span></h1>
                    <h4>Createing an ad for your business is easier than you think.
                        <br />Free ad slots for all new users.
                    </h4>
                </div>
            </div>
        </div>
        <div class="container content-area">
            <ul class="tabs">
                <li :class="{'active' : activeTab === 'bookad'}" @click="goToComponent('bookad')">Book Your Ad</li>
                <li :class="{'active' : activeTab === 'createad'}" @click="goToComponent('createad')">Create Your Ad</li>
            </ul>
            <div class="content">
                <keep-alive>
                    <component :is="currentComponent"></component>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
import BookAd from "@/webapp/home/BookAd.vue";
import CreateAd from "@/webapp/home/CreateAd.vue";
export default {
    name: 'Home',
    components: {
        BookAd,
        CreateAd
    },
    data() {
        return {
            component: {
                bookad: BookAd,
                createad: CreateAd
            },
            currentComponent: BookAd,
            activeTab: 'bookad'
        }
    },
    methods: {
        goToComponent(name) {
            this.currentComponent = this.component[name];
            this.activeTab = name;
        }
    }
}
</script>

<style lang="less">
    .home {
        .cover {
            background-image: url('../../assets/images/home-cover.jpg');
            background-size: cover;
            height: 300px;
            background-repeat: no-repeat;
            background-position: center center;
            position: relative;
            .overlay-layer {
                position: absolute;
                background-color: rgba(0,0,0,0.7);
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
            }
            .tagline {
                position: relative;
                padding: 40px 120px;
                h1 {
                    font-weight: 400;
                    span {
                        font-weight: 400 !important;
                        color: @brand-primary;
                    }
                }
            }
        }
        .content-area {
            margin-top: -64px;
            ul.tabs {
                list-style: none;
                padding: 0;
                margin-bottom: 0;
                height: 64px;
                li {
                    display: inline-block;
                    background-color: #F56100;
                    width: 50%;
                    text-align: center;
                    padding: 12px;
                    border-top-left-radius: 6px;
                    border-top-right-radius: 6px;
                    height: 48px;
                    line-height: 24px;
                    vertical-align: text-bottom;
                    color: #FFF;
                    font-weight: 500 !important;
                    font-size: 16px !important;
                    font-family: @font-family-heading;
                    a {
                        text-decoration: none;
                        color: #FFF !important;
                        font-weight: bold;
                    }
                    &.active {
                        background-color: @brand-primary;
                        border-bottom: none;
                        height: 64px;
                        margin-top: 0;
                        line-height: 40px;
                        width: calc(50% - 2px);
                        &:first-child {
                            margin-right: 2px;
                        }
                        &:last-child {
                            margin-left: 2px;
                        }
                    }
                }
            }
            .content {
                background-image: url('../../assets/images/pattern.svg');
                background-size: cover;
                background-position: center center;
                height: 300px;
                color: #fff;
                background-color: @brand-primary;
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
            }
        }
    }
</style>
