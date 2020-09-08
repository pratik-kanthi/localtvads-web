<template>
    <div class="tabs-wrapper">
        <div class="row">
            <div class="col-sm-8">
                <div v-if="rData && rData.Name">
                    <slot v-if="$slots.default"></slot>
                    <Back v-else :text="rData.Name" class="mb16"></Back>
                </div>
            </div>
        </div>
        <Tabs :data="tabs" :type="type" :limit="5"></Tabs>
        <div class="tab-content" v-if="rData && !$route.meta.isKeepAlive">
            <router-view></router-view>
        </div>
        <div class="tab-content" v-else-if="rData && $route.meta.isKeepAlive">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import Tabs from '../components/Tabs';
export default {
    name: 'ModuleItemLayout',
    props: {
        tabs: {
            type: Array,
            required: true
        },
        type: {
            type: String,
            default: 'simple'
        },
        limit: {
            type: Number,
            default: 0
        },
        rData: {
            type: [Object, Boolean],
            default: () => {
                return null;
            }
        }
    },
    components: {
        Tabs
    }
};
</script>

<style lang="scss" scoped>
.back {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    i {
        margin-right: 16px;
        font-size: 32px;
        font-weight: 600;
        cursor: pointer;
    }
}
.tabs-wrapper {
    width: 100%;
    .tab-content {
        margin-top: 8px;
    }
}
</style>
