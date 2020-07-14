<template>
    <button type="button" class="btn" :class="['btn-' + size, 'btn-' + type, customClass, isLoading ? 'btn-loader' : '']" :disabled="isLoading || disabled" @click="callAction" :style="backgroundColor" ref="button">
        <slot class="icon" v-if="$slots.default && !isLoading"></slot>
        <img class="loader" v-show="isLoading" :src="loaderImageUrl" alt="loader" />
        <span v-show="loaderText && isLoading">{{ loaderText }}</span>
        <span v-show="!isLoading">
            {{ text }}
        </span>
    </button>
</template>

<script>
export default {
    name: 'CustomButton',
    props: {
        action: {
            type: Function,
            required: true
        },
        async: {
            type: Boolean,
            default: false
        },
        color: {
            type: String
        },
        customClass: {
            type: String
        },
        disabled: {
            type: Boolean,
            default: false
        },
        loaderText: {
            type: String
        },
        loaderImage: {
            type: String
        },
        size: {
            type: String,
            validator: value => {
                return ['xs', 'sm', 'md', 'lg'].indexOf(value) > -1 || !value;
            },
            default: 'md'
        },
        text: {
            type: String,
            required: true
        },
        type: {
            type: String,
            validator: value => {
                return ['danger', 'success', 'warning', 'info', 'primary', 'secondary', 'ternary'].indexOf(value) > -1 || !value;
            }
        }
    },
    data() {
        return {
            isLoading: false,
            actions: {}
        };
    },
    methods: {
        async callAction() {
            if (this.async) {
                let oldWidth;
                if (this.$refs.button) {
                    oldWidth = this.$refs.button.style.width;
                    this.$refs.button.style.width = this.$refs.button.offsetWidth + 'px';
                }
                this.isLoading = true;
                try {
                    await this.actions.click();
                    this.isLoading = false;
                } catch (e) {
                    this.isLoading = false;
                }
                if (this.$refs.button) this.$refs.button.style.width = oldWidth;
            } else {
                this.action();
            }
        }
    },
    computed: {
        backgroundColor() {
            if (this.color) {
                return {
                    'background-color': this.color
                };
            }
            return {};
        },
        loaderImageUrl() {
            if (this.loaderImage) {
                return this.loaderImage;
            }
            return require('@/assets/images/circular-loader.svg');
        }
    },
    created() {
        this.$set(this.actions, 'click', () => {
            return new Promise(async (resolve, reject) => {
                try {
                    await this.action();
                    resolve();
                } catch (err) {
                    return reject(err);
                }
            });
        });
    }
};
</script>

<style lang="scss" scoped>
.btn {
    color: #fff;
    padding: 12px 16px;
    border-radius: $border-radius;
    border: none;
    outline: 0 !important;
    min-width: 80px;
    display: inline-flex;
    justify-content: center;
    cursor: pointer;
    &.btn-loader {
        align-items: center;
        padding-top: 0;
        padding-bottom: 0;
        .loader {
            margin: auto 8px auto 0;
            height: 100%;
        }
    }
    .icon {
        margin-right: 8px;
    }
    &-xs {
        padding: 4px 8px;
        min-width: 72px;
        font-size: 11px;
        height: 24px;
        .loader {
            width: 12px;
        }
    }
    &-sm {
        padding: 8px 12px;
        font-size: 14px;
        height: 32px;
        .loader {
            width: 16px;
        }
    }
    &-md {
        font-size: 16px;
        min-width: 100px;
        padding: 8px 16px;
        height: 40px;
        .loader {
            width: 20px;
            height: 20px;
        }
    }
    &-lg {
        font-size: 18px;
        min-width: 120px;
        padding: 16px 32px;
        height: 54px;
        .loader {
            height: 100%;
            width: 27px;
        }
    }
    &-primary {
        background-color: $brand-primary;
    }
    &-secondary {
        background-color: $brand-secondary;
    }
    &-ternary {
        background-color: $brand-ternary;
    }
    &-success {
        background-color: $success;
    }
    &-danger {
        background-color: $danger;
    }
    &-warning {
        background-color: $warning;
    }
    &-info {
        background-color: $info;
    }
    &:disabled {
        cursor: not-allowed !important;
        opacity: 0.5;
    }
}
</style>
