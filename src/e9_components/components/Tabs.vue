<template>
    <ul class="tabs" :class="type">
        <li v-for="(tab, key) in displayedTabs" :key="key">
            <router-link v-if="tab.path" tag="a" :to="tab.path" active-class="active">
                <span>{{ tab.name }}</span>
            </router-link>
            <a
                v-else
                @click="selectTab(tab, key)"
                :class="{ active: active === key, disabled: tab.disabled }"
            >
                <span>{{ tab.name }}</span>
            </a>
        </li>
        <li
            class="has-dropdown"
            v-if="limit && data.length - displayedTabs.length > 0"
            @mouseenter="handleDropdown"
        >
            <a>
                More
                <div class="arrow-down"></div>
            </a>
            <ul class="sub-nav" :style="morePosition">
                <li v-for="(tab, subKey) in data.slice(limit)" :key="subKey + displayedTabs.length">
                    <router-link v-if="tab.path" tag="a" :to="tab.path">{{ tab.name }}</router-link>
                    <a
                        v-else
                        @click="selectTab(tab, subKey + displayedTabs.length)"
                        :class="{ disabled: tab.disabled }"
                    >{{ tab.name }}</a>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Tabs',
    props: {
        active: {
            type: Number,
            default: 0,
        },
        data: {
            type: Array,
            required: true,
        },
        type: {
            type: String,
            default: 'simple',
        },
        limit: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            morePosition: {},
        };
    },
    methods: {
        handleDropdown($event) {
            if (window.innerWidth < 768) {
                this.morePosition = {
                    top: $event.y + 20 + 'px',
                    left: $event.x - 40 + 'px',
                };
            } else {
                this.morePosition = {};
            }
        },
        selectTab(tab, index) {
            if (tab.disabled) return false;
            this.$emit('update:active', index);
            this.$emit('changed', index);
        },
    },
    computed: {
        displayedTabs() {
            if (this.limit && ['stacked'].indexOf(this.type) === -1) {
                return this.data.slice(0, this.limit);
            }
            return this.data;
        },
    },
};
</script>

<style lang="scss" scoped>
.tabs {
    list-style: none;
    padding-left: 0;
    margin: 0;
    li {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        outline: 0 !important;
        a {
            text-decoration: none;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: $dark-grey;
            overflow: hidden;
            &.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                color: $grey;
            }
            span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            &:focus {
                outline: 0 !important;
            }
            -webkit-tap-highlight-color: transparent !important;
        }
        &:not(.has-dropdown) {
            &:hover {
                a {
                    &:not(.disabled) {
                        color: $brand-primary !important;
                    }
                }
            }
        }
        &.has-dropdown {
            position: relative;
            a {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: row;
                .arrow-down {
                    display: inline-block;
                    width: 0;
                    height: 0;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-top: 6px solid $brand-primary;
                    margin-left: 8px;
                }
                &:hover {
                    color: $brand-primary;
                }
            }
            .sub-nav {
                display: none;
                list-style: none;
                margin: 0;
                padding: 0;
                background: #fff;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
                border-radius: 6px;
                // border: 1px solid $light-grey;
                position: absolute;
                top: 102%;
                z-index: 10;
                li {
                    width: 150px;
                    margin-right: 0;
                    // &:not(:last-child) {
                    //     border-bottom: 1px solid $light-grey;
                    // }
                }
            }
            &:hover {
                .sub-nav {
                    display: block;
                }
            }
        }
    }
    &.simple {
        li {
            width: 120px;
            padding: 4px 8px 0 0;
            // width: auto;
            // max-width: 150px;
            // padding: 4px 8px;
            // &:first-child {
            //     padding-left: 0;
            // }
            background-color: transparent;
            margin-right: 16px;
            height: 38px;
            font-size: 18px;
            a {
                font-weight: 300;
                color: #a4a4a4;
                width: 100%;
                text-align: center;
                &.active {
                    border-bottom: 3px solid $brand-primary;
                    span {
                        color: $brand-primary;
                        font-weight: 700;
                    }
                }
            }
        }
    }
    &.angled {
        li {
            width: 150px;
            text-align: center;
            position: relative;
            a {
                position: relative;
                width: 100%;
                padding: 12px 4px;
                &.active {
                    border-bottom: 3px solid $brand-primary;
                    span {
                        margin-left: -16px;
                        color: $brand-primary;
                        z-index: 1;
                    }
                    &:after {
                        content: '';
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        z-index: 0;
                        border: 1px solid $lighter-grey;
                        border-bottom: 0;
                        border-radius: 2px 0 0 0;
                        background: #fff;
                        -webkit-transform: perspective(5px) rotateX(1.4deg) translateZ(-1px);
                        transform: perspective(5px) rotateX(1.4deg) translateZ(-1px);
                        -webkit-transform-origin: 0 0;
                        transform-origin: 0 0;
                        -webkit-backface-visibility: hidden;
                        backface-visibility: hidden;
                    }
                }
            }
        }
    }
    &.stacked {
        li {
            display: block;
            margin-bottom: 8px;
            width: 100%;
            background-color: $lighter-grey;
            border-radius: $border-radius;
            a {
                width: 100%;
                font-weight: 600;
                font-size: 14px;
                span {
                    color: $dark-grey;
                    padding: 12px;
                }
                &.active {
                    background-color: $brand-primary;
                    span {
                        color: #fff;
                    }
                }
            }
        }
    }
}
@media (max-width: 767px) {
    .tabs {
        display: flex;
        overflow-x: auto;
        &::-webkit-scrollbar {
            display: none;
        }
        li {
            flex-shrink: 0;
            a {
                overflow: hidden;
                span {
                    margin-left: 0 !important;
                }
                &.active {
                    span {
                        margin-left: -8px !important;
                    }
                }
            }
        }
        .sub-nav {
            position: fixed !important;
        }
        &.stacked {
            li {
                margin-right: 8px;
                a {
                    &.active {
                        span {
                            margin-left: 0 !important;
                        }
                    }
                }
            }
        }
        &.angled {
            .sub-nav {
                width: 80px;
            }
            li {
                width: 80px !important;
                a {
                    font-size: 12px;
                    height: 42px;
                    padding: 0 12px;
                }
            }
        }
    }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    .tabs {
        &.simple {
            li {
                width: 104px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}
@media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .tabs {
        &.simple {
            li {
                width: 112px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}
@media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
    .tabs {
        &.simple {
            li {
                width: 104px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}
</style>
