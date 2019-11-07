<template>
    <b-modal v-model="model" centered hide-footer no-close-on-esc no-close-on-backdrop title="Reset Password">
        <div class="user-login">
            <div class="content">
                <div class="content-area">
                    <h3></h3>
                    <p>Please enter your new password.</p>
                    <form name="resetpasswordForm">
                        <div class="form-group">
                            <input v-model="formData.password1" type="password" class="form-control mb16" placeholder="New Password" />
                            <input v-model="formData.password2" type="password" class="form-control mb16" placeholder="Confirm New Password" />
                            <div v-if="(formData.password1 != formData.password2) && formData.password1 != null" class="alert alert-danger text-center">
                                <p>Passwords don't match</p>
                            </div>
                            <p class="mt16 mb16 t-s">Password must contain at least 8 characters with at least 1 capital letter, 1 small letter and 1 number</p>
                            <button type="button" :disabled="formData.password1 != formData.password2 || !formData.password1 || !isValid" @click="resetPasswordRequest()" class="btn btn-primary btn-full">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </b-modal>
</template>


<script>
import instance from '@/api';

export default {
    name: 'ResetPassword',
    props: [],
    data() {
        return {
            api: 'api/auth/resetpassword/',
            formData: {
                password1: null,
                password2: null
            },
            model: true,
            token: this.$route.query.token
        };
    },
    methods: {
        async resetPasswordRequest() {
            try {
                await instance.post('api/auth/resetpassword/' + this.token, { password: this.formData.password2 });
                this.$router.push({ name: 'Home' }, () => { });
                this.$store.commit('DIALOG', true);
                this.$swal({
                    title: 'Success',
                    text: 'Your password was reset successfully. Please continue to login.',
                    type: 'success',
                    confirmButtonColor: '#ff6500'
                });
            } catch (err) {
                this.$router.push({ name: 'ForgotPassword' }, () => { });
                this.$swal({
                    title: 'Link Expired',
                    text: 'Your link is expired.Please continue to request a link again.',
                    type: 'warning',
                    confirmButtonColor: '#ff6500'
                });
            }
        }
    },
    computed: {
        isValid() {
            let flag = true;
            if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(this.formData.password2))) {
                flag = false;
            }

            return flag;
        }
    }
};
</script>

<style scoped lang="scss">
    .user-login {
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
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
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