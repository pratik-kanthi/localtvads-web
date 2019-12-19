<template>
    <section class="bg--grey pt-xs16">
        <div v-if="showNewCard">
            <NewCardModal :show-new-card="showNewCard" @close="close"></NewCardModal>
        </div>
        <div class="container">
            <div class="profile-wrapper">
                <h3 class="section-title-2 brand-secondary medium mb40">My Account</h3>
                <div class="profile-info mb32">
                    <h4 class="section-subtitle b-b pb16">My Info</h4>
                    <div class="row profile-details">
                        <div class="col-lg-4 mb24">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi voluptatibus ab quod ex fugiat dicta delectus. Sunt pariatur culpa quam adipisci velit cupiditate eos quas. Officiis error dolor labore quasi?</div>
                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div v-if="$store.state.user.Owner && $store.state.user.Owner.ImageUrl" class="profile-image" :style="{'background-image': 'url(' + getProfileImageUrl + ')'}"></div>
                                    <div v-if="$store.state.user.Owner && !$store.state.user.Owner.ImageUrl" class="profile-text">{{ $store.state.user.Owner.Title[0] }}</div>
                                </div>
                                <div class="col-sm-6 content-column-center">
                                    <p class="text-right">
                                        <a @click="showProfileImageModal" class="alert mb0">Change profile picture</a>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group mb16">
                                        <label class="ml0">Name</label>
                                        <div v-if="mode==='VIEW'">
                                            <div class="bold">{{ getUser().Owner.Title }}</div>
                                        </div>
                                        <div v-else>
                                            <input type="text" class="form-control" v-model="$store.state.user.Owner.Title">
                                        </div>
                                    </div>

                                    <div class="form-group mb16">
                                        <label class="ml0">Account Email</label>
                                        <div v-if="mode==='VIEW'">
                                            <div class="bold">{{ getUser().Owner.Email }}</div>
                                        </div>
                                        <div v-else>
                                            <input type="text" :disabled="isSocialAccount" class="form-control" v-model="$store.state.user.Owner.Email">
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="ml0">Phone number</label>
                                        <div v-if="mode==='VIEW'">
                                            <div v-if="getUser().Owner.Phone" class="bold">{{ getUser().Owner.Phone }}</div>
                                            <div v-else>--</div>
                                        </div>
                                        <div v-else>
                                            <vue-tel-input disabled-fetching-country="true" v-model="$store.state.user.Owner.Phone" @input="checkPhoneValid" class="form-control"></vue-tel-input>
                                        </div>
                                    </div>

                                    <div v-if="mode==='EDIT' && !isSocialAccount">
                                        <div class="form-group mb16">
                                            <label class="ml0">Current Password</label>
                                            <input type="password" class="form-control" v-model="currentPassword" placeholder="Enter current password">
                                        </div>
                                        <div class="form-group mb16">
                                            <label class="ml0">New Password</label>
                                            <input type="password" class="form-control" v-model="newPassword" placeholder="Enter new password">
                                        </div>
                                        <p class="mt16 mb16 t-s">Password must contain at least 8 characters with at least 1 capital letter, 1 small letter and 1 number</p>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <p v-if="mode==='VIEW'" class="text-right">
                                        <a @click="openEditMode()" class="alert mb0">Edit Profile</a>
                                    </p>
                                    <div v-if="mode==='EDIT'" class="text-right mb16">
                                        <button class="btn btn-secondary cancel" @click="closeEditMode">Cancel</button>
                                    </div>
                                    <div v-if="mode==='EDIT'" class="text-right">
                                        <button class="btn btn-primary save" @click="updateProfile" :disabled="isProceedable">Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile-cards">
                    <h4 class="section-subtitle b-b pb16">My Cards</h4>
                    <div class="row cards-details">
                        <div class="col-sm-4">
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam repudiandae molestias maiores, est distinctio, harum nulla, enim tenetur quae mollitia iste.</p>
                            <button class="btn btn-primary btn-full" @click="openNewCardModal">Add New Card</button>
                        </div>
                        <div class="col-sm-8">
                            <div class="cards-wrapper" v-if="savedCards && savedCards.length > 0">
                                <div class="row" v-for="(card,key) in savedCards" :key="key">
                                    <div class="col-sm-9 col-9">
                                        <div class="saved-card" @click="setPreferredCard(preferredCard)">
                                            <div class="radio-btn-tick mr16">
                                                <input type="radio" v-model="preferredCard" :value="card._id">
                                                <label></label>
                                            </div>
                                            <img :src="getImageUrl(card.Card.Vendor)" alt />
                                            <span>xxxx xxxx xxxx {{ card.Card.LastFour }}</span>
                                        </div>
                                    </div>
                                    <div class="col-sm-3 col-3">
                                        <div class="actions float-right">
                                            <button class="btn btn-link error mb0" @click="deleteCard(card._id)" :disabled="card.IsPreferred">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p class="lead">No card added yet.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ImageUpload v-if="uploadImageModal" @cancel="cancelModal" @close="hideProfileImageModal" :show="true" :config="config" :data="user"></ImageUpload>
        <LoaderModal :showloader="isLoading" message="Please wait while we update your profile"></LoaderModal>
    </section>
</template>
<script>
import { mapGetters } from 'vuex';
import instance from '@/api';
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
            preferredCard: '',
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
            fetchCountry: true
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
                let result = await instance.get('api/client/cards?client=' + this.getUser().Owner._id);
                this.savedCards = result.data;
                if (this.savedCards.length > 0) {
                    this.preferredCard = this.savedCards.find(card => card.IsPreferred)._id;
                }
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
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
            }).then(async (isConfirm) => {
                if (isConfirm.value) {
                    try {
                        await instance.delete('api/client/deletecard?client=' + this.getUser().Owner._id + '&card=' + card);
                        this.savedCards = this.savedCards.filter((c) => {
                            return c._id != card;
                        });
                        this.$swal({
                            title: 'Deleted',
                            text: 'Your card has been deleted',
                            type: 'success',
                        });
                    } catch (err) {
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
        getImageUrl(vendor) {
            return require('@/assets/images/cards/' + vendor + '.svg');
        },
        goToVideoUpload(id) {
            this.$router.push({
                name: 'BookingFlow',
                query: {
                    clientadplan: id
                }
            });
        },
        setPreferredCard(oldCard) {
            this.$swal({
                title: 'Are you sure?',
                text: 'Your preferred card will be updated',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm'
            }).then(async (isConfirm) => {
                if (isConfirm.value) {
                    try {
                        this.isLoading = true;
                        await instance.post('api/client/preferredcard', { client: this.getUser().Owner._id, card: this.preferredCard });
                        this.$swal({
                            title: 'Updated',
                            text: 'Preferred card has been updated',
                            type: 'success'
                        });
                        this.isLoading = false;
                    } catch (err) {
                        this.$swal({
                            title: 'Error',
                            text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                            type: 'error'
                        });
                    }
                } else {
                    this.preferredCard = oldCard;
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
        updateProfile() {
            this.$swal({
                title: 'Are you sure?',
                text: 'Your profile will be updated',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
            }).then(async (isConfirm) => {
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
                        let result = await instance.put('api/client/profile', requestObj);

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
            this.$router.push('/', () => { });
            this.showProfile = false;
        },

        ...mapGetters(['getUser']),
    },
    computed: {
        getProfileImageUrl() {
            return this.GOOGLE_BUCKET_ENDPOINT + this.getUser().Owner.ImageUrl;
        },
        isProceedable() {
            let flag = true;
            if (this.currentPassword) {
                if (!this.newPassword) {
                    flag = false;
                } else {
                    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(this.newPassword))) {
                        flag = false;
                    }
                }
            }
            return !this.getUser().Owner.Title || !this.getUser().Owner.Email || (!this.isPhoneValid && this.getUser().Owner.Phone !== '') || !flag;
        }
    },
    events: {
        close: () => {

        }
    },
    created() {
        this.getSavedCards();
    }
};
</script>

<style lang="scss" scoped>
    .profile-wrapper {
        background-color: $white;
        padding: 40px 64px;
        border-radius: 8px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
        margin: 0 40px;

        .profile-info {
            .profile-details {
                padding: 24px 0;

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

                ul.edit-options {
                    @include list-unstyled();

                    li {
                        margin-bottom: 66px;
                        display: block;
                        text-align: right;
                        font-size: 16px;
                        color: $brand-primary;

                        &:first-child {
                            margin: 50px 0 88px;
                        }
                    }
                }
            }
        }

        .profile-cards {
            .cards-details {
                padding: 24px 0 40px;

                .cards-wrapper {
                    max-height: 158px;
                    overflow-y: auto;
                    overflow-x: hidden;

                    .saved-card {
                        cursor: pointer;

                        input[type='radio'] {
                            margin-left: 1px;
                        }

                        .radio-btn-tick {
                            top: 4px;
                        }

                        width: 100%;
                        padding: 8px 0;

                        span {
                            letter-spacing: 3px;
                        }

                        img {
                            width: 56px;
                            margin-right: 16px;
                        }
                    }
                }
            }
        }

        @media (max-width: 767px) {
            background-color: transparent;
            margin: 0;
            padding: 0;
            box-shadow: none;
            text-align: center;

            .profile-info {
                .profile-details {
                    padding: 16px 0;

                    .profile-image {
                        margin-top: 16px;
                        margin-right: auto;
                        margin-left: auto;
                    }

                    p {
                        text-align: center !important;
                    }
                    .cancel,.save {
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