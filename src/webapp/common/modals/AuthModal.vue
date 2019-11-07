<template>
    <b-modal v-model="$store.state.auth.showDialog" centered hide-header hide-footer no-close-on-esc no-close-on-backdrop id="auth-modal">
        <div class="user-login">
            <div class="tabs">
                <ul>
                    <li :class="{'active' : getDefaultChosen === 'register'}" @click="goToComponent('register')" v-show="!isEmailConfirmed">Register</li>
                    <li :class="{'active' : getDefaultChosen === 'login', 'full-width' : isEmailConfirmed }" @click="goToComponent('login')">Login</li>
                </ul>
            </div>
            <div class="content" :class="{'pt0': isEmailConfirmed}">
                <div class="content-area">
                    <div v-if="getDefaultChosen === 'login'">
                        <Login :is-email-confirmed="isEmailConfirmed" @close="close"></Login>
                    </div>
                    <div v-else-if="!isEmailConfirmed">
                        <Register></Register>
                    </div>
                    <div class="lh16 text-center mt16">
                        <a @click="close" class="brand-primary" v-if="$route.name !== 'BookingFlow' && $route.name !== 'Addons'">Continue as guest</a>
                    </div>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import Login from '@/webapp/common/auth/Login';
import Register from '@/webapp/common/auth/Register';

export default {
    name: 'AuthModal',
    components: {
        Login,
        Register,
    },
    data() {
        return {
            isEmailConfirmed: undefined
        };
    },
    methods: {
        close() {
            this.$store.commit('DIALOG', false);
            this.$emit('closed', true);
        },
        goToComponent(name) {
            this.$store.state.auth.defaultChosen = name;
        }
    },
    computed: {
        ...mapGetters(['getDefaultChosen'])
    },
    watch: {
        $route() {
            this.close();
        }
    },
    created() {
        if (this.$route.query && this.$route.query.emailconfirmed) {
            this.isEmailConfirmed = true;
        }
    }
};
</script>

<style lang="scss">
    #auth-modal {
        .modal-content {
            background-color: transparent !important;
            border: none;

            .modal-body {
                padding: 0;
            }
        }
    }
</style>
<style lang="scss" scopped>
    .user-login {
        width: 100%;

        .tabs {
            ul {
                list-style: none;
                padding-left: 0;
                background-color: transparent;
                height: 64px;
                margin: 0;

                li {
                    background-color: #eee;
                    display: inline-block;
                    width: 50%;
                    text-align: center;
                    padding: 16px;
                    height: 48px;
                    vertical-align: text-bottom;
                    border-top-left-radius: 6px;
                    border-top-right-radius: 6px;
                    line-height: 13px;
                    color: $brand-primary;
                    font-weight: bold;
                    cursor: pointer;

                    &.active {
                        background-color: #fff;
                        height: 64px;
                        margin-top: 0;
                        line-height: 32px;
                        width: calc(50% - 2px);

                        &:first-child {
                            margin-right: 2px;
                        }

                        &:last-child {
                            margin-left: 2px;
                        }
                    }

                    &.full-width {
                        margin-left: 0 !important;
                        width: 100% !important;
                        padding-bottom: 0 !important;
                        font-size: 18px;
                    }
                }
            }
        }

        .content {
            position: relative;
            background-color: #fff;
            padding: 32px 64px;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;

            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #fff;
                opacity: 0.5;
                z-index: 2;
            }
        }

        @media (max-width: 768px) {
            .content {
                padding: 32px 24px;
            }
        }

        /* iPad Portrait */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            .content {
                padding: 32px 40px;
            }
        }
    }
</style>