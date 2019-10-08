<template>
    <section class="bg--grey pt56">
        <div v-if="showNewCard">
            <NewCardModal :show-new-card="showNewCard" @close="close"></NewCardModal>
        </div>
        <div class="container">
            <div class="profile-wrapper ml40 mr40">
                <h3 class="section-title-2 brand-secondary medium mb40">My Account</h3>
                <div class="profile-info mb32">
                    <h4 class="section-subtitle b-b pb16">My Info</h4>
                    <div class="row profile-details">
                        <div class="col-sm-4">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi voluptatibus ab quod ex fugiat dicta delectus. Sunt pariatur culpa quam adipisci velit cupiditate eos quas. Officiis error dolor labore quasi?</div>
                        <div class="col-sm-8">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div v-if="$store.state.user.Owner && $store.state.user.Owner.ImageUrl" class="profile-image" :style="{'background-image': 'url(' + getProfileImageUrl + ')'}"></div>
                                    <div v-if="$store.state.user.Owner && !$store.state.user.Owner.ImageUrl" class="profile-text">{{$store.state.user.Owner.Title[0]}}</div>
                                </div>
                                <div class="col-sm-6 content-column-center">
                                    <p class="text-right"><a class="btn btn-link alert mb0">Change profile picture</a></p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group mb16">
                                        <label class="ml0">Account Email</label>
                                        <input type="text" class="form-control" v-model="getUser().Owner.Email">
                                    </div>
                                    <div class="form-group mb16">
                                        <label class="ml0">Current Password</label>
                                        <input type="password" class="form-control" v-model="currentPassword" placeholder="Enter current password">
                                    </div>
                                    <div class="form-group mb16">
                                        <label class="ml0">New Password</label>
                                        <input type="password" class="form-control" v-model="newPassword" placeholder="Enter new password">
                                    </div>
                                    <div class="form-group">
                                        <label class="ml0">Phone number</label>
                                        <input type="text" class="form-control" v-model="getUser().Owner.Phone">
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <p class="text-right"><a class="btn btn-link alert mb0">Edit profile details</a></p>
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
                                    <div class="col-sm-8">
                                        <div class="saved-card">
                                            <input type="radio" class="mr16" v-model="preferredCard" :value="card._id" @click="setPreferredCard(preferredCard)">
                                            <img :src="getImageUrl(card.Card.Vendor)" alt />
                                            <span>xxxx xxxx xxxx {{card.Card.LastFour}}</span>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
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
                <div class="profile-ads">
                    <h4 class="section-subtitle b-b pb16 mb24">My Ads</h4>
                    <div class="row ads-wrapper" v-for="ad in clientAds" :key="ad._id">
                        <div class="col-sm-6">
                            <div class="ad-video">
                                <div class="background-image-holder ad-bg">
                                    <div class="action">
                                        <a v-if="ad.ClientAd && ad.ClientAd.VideoUrl" :href="getVideoUrl(ad.ClientAd.VideoUrl)" target="_blank"><img src="@/assets/images/play.png" alt="" class="play"></a>
                                        <button v-else class="btn btn-white" @click="goToVideoUpload(ad._id)">Upload Your Ad</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <!-- <div class="row mb16">
                                <div class="col-sm-6"><h4 class="section-subtitle lh40">Booking ID #123456</h4></div>
                                <div class="col-sm-6"><button class="btn btn-primary btn-sm pull-right">Renew Plan</button></div>
                            </div> -->
                            <div class="plan-details">
                                <div class="plan-info">
                                    <p class="info-label">Broadcast Location</p>
                                    <h6 class="info-desc">{{ad.ChannelPlan.Plan.Channel.Name}}</h6>
                                </div>
                                <div class="plan-info">
                                    <p class="info-label">Broadcast Slot</p>
                                    <h6 class="info-desc">{{ad.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.Name}} ({{ad.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.StartTime}} to {{ad.ChannelPlan.Plan.ChannelAdSchedule.AdSchedule.EndTime}})</h6>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="plan-info">
                                            <p class="info-label">Broadcast Start</p>
                                            <h6 class="info-desc">{{moment(ad.StartDate, 'YYYY-MM-DD').format('Do MMMM YYYY')}}</h6>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="plan-info">
                                            <p class="info-label">Broadcast End</p>
                                            <h6 class="info-desc">{{moment(ad.EndDate, 'YYYY-MM-DD').format('Do MMMM YYYY')}}</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="plan-info mb0">
                                            <p class="info-label">Ad Length</p>
                                            <h6 class="info-desc">{{ad.ChannelPlan.Plan.Seconds}} sec</h6>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="plan-info mb0">
                                            <p class="info-label">Broadcast Duration</p>
                                            <h6 class="info-desc">6 months</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from "vuex";
import instance from "@/api";
import NewCardModal from "@/webapp/common/modals/NewCardModal";
export default {
    name: "Profile",
    components: {
        NewCardModal
    },
    data() {
        return {
            savedCards: [],
            preferredCard: '',
            currentPassword: '',
            newPassword: '',
            showNewCard: false,
            clientAds: []
        }
    },
    methods: {
        close(val) {
            this.showNewCard = false;
            if(val) {
                this.getSavedCards();
            }
        },
        async getSavedCards() {
            try {
                let result = await instance.get("api/client/cards?client=" + this.getUser().Owner._id);
                this.savedCards = result.data;
                if(this.savedCards.length > 0) {
                    this.preferredCard = this.savedCards.find(card => card.IsPreferred)._id;
                }
            } catch (err) {
                this.$swal({
                    title: "Error",
                    text: err && err.data && err.data.message ? err.data.message : "Some error occurred",
                    type: "error"
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
                confirmButtonText: 'Confirm',
                closeOnConfirm: false
            }).then(async(isConfirm) => {
                if(isConfirm.value) {
                    try {
                        await instance.delete('api/client/deletecard?client=' + this.getUser().Owner._id + '&card=' + card);
                        this.$swal({
                            title: 'Deleted',
                            text: 'Your card has been deleted',
                            type: 'success',
                        });
                    } catch (err) {
                        this.$swal({
                            title: "Error",
                            text: err && err.data && err.data.message ? err.data.message : "Some error occurred",
                            type: "error"
                        });
                        console.error(err);
                    }
                }
            });
        },
        getImageUrl(vendor) {
            return require("@/assets/images/cards/" + vendor + ".svg");
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
                }).then(async(isConfirm)=> {
                    if (isConfirm.value) {
                        try {
                            await instance.post('api/client/preferredcard', {client: this.getUser().Owner._id, card: this.preferredCard})
                            this.$swal({
                                title: 'Updated',
                                text: 'Preferred card has been updated',
                                type: 'success'
                            });
                        } catch (err) {
                            this.$swal({
                                title: "Error",
                                text: err && err.data && err.data.message ? err.data.message : "Some error occurred",
                                type: "error"
                            });
                            console.error(err);
                        }
                    } else {
                        this.preferredCard = oldCard;
                    }
                });
        },
         openNewCardModal() {
            this.showNewCard = true;
        },
        ...mapGetters(["getUser"]),
        getVideoUrl(url) {
            return this.GOOGLE_BUCKET_ENDPOINT + url;
        }
    },
    computed: {
        getProfileImageUrl() {
            return this.GOOGLE_BUCKET_ENDPOINT + this.getUser().Owner.ImageUrl
        }
    },
    async created() {
        this.getSavedCards();
        try {
            let result = await instance.get('api/clientad/getall?clientid=' + this.getUser().Owner._id + '&top=5&skip=0');
            this.clientAds = result.data;
        } catch (err) {
            this.$swal({
                title: "Error",
                text: err && err.data && err.data.message ? err.data.message : "Some error occurred",
                type: "error"
            });
            console.error(err);
        }
    }
}
</script>

<style lang="scss" scoped>
    .profile-wrapper {
        background-color: $white;
        padding: 40px 64px;
        border-radius: 8px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
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
                        input[type="radio"] {
                            margin-left: 1px;
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
        .profile-ads {
            .ads-wrapper {
                margin-bottom: 24px;
                &:last-child {
                    margin-bottom: 0;
                }
                .ad-video {
                    width: 100%;
                    height: 240px;
                    position: relative;
                    .ad-bg {
                        background-image: url('../../../assets/images/ad-video-bg.jpg');
                    }
                    .action {
                        .play {
                            width: 56px;
                            display: block;
                            margin: 96px auto;
                        }
                        .btn {
                            max-width: 150px;
                            display: block;
                            margin: 96px auto;
                        }
                    }
                }
                .plan-details {
                    .plan-info {
                        margin-bottom: 20px;
                        .info-label {
                            margin-bottom: 4px;
                            font-size: 12px;
                            color: #acacac;
                            font-weight: 500;
                            font-family: $font-family-heading;
                        }
                        .info-desc {
                            font-size: 14px;
                            font-weight: 500;
                            font-style: normal;
                            font-stretch: normal;
                            line-height: normal;
                            letter-spacing: normal;
                            color: #4c4c4c;
                        }
                    }
                }
            }
        }
    }

</style>
