<template>
    <section class="bg--grey pt56">
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
                                        <input type="text" class="form-control" v-model="getUser.Owner.Email">
                                    </div>
                                </div>
                                <div class="col-sm-6 content-column-center">
                                    <p class="text-right"><a class="btn btn-link alert mb0">Change account email</a></p>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group mb16">
                                        <label class="ml0">Password</label>
                                        <input type="password" class="form-control">
                                    </div>
                                </div>
                                <div class="col-sm-6 content-column-center">
                                    <p class="text-right"><a class="btn btn-link alert mb0">Change account email</a></p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label class="ml0">Phone number</label>
                                        <input type="text" class="form-control" v-model="getUser.Owner.Phone">
                                    </div>
                                </div>
                                <div class="col-sm-6 content-column-center">
                                    <p class="text-right"><a class="btn btn-link alert mb0">Change account email</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile-cards">
                    <h4 class="section-subtitle b-b pb16">My Cards</h4>
                    <div class="row cards-details">
                        <div class="col-sm-4">
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam repudiandae molestias maiores, est distinctio, harum nulla, enim tenetur quae mollitia iste cum corrupti quos.</p>
                            <button class="btn btn-primary btn-full">Add New Card</button>
                        </div>
                        <div class="col-sm-8">
                            <div class="cards-wrapper">
                                <div class="row" v-for="(card,key) in savedCards" :key="key">
                                    <div class="col-sm-8">
                                        <div class="saved-card">
                                            <input type="radio" class="mr16" :value="card._id">
                                            <img :src="getImageUrl(card.Card.Vendor)" alt />
                                            <span>xxxx xxxx xxxx {{card.Card.LastFour}}</span>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="actions float-right">
                                            <button class="btn btn-link alert mb0">Edit</button>
                                            <button class="btn btn-link error mb0">Delete</button>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile-ads">
                    <h4 class="section-subtitle b-b pb16">My Ads</h4>
                    <div class="row ads-wrapper">
                        <div class="col-sm-6">
                            <div class="ad-video-1">
                                <div class="background-image-holder ad-bg-1"></div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <h4 class="section-subtitle">Booking ID #123456 <button class="btn btn-primary btn-sm pull-right">Renew Plan</button></h4>
                        </div>
                    </div>
                    <div class="row ads-warapper">
                        <div class="col-sm-6">
                            <div class="ad-video-2">
                                <div class="background-image-holder ad-bg-2"></div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <h4 class="section-subtitle">Booking ID #123456 <button class="btn btn-primary btn-sm pull-right">Renew Plan</button></h4>
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
export default {
    name: "Profile",
    data() {
        return {
            savedCards: []
        }
    },
    methods: {
        getImageUrl(vendor) {
            return require("@/assets/images/cards/" + vendor + ".svg");
        },
    },
    computed: {
        ...mapGetters(["getUser"]),
        getProfileImageUrl() {
            return this.GOOGLE_BUCKET_ENDPOINT + this.$store.state.user.Owner.ImageUrl
        }
    },
    async created() {
        try {
            let result = await instance.get("api/client/cards?client=" + this.$store.state.user.Owner._id);
            this.savedCards = result.data;
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
                    border: 1px solid $brand-primary;
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
                            letter-spacing: 2px;
                        }
                        img {
                            width: 56px;
                            margin-right: 16px;
                        }
                    }
                    .actions {
                        .link {
                            
                        }
                    }
                }
                
            }
        }
        .profile-ads {
            .ads-wrapper {
                padding: 24px 0 40px;
                .ad-video-1 {
                    width: 100%;
                    height: 300px;
                    position: relative;
                    .ad-bg-1 {
                        background-image: url('../../../assets/images/home-cover.jpg');
                    }
                }
                .ad-video-2 {
                    width: 100%;
                    height: 300px;
                    position: relative;
                    .ad-bg-2 {
                        background-image: url('../../../assets/images/home-cover.jpg');
                    }
                }
            }
        }
    }

</style>
