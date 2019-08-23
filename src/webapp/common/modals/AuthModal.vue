<template>
    <v-dialog v-model="getShowDialog" width="500" persistent data-app>
        <div class="user-login">
            <div class="tabs">
                <ul>
                    <li :class="{'active' : tabActive === 'register'}" @click="goToComponent('register')">Register</li>
                    <li :class="{'active' : tabActive === 'login'}" @click="goToComponent('login')">Login</li>
                </ul>
            </div>
            <div class="content">
                <div class="content-area">
                    <div v-if="tabActive === 'login'">
                        <Login></Login>
                    </div>
                    <div v-else>
                        <Register></Register>
                    </div>
                    <div class="lh16 text-center mt16">
                        <a @click="close" class="brand-primary">Continue as guest</a>
                    </div>
                </div>
            </div>
        </div>
    </v-dialog>
</template>

<script>
    import Login from "@/webapp/common/auth/Login";
    import Register from "@/webapp/common/auth/Register";

    export default {
        name: "AuthModal",
        props: ['active'],
        components: {
            Login,
            Register
        },
        data() {
            return {
                tabActive: ''
            }
        },
        methods: {
            close() {
                this.$store.commit('DIALOG', false);
            },
            goToComponent(name) {
                this.tabActive = name;
            }
        },
        computed: {
            getShowDialog() {
                return this.$store.getters.getShowDialog;
            }
        },
        created() {
            this.tabActive = this.active;
        }
    }
</script>

<style scoped lang="less">
    .user-login {
        .tabs {
            ul {
                list-style: none;
                padding-left: 0;
                background-color: transparent;
                height: 64px;
                margin: 0;
                li {
                    background-color: #EEE;
                    display: inline-block;
                    width: 50%;
                    text-align: center;
                    padding: 16px;
                    height: 48px;
                    vertical-align: text-bottom;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    line-height: 13px;
                    color: @brand-primary;
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
                }
            }
        }

        .content {
            position: relative;
            background-color: #fff;
            padding: 32px 64px;

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
    }
</style>