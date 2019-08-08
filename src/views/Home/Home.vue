<template>
    <section>
        <div class="cover">
            <v-img :src="backgroundImage" alt="" height="300px">
                <div class="overlay"></div>
                <div class="cover-text">
                    <h1 class="page-title font-weight-bold mb-5">Grow Your Business <span class="faster">Faster</span></h1>
                    <p class="mb-1 body-1 font-weight-light">Creating an ad for your business is easier than you think.</p>
                    <p class="mb-1 body-1 font-weight-light">Free ad slot for all new user.</p>
                </div>
            </v-img>
        </div>
        <v-container>
            <div class="content-area">
                <div class="tabs">
                    <ul>
                        <li :class="{'active' : activeTab === 'bookad'}"><a @click="goToComponent('bookad')"><v-icon color="white" class="mr-4">ondemand_video</v-icon>Book Your Ad</a></li>
                        <li :class="{'active' : activeTab === 'createad'}"><a @click="goToComponent('createad')"><v-icon color="white" class="mr-4">video_call</v-icon>Create Your Ad</a></li>
                    </ul>
                </div>
                <div class="content">
                    <v-img :src="patternImage" alt="">
                        <keep-alive>
                            <component :is="currentComponent"></component>
                        </keep-alive>
                    </v-img>
                </div>
            </div>
        </v-container>
    </section>

</template>

<script>
import BookAd from "@/components/BookAd";
import CreateAd from "@/components/CreateAd.vue";
export default {
    name: 'Home',
    components: {
        BookAd,
        CreateAd
    },
    data() {
        return {
            backgroundImage: require('@/assets/images/home-cover.jpg'),
            patternImage: require('@/assets/images/pattern.svg'),
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

<style lang="scss" scoped>
    .cover {
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.6);
        }
        .cover-text {
            position: relative;
            padding: 50px 150px;
            color: white;
            .faster {
                color: primary !important;
            }
        }
    }
    .content-area {
        margin-top: -76px;
        position: relative;
        .tabs {
            ul {
                list-style: none;
                padding: 0;
                height: 64px;
                li {
                    display: inline-block;
                    background-color: #F56100;
                    width: 50%;
                    text-align: center;
                    padding: 12px;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    height: 48px;
                    line-height: 20px;
                    vertical-align: text-bottom;
                    a {
                        text-decoration: none;
                        color: white;
                        font-weight: bold;
                    }
                    &.active {
                        background-color: $brand-primary;
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
        }
        .content {
            height: 300px;
            color: #fff;
            background-color: $brand-primary;
            border-top: 1px solid transparent;
            border-bottom: 1px solid transparent;
        }
    }
</style>

