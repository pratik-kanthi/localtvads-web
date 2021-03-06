<template>
    <div class>
        <LoaderModal :showloader="isLoading"></LoaderModal>
        <div v-if="showNewCard">
            <NewCardModal :show-new-card="showNewCard" @close="close"></NewCardModal>
        </div>
        <div class="container">
            <h3 class="brand-secondary mt64">My Account</h3>
            <div class="t-l brand-secondary mt24">Manage your account and payment methods using this page</div>

            <div class="profile-wrapper shadow-sm border p24 rounded mt32">
                <div class="d-flex justify-content-between">
                    <div class="t-xl black">Account Settings</div>
                    <div class="d-flex justify-content-start align-items justify-content-lg-end">
                        <div v-if="mode === 'VIEW'">
                            <button class="btn btn-primary-small" @click="openEditMode()">Edit Details</button>
                        </div>
                        <div v-if="mode === 'EDIT'" class="text-right mr16">
                            <button class="btn btn-sm btn-primary-small save" @click="updateProfile" :disabled="isProceedable">Save</button>
                        </div>
                        <div v-if="mode === 'EDIT'" class="text-right">
                            <button class="btn btn-sm btn-secondary-small cancel" @click="closeEditMode">Cancel</button>
                        </div>
                    </div>
                </div>
                <div class="row profile-details mt32">
                    <div class="col-lg-3 d-flex flex-column justify-content-start align-items-center">
                        <div>
                            <div v-if="$store.state.user.Owner && $store.state.user.Owner.ImageUrl" class="profile-image" :style="{ 'background-image': 'url(' + getProfileImageUrl + ')' }"></div>
                            <div v-if="$store.state.user.Owner && !$store.state.user.Owner.ImageUrl" class="profile-text">{{ $store.state.user.Owner.Title[0] }}</div>
                        </div>
                        <div>
                            <u class="brand-primary pointer t-l" @click="showProfileImageModal">Change profile picture</u>
                        </div>
                    </div>

                    <div class="col-lg-9 d-flex justify-content-between flex-column-reverse">
                        <div class="w-lg-50 mt-3 mt-lg-0">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group mb16">
                                        <label class="ml0">Name</label>
                                        <div v-if="mode === 'VIEW'">
                                            <div class="black">{{ getUser().Owner.Title }}</div>
                                        </div>
                                        <div v-else>
                                            <input type="text" class="form-control black" v-model="$store.state.user.Owner.Title" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group mb16">
                                        <label class="ml0">Account Email</label>
                                        <div v-if="mode === 'VIEW'">
                                            <div class="black">{{ getUser().Owner.Email }}</div>
                                        </div>
                                        <div v-else>
                                            <input type="text" :disabled="isSocialAccount" class="form-control black" v-model="$store.state.user.Owner.Email" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="ml0">Phone number</label>
                                <div v-if="mode === 'VIEW'">
                                    <div v-if="getUser().Owner.Phone" class="black">{{ getUser().Owner.Phone }}</div>
                                    <div v-else>--</div>
                                </div>
                                <div v-else>
                                    <vue-tel-input :only-countries="onlyCountries" default-country="gb" :disabled-fetching-country="true" v-model="$store.state.user.Owner.Phone" @input="checkPhoneValid" class="form-control"></vue-tel-input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="b-t mt32" v-if="!isSocialAccount">
                    <div class="t-l black mt24">Change Password</div>
                    <div class="row d-flex align-items-end">
                        <div class="col-md-4 mt16">
                            <div class="form-group">
                                <label class="ml0">Current Password</label>
                                <input type="password" class="form-control" v-model="currentPassword" placeholder="Enter current password" />
                            </div>
                        </div>
                        <div class="col-md-4 mt16">
                            <div class="form-group">
                                <label class="ml0">New Password</label>
                                <input type="password" class="form-control" v-model="newPassword" placeholder="Enter new password" />
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <button :disabled="isPasswordResettable" @click="changePassword" class="btn btn-secondary">Update Password</button>
                            </div>
                        </div>
                    </div>

                    <p class="mt16 mb16 t-s">Password must contain at least 8 characters with at least 1 capital letter, 1 small letter and 1 number</p>
                </div>
            </div>

            <div class="profile-payment shadow-sm border p24 rounded mt32">
                <div class="profile-cards">
                    <div class="d-flex justify-content-between">
                        <div class="t-xl black">Cards</div>
                        <div v-if="false">
                            <button @click="openNewCardModal" class="btn btn-primary-small">Add Card</button>
                        </div>
                    </div>
                    <div class="t-l brand-secondary">You need at least one card added to your account to keep your plans active.</div>
                    <div v-if="savedCards && savedCards.length > 0" class="row cards-details">
                        <div class="col-md-4 mt16" v-for="(card, key) in savedCards" :key="key">
                            <div class="saved-card border rounded p24 rounded">
                                <div class="d-flex justify-content-between">
                                    <img :src="getImageUrl(card.Card.Vendor)" alt />
                                    <i @click="deleteCard(card._id)" class="material-icons pointer error">not_interested</i>
                                </div>

                                <div class="mt24">
                                    <span class="t-s">CARD NUMBER</span>
                                </div>
                                <div class="row t-l black">
                                    <div class="col-sm-3 bold">****</div>
                                    <div class="col-sm-3 bold">****</div>
                                    <div class="col-sm-3 bold">****</div>
                                    <div class="col-sm-3 bold">{{ card.Card.LastFour }}</div>
                                </div>

                                <div class="d-flex justify-content-between mt16">
                                    <div>
                                        <div class="t-s">CARDHOLDER</div>
                                        <span class="t-m black">{{ card.Card.Name }}</span>
                                    </div>
                                    <div>
                                        <div class="t-s">EXPIRY</div>
                                        <span class="t-m black">{{ card.Card.ExpiryMonth }}/{{ card.Card.ExpiryYear }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ImageUpload v-if="uploadImageModal" @cancel="cancelModal" @close="hideProfileImageModal" :show="true" :config="config" :data="user"></ImageUpload>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { get, remove, put } from '@/services/ApiService';
import NewCardModal from '@/webapp/common/modals/NewCardModal';
import ImageUpload from '@/e9_components/components/ImageUpload';
import LoaderModal from '@/webapp/common/modals/LoaderModal';

export default {
    name: 'Profile',
    components: {
        NewCardModal,
        ImageUpload,
        LoaderModal
    },
    data() {
        return {
            savedCards: [],
            currentPassword: '',
            newPassword: '',
            showNewCard: false,
            isPhoneValid: true,
            mode: 'VIEW',
            config: {
                api: 'api/image?owner=' + this.getUser().Owner.Type + '&ownerid=' + this.getUser().Owner._id + '&attribute=ImageUrl',
                maxSize: 5,
                aspectRatio: 1
            },
            user: {
                name: 'profile_image'
            },
            tempUser: JSON.parse(JSON.stringify(this.$store.state.user)),
            uploadImageModal: false,
            isLoading: false,
            isSocialAccount: false,
            fetchCountry: true,
            onlyCountries: ['gb']
        };
    },
    methods: {
        checkPhoneValid(val, obj) {
            this.isPhoneValid = obj.isValid;
        },
        close(val) {
            this.showNewCard = false;
            this.isLoading = false;
            if (val) {
                this.getSavedCards();
            }
        },
        async getSavedCards() {
            try {
                this.isLoading = true;
                let result = await get('api/:clientid/cards?client=' + this.getUser().Owner._id);
                this.savedCards = result.data;
                this.isLoading = false;
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                this.isLoading = false;
                console.error(err);
            }
        },
        deleteCard(card) {
            this.$swal({
                title: 'Are you sure?',
                text: 'Your card will be deleted permanently',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm'
            }).then(async isConfirm => {
                if (isConfirm.value) {
                    try {
                        this.isLoading = true;
                        await remove('api/:clientid/card?cardid=' + card);
                        this.savedCards = this.savedCards.filter(c => {
                            return c._id != card;
                        });
                        this.$swal({
                            title: 'Deleted',
                            text: 'Your card has been deleted',
                            type: 'success'
                        });
                        this.isLoading = false;
                    } catch (err) {
                        this.$swal({
                            title: 'Card under use',
                            text: err && err.data && err.data.error && err.data.error.message ? err.data.error.message : 'Some error occurred',
                            type: 'error'
                        });
                        this.isLoading = false;
                        console.error(err);
                    }
                }
            });
        },
        getImageUrl(vendor) {
            return require('@/assets/images/cards/' + vendor.toUpperCase() + '.svg');
        },
        goToVideoUpload(id) {
            this.$router.push({
                name: 'BookingFlow',
                query: {
                    clientadplan: id
                }
            });
        },
        openNewCardModal() {
            this.showNewCard = true;
        },
        openEditMode() {
            let user = this.getUser();
            if (user.AuthorisationScheme !== 'Standard') {
                this.isSocialAccount = true;
            } else {
                this.isSocialAccount = false;
            }
            this.mode = 'EDIT';
        },
        closeEditMode() {
            this.$store.state.user = this.tempUser;
            this.mode = 'VIEW';
        },
        changePassword() {
            this.$swal({
                title: 'Are you sure?',
                text: 'Your password will be changed',
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Confirm'
            }).then(async isConfirm => {
                if (isConfirm.value) {
                    let user = this.getUser();

                    let requestObj = {
                        userId: user.UserId,
                        currentPassword: this.currentPassword,
                        newPassword: this.newPassword
                    };
                    this.isLoading = true;
                    try {
                        await put('api/:clientid/password', requestObj);
                        this.isLoading = false;
                        this.$swal({
                            title: 'Password Changed',
                            text: 'Your profile was successfully changed',
                            type: 'success'
                        });
                        this.currentPassword = this.newPassword = null;
                    } catch (err) {
                        this.isLoading = false;
                        this.$swal({
                            title: 'Error',
                            text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                            type: 'error'
                        });
                        console.error(err);
                        this.isLoading = false;
                    }
                }
            });
        },
        updateProfile() {
            this.$swal({
                title: 'Are you sure?',
                text: 'Your profile will be updated',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm'
            }).then(async isConfirm => {
                if (isConfirm.value) {
                    let user = this.getUser();
                    let requestObj = {
                        AuthorisationScheme: user.AuthorisationScheme,
                        UserId: user.UserId,
                        Title: user.Owner.Title,
                        Phone: user.Owner.Phone,
                        Email: user.Owner.Email,
                        CurrentPassword: this.currentPassword,
                        NewPassword: this.newPassword
                    };
                    this.isLoading = true;
                    try {
                        let result = await put('api/:clientid/profile', requestObj);

                        if (result.status === 200) {
                            user.Owner.Email = result.data.Email;
                            user.Owner.Phone = result.data.Phone;
                            user.Owner.Title = result.data.Name;
                            user.UserName = result.data.Email;
                            localStorage.setItem('user', JSON.stringify(user));
                            this.$store.state.user = JSON.parse(JSON.stringify(user));
                            this.mode = 'VIEW';
                            this.isLoading = false;
                            this.$swal({
                                title: 'Profile Updated',
                                text: 'Your profile was successfully updated',
                                type: 'success'
                            });
                        } else if (result.status === 205) {
                            this.isLoading = false;
                            this.$swal({
                                title: 'Profile Updated',
                                text: 'Your profile was successfully updated. Your email address has changed. Please verify your updated email address',
                                type: 'success'
                            }).then(async isConfirm => {
                                if (isConfirm.value) {
                                    this.logout();
                                }
                            });
                        }
                    } catch (err) {
                        this.isLoading = false;
                        this.$swal({
                            title: 'Error',
                            text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                            type: 'error'
                        });
                        console.error(err);
                    }
                }
            });
        },
        showProfileImageModal() {
            this.uploadImageModal = true;
        },
        hideProfileImageModal(event) {
            let user = this.getUser();
            user.Owner.ImageUrl = event.ImageUrl;
            localStorage.setItem('user', JSON.stringify(user));
            this.uploadImageModal = false;
        },
        cancelModal() {
            this.uploadImageModal = false;
        },
        logout() {
            this.$store.dispatch('logout');
            this.$router.push('/', () => {});
            this.showProfile = false;
        },

        ...mapGetters(['getUser'])
    },
    computed: {
        getProfileImageUrl() {
            return this.GOOGLE_BUCKET_ENDPOINT + this.getUser().Owner.ImageUrl;
        },
        isProceedable() {
            return !this.getUser().Owner.Title || !this.getUser().Owner.Email || (!this.isPhoneValid && this.getUser().Owner.Phone !== '');
        },
        isPasswordResettable() {
            let flag = true;
            if (this.currentPassword && this.newPassword) {
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(this.newPassword)) {
                    flag = true;
                } else {
                    flag = false;
                }
            }
            return flag;
        }
    },
    events: {
        close: () => {}
    },
    created() {
        this.getSavedCards();
    }
};
</script>

<style lang="scss" scoped>
.profile-cards {
    .cards-details {
        .saved-card {
            img {
                width: 32px;
            }
        }
    }
    .add-card {
        border: 1px solid $brand-primary;
        padding: 32px 24px;
    }
}
.profile-wrapper {
    .profile-details {
        .profile-image {
            width: 108px;
            height: 108px;
            border-radius: 50%;
            background-size: cover;
            background-repeat: no-repeat;
            margin-bottom: 24px;
            border: 2px solid $brand-primary;
        }

        .profile-text {
            width: 108px;
            height: 108px;
            padding: 0 30px;
            line-height: 104px;
            border: 1px solid $brand-primary;
            border-radius: 50%;
            font-size: 80px;
            color: $brand-primary;
            margin-bottom: 24px;
        }
    }

    @media (max-width: 767px) {
        background-color: transparent;
        margin: 0;
        padding: 0;
        box-shadow: none;

        .profile-info {
            .profile-details {
                padding: 16px 0;

                .profile-image {
                    margin-top: 16px;
                    margin-right: auto;
                    margin-left: auto;
                }
                .cancel,
                .save {
                    width: 100%;
                }
            }
        }
        .profile-cards {
            .cards-details {
                .cards-wrapper {
                    margin-top: 16px;
                    .saved-card {
                        span {
                            letter-spacing: 0px;
                        }
                    }
                }
            }
        }
    }
}
</style>

<style lang="scss">
.vti {
    &__dropdown {
        &:hover {
            background-color: transparent !important;
        }
    }
}
</style>
