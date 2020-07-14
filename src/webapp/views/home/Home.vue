<template>
    <div>
        <div class="home">
            <div v-if="displayAdVideo">
                <VideoModal :show-video="displayAdVideo" video-url="https://storage.googleapis.com/localtvads-dev-bucket/uploads/Client/5ea02614ef5e234aab915ab9/ClientServiceAddOns/5eebcbee464b3f0f6db2eb81/1592511514742.mp4" @close="closeVideo"></VideoModal>
            </div>
            <section class="hero">
                <div class="heroslider">
                    <agile :options="herosliderOptions" :unagile="!showCarousel" v-if="heroslider">
                        <div class="slide" v-for="(hero, key) in heroslider" :key="key">
                            <div class="hero-wrapper pos-relative">
                                <div class="hero-image" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + hero.ImageUrl + ')', height: '100%', 'background-size': 'cover', 'background-position': 'top center' }"></div>
                                <div class="container">
                                    <div class="overlay-text container" v-html="hero.Name"></div>
                                </div>
                            </div>
                        </div>
                        <template slot="prevButton">
                            <i class="material-icons arrow">keyboard_arrow_left</i>
                        </template>
                        <template slot="nextButton">
                            <i class="material-icons arrow">keyboard_arrow_right</i>
                        </template>
                    </agile>
                </div>
            </section>

            <div class="container content-area" id="book-now">
                <div class="content p-md-4">
                    <div class="header mb16 row">
                        <div class="col-8">
                            <div>
                                <h3 class="section-title-2 text-white pos-relative">
                                    <img class="icon" src="@/assets/images/tv.svg" alt="tv" />
                                    <span class="pl48">Book your ad</span>
                                </h3>
                            </div>
                        </div>
                        <div class="col-4 d-none d-md-block">
                            <div class="d-flex justify-content-end align-items-end">
                                <router-link to="addons">
                                    <div class="t-l mt8 white">Don't have an Ad?</div>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <BookAd></BookAd>
                    <div>
                        <div class="d-flex d-md-none justify-content-center mt16">
                            <router-link to="addons">
                                <span class="white">Don't have an Ad?</span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <ResetPassword v-if="$route.name === 'ResetPassword'"></ResetPassword>

            <section id="overview" class="overview text-center pm-24">
                <div class="container">
                    <div class="justify-content-center">
                        <h2 class="brand-secondary section-heading">Overview</h2>
                    </div>
                    <div class="overview-content mt48">
                        <div class="row justify-content-center">
                            <div class="overview-item   bg-white rounded col-6 col-md-4  d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/tv-location.svg" alt />
                                <div class="overview_text mt16 t-l">
                                    Local city TV stations across Britain
                                </div>
                            </div>
                            <div class="overview-item  bg-white rounded col-6 col-md-4  d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/newspaper-fold.svg" alt />
                                <div class="overview_text mt16 t-l">
                                    Larger audience than local news-papers
                                </div>
                            </div>
                            <div class="overview-item  bg-white rounded col-6 col-md-4  d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/modern-tv-remote.svg" alt />
                                <div class="overview_text mt16 t-l">
                                    Freeview 7, Sky 117 and Virgin Media 159
                                </div>
                            </div>
                            <div class="overview-item  bg-white rounded col-6 col-md-4  d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/tv-network.svg" alt />
                                <div class="overview_text mt16 t-l">
                                    TV is the most effective form of marketing
                                </div>
                            </div>
                            <div class="overview-item  bg-white rounded col-6 col-md-4  d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/video-player.svg" alt />
                                <div class="overview_text mt16 t-l">
                                    Use your own ad or we will produce it for you
                                </div>
                            </div>
                            <div class="overview-item  bg-white rounded col-6 col-md-4  d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/on-air.svg" alt />
                                <div class="overview_text mt16 t-l">
                                    Register now and be on air within a week
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="how-it-works" class="how-it-works pm-24">
                <div class="container">
                    <h2 class="text-center brand-secondary section-heading ">Four steps to your TV ad - Be on air in days</h2>
                    <br class="d-none d-md-block" />
                    <div class="row works-wrapper  pb24 mt24 pt-md-1">
                        <div class="col-6 col-md-3 pl0 text-center " v-for="work in workflow" :key="work.Id">
                            <div class="work">
                                <div class="counter mb-2">
                                    <h6>{{ work.Id }}</h6>
                                </div>
                                <h4 class="section-subtitle mb-3">{{ work.Name }}</h4>
                                <p class="desc">{{ work.Desc }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="create-ad" class="create-ad lighter-grey-bg pm-24">
                <div class="container">
                    <h2 class="text-center mt-md-0 brand-secondary section-heading">Create your ad - choose location, length and frequency</h2>
                    <div class="row content ">
                        <div class="col-lg-6 home_illustration">
                            <div class="image"></div>
                        </div>
                        <div class="create-ad-content col-lg-6 d-flex flex-column justify-content-center">
                            <div class="create-ad-text pt32 p-lg-32">
                                <h4 class="brand-primary">TV is the most profitable and wide reaching form of advertising.</h4>
                                <p class="t-l mt16">LOCAL TV ADS is a pioneer of LOCAL business, and was formed to level the playing field to large corporations with bottomless advertising budgets – who previously were the only ones who could afford to create and broadcast a TV ad.</p>
                                <p class="t-l">If you have a video ad or video content just upload it and we will do the rest. If not, our producers will create an ad for you to approve and you can use it on your website, too. Flexible. Simple.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="what-is-local-tv" class="what-is pm-24">
                <div class="container">
                    <h2 class="text-center mb24 brand-secondary section-heading">What is Local Tv?</h2>
                    <div class="t-xl section-subtitle text-center brand-secondary ">
                        <p>We are UK's biggest and best LOCAL TV network. Operating 24/7/365 on:</p>
                    </div>
                    <div class="row mt64 channels channel-grid">
                        <div class="col-md-3 channel text-center">
                            <img src="@/assets/images/channel_logo/tyne.png" alt />
                        </div>
                        <div class="col-md-3 channel text-center">
                            <img src="@/assets/images/channel_logo/bristol.png" alt />
                        </div>
                        <div class="col-md-3 channel text-center">
                            <img src="@/assets/images/channel_logo/teesside.png" alt />
                        </div>

                        <div class="col-md-3 channel text-center">
                            <img src="@/assets/images/channel_logo/northwales.png" alt />
                        </div>
                    </div>
                    <div class="row mt64 channels channel-grid">
                        <div class="col-md-3 channel text-center">
                            <img src="@/assets/images/channel_logo/liverpool.png" alt />
                        </div>
                        <div class="col-md-3 channel text-center">
                            <img src="@/assets/images/channel_logo/leeds.png" alt />
                        </div>

                        <div class="col-md-3 channel text-center">
                            <img src="@/assets/images/channel_logo/birmingham.png" alt />
                        </div>
                        <div class="col-md-3 channel text-center">
                            <img src="@/assets/images/channel_logo/cardiff.png" alt />
                        </div>
                    </div>

                    <div class="channels-carousel">
                        <carousel class="channel-slider" :per-page="3" :autoplay="true" :autoplay-hover-pause="true" :loop="true" :speed="600" pagination-active-color="#ff6500" :pagination-size="16" :pagination-padding="5" :per-page-custom="[[300, 1], [769, 2], [1024, 1]]" :center-mode="true">
                            <slide class="slide">
                                <div class="content">
                                    <div class="row channels ">
                                        <div class=" col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/tyne.png" alt />
                                        </div>
                                        <div class=" col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/bristol.png" alt />
                                        </div>
                                        <div class=" col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/teesside.png" alt />
                                        </div>
                                        <div class="col-md-6 channel text-center ">
                                            <img class="mt16" src="@/assets/images/channel_logo/northwales.png" alt />
                                        </div>
                                    </div>
                                </div>
                            </slide>
                            <slide class="slide">
                                <div class="content">
                                    <div class="row  channels">
                                        <div class=" col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/liverpool.png" alt />
                                        </div>
                                        <div class=" col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/leeds.png" alt />
                                        </div>

                                        <div class=" col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/birmingham.png" alt />
                                        </div>
                                        <div class=" col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/cardiff.png" alt />
                                        </div>
                                    </div>
                                </div>
                            </slide>
                        </carousel>
                    </div>

                    <div class="about row">
                        <div class="col-lg-6 order-lg-2 about_illustration">
                            <div class="image"></div>
                        </div>
                        <div class="col-lg-6 order-lg-1 d-flex flex-column justify-content-center about_text">
                            <div class="about-text">
                                <p class="t-l">As an agent of LOCAL TV, we are the specialists in helping LOCAL businesses reach thousands of LOCAL customers. We make it possible for LOCAL businesses to have a consistent, professional presence on TV connecting you every month with your LOCAL market place via TV advertising.</p>
                                <p class="t-l">So if your business relies on attracting customers who are LOCAL to you, register with us today and bring your message to life in TV ad in just 4 simple steps.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section v-if="offers.length > 0" class="latest-offers bg--grey" id="offers">
                <div class="container">
                    <h3 class="section-title-2 text-center mb16">Latest Offers</h3>
                    <div class="underlined"></div>
                    <div class="offers-slider">
                        <carousel :per-page="3" :pagination-enabled="false" :navigation-enabled="true" :autoplay="true" :autoplay-hover-pause="true" :loop="true" :speed="600" :per-page-custom="[[300, 1], [768, 2], [1199, 3]]" :navigation-click-target-size="20" navigation-prev-label="<i class='material-icons'>keyboard_arrow_left</i>" navigation-next-label="<i class='material-icons'>keyboard_arrow_right</i>" :center-mode="true" :scroll-per-page="false">
                            <slide class="slide" v-for="(offer, key) in offers" :key="key">
                                <div class="offer">
                                    <div class="offer-image" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + offer.ImageUrl + ')' }"></div>
                                    <div class="offer-content">
                                        <h4 class="section-subtitle mb-3">{{ offer.Name }}</h4>
                                        <p class="text-clamp-2">{{ offer.Description }}</p>
                                    </div>
                                </div>
                            </slide>
                        </carousel>
                    </div>
                </div>
            </section>

            <section id="video" class="video">
                <div class="video-bg">
                    <div
                        @click="
                            () => {
                                displayAdVideo = true;
                            }
                        "
                        class="play-button"
                    >
                        <img src="@/assets/images/player_button.png" alt="play" />
                    </div>
                </div>
            </section>

            <section class="testimonial bg--grey" id="testimonials">
                <div class="container pm-24">
                    <h2 class="brand-secondary text-center section-heading mb16">Happy Customers, Happy Businesses</h2>
                    <br class="d-none d-md-block" />
                    <p class="testimonial-text text-center t-xl ">
                        Hear from our happy customers about how easy it is and how much you can gain by
                        <router-link tag="a" to="/#book-now">booking</router-link>&nbsp;your LocalTV Ad today.
                    </p>
                </div>
                <div class="container-fluid mt40">
                    <div class="testimonial-slider" v-if="testimonials">
                        <carousel :per-page="3" :autoplay="true" :autoplay-hover-pause="true" :loop="true" :speed="600" pagination-active-color="#ff6500" :pagination-size="16" :pagination-padding="5" :per-page-custom="[[300, 1], [768, 2], [1199, 3]]" :center-mode="true">
                            <slide v-for="t in testimonials" :key="t._id" class="slide">
                                <div class="content">
                                    <div class="profile-photo">
                                        <div class="profile-photo">
                                            <div class="background-image-holder image" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + t.ImageUrl + ')' }"></div>
                                        </div>
                                    </div>
                                    <h6 class="name">{{ t.Name }}</h6>
                                    <h6 class="company">{{ t.Company }}</h6>
                                    <p class="desc">{{ t.Description }}</p>
                                </div>
                            </slide>
                        </carousel>
                    </div>
                </div>
            </section>

            <section class="contact-us p-0" id="contact">
                <div class="row">
                    <div class="col-sm-6 p-0 contact-form-image">
                        <div class="info">
                            <img src="@/assets/images/info.png" alt />
                            <h1 class="text-center white">Contact Us</h1>
                            <p class="lead text-center">We'd love to hear from you. Simply fill out the form opposite and we'll get back to you within 24 hours.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 p-0 pm-24">
                        <div class="contact-form">
                            <div class="mb32 mob-only">
                                <h2 class="section-title-1">Contact Us</h2>
                                <p class="black">We'd love to hear from you. Fill the below form and we'll get back to you soon.</p>
                            </div>

                            <div class="form-group">
                                <input v-model="enquiryForm.Name" type="text" class="form-control" placeholder="Your Name" />
                            </div>
                            <div class="form-group">
                                <input v-model="enquiryForm.Email" type="email" class="form-control" placeholder="Your email address" />
                            </div>
                            <div class="form-group">
                                <input v-model="enquiryForm.Subject" type="text" class="form-control" placeholder="What can we help with?" />
                            </div>
                            <div class="form-group">
                                <textarea wrap="hard" v-model="enquiryForm.Message" name id cols="30" rows="4" class="form-control" placeholder="How can we help?"></textarea>
                            </div>
                            <button @click="submitEnquiry" :disabled="!isEnquiryFormValid" class="btn btn-primary btn-full mt16">Send</button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="subscription bg--grey pm-24">
                <div class="container">
                    <h2 class="brand-secondary section-heading text-center">
                        Get notified about latest <br />
                        updates and offers
                    </h2>
                    <div class="form-group mt32 subscription-form d-none d-md-flex flex-column flex-md-row justify-content-center">
                        <div class="d-flex w-50">
                            <input v-model="subscriberEmail" type="email" class="form-control w-100" placeholder="Your Email" />
                            <button :disabled="!isSubscriberEmailValid" @click="subscribeUser" class="w-25 signup-btn t-s btn btn-primary rounded-0 rounded-right btn-full">Sign Up</button>
                        </div>
                    </div>
                    <div class="form-group mt32 subscription-form d-flex d-md-none flex-column justify-content-center">
                        <input v-model="subscriberEmail" type="email" class="form-control " placeholder="Your Email" />
                        <button :disabled="!isSubscriberEmailValid" @click="subscribeUser" class="mt16 t-s  btn btn-primary btn-full">Sign Up</button>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import BookAd from '@/webapp/views/home/BookAd.vue';
import ResetPassword from '@/webapp/common/modals/ResetPassword.vue';
import instance from '@/api';
import VideoModal from '@/webapp/common/modals/VideoModal';

export default {
    name: 'Home',
    components: {
        BookAd,
        ResetPassword,
        VideoModal
    },
    data() {
        return {
            promourl: '@/assets/images/promo.mp4',
            displayAdVideo: false,
            testimonials: null,
            offersSliderOptions: {
                autoplay: true,
                infinite: true,
                autoplaySpeed: 5000,
                slidesToShow: 3,
                pauseOnHover: true,
                navButtons: true,
                dots: false,
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 300,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            },
            heroslider: null,
            showCarousel: false,
            herosliderOptions: {
                fade: true,
                autoplay: true,
                infinite: true,
                autoplaySpeed: 5000,
                slidesToShow: 1,
                dots: false,
                navButtons: false,
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: {
                            navButtons: true
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            navButtons: true
                        }
                    },
                    {
                        breakpoint: 300,
                        settings: {
                            navButtons: false
                        }
                    }
                ]
            },
            workflow: [
                {
                    Id: 1,
                    Name: 'Select Your Location',
                    Desc: 'Just as you’d book a flight, select where you want your ad to be aired!'
                },
                {
                    Id: 2,
                    Name: 'Choose Your Plan',
                    Desc: 'Select when and how many times you want your ad to be shown!'
                },
                {
                    Id: 3,
                    Name: 'Upload Your Ad',
                    Desc: 'If you have a video ad, great! If not, our producers will create one for you!'
                },
                {
                    Id: 4,
                    Name: 'Approval',
                    Desc: 'We’ll check everything is good to go, and within a week, your campaign will be live!'
                }
            ],
            currentWhyTvPage: 0,
            offers: [],
            subscriberEmail: '',
            enquiryForm: {},
            emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        };
    },
    methods: {
        switchDescription(e) {
            this.currentWhyTvPage = e;
        },
        closeVideo() {
            this.displayAdVideo = false;
        },
        async getSliders() {
            try {
                let result = await instance.get('api/sliders/all');
                this.heroslider = result.data;
                if (this.heroslider.length > 1) {
                    this.showCarousel = true;
                } else {
                    this.showCarousel = false;
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
        async subscribeUser() {
            try {
                await instance.post('api/contact/subscribe', { subscriberEmail: this.subscriberEmail });
                this.$swal({
                    title: 'Subscribed!',
                    text: 'You have subscribed successfully.',
                    type: 'success',
                    confirmButtonColor: '#ff6500'
                });
                this.subscriberEmail = null;
            } catch (err) {
                this.$swal({
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error',
                    confirmButtonColor: '#ff6500'
                });
                throw err;
            }
        },
        async submitEnquiry() {
            try {
                let requestObj = {
                    Name: this.enquiryForm.Name,
                    Email: this.enquiryForm.Email,
                    Subject: this.enquiryForm.Subject,
                    Message: this.enquiryForm.Message
                };
                await instance.post('/api/contact/enquiry', requestObj);
                this.$swal({
                    title: 'Successful',
                    text: 'Your message was received. Our team will get back to you shortly.',
                    type: 'success',
                    confirmButtonColor: '#ff6500'
                });
                this.enquiryForm.Name = this.enquiryForm.Email = this.enquiryForm.Subject = this.enquiryForm.Message = null;
            } catch (err) {
                this.$swal({
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error',
                    confirmButtonColor: '#ff6500'
                });
                throw err;
            }
        },
        async getTestimonials() {
            try {
                let result = await instance.get('/api/testimonials/all');
                this.testimonials = result.data;
            } catch (err) {
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
                console.error(err);
            }
        }
    },
    computed: {
        isSubscriberEmailValid() {
            let flag = true;
            if (!this.subscriberEmail || !this.emailRegex.test(this.subscriberEmail)) {
                flag = false;
            }
            return flag;
        },
        isEnquiryFormValid() {
            let flag = true;
            if (!this.enquiryForm.Email || !this.enquiryForm.Name || !this.enquiryForm.Subject || !this.enquiryForm.Message || !this.emailRegex.test(this.enquiryForm.Email)) {
                flag = false;
            }
            return flag;
        }
    },
    async created() {
        if (this.$route.query && this.$route.query.emailconfirmed) {
            this.$store.commit('DIALOG_CHOSEN', 'login');
        }
        try {
            let result = await instance.get('api/offers/all?startdate=' + this.moment().format('YYYY-MM-DD'));
            this.offers = result.data;
        } catch (err) {
            this.$swal({
                title: 'Error',
                text: err.data && err.data.message ? err.data.message : 'Some error occurred',
                type: 'error'
            });
            console.error(err);
        }
        this.getSliders();
        this.getTestimonials();
        this.$store.commit('LOADER_TOGGLE', false);
    }
};
</script>

<style lang="scss" scoped>
.home {
    /* Common */

    section {
        padding-top: 64px;
        padding-bottom: 64px;

        @media (max-width: 767px) {
            padding-top: 48px;
            padding-bottom: 36px;
        }

        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            padding-top: 64px;
            padding-bottom: 48px;
        }
    }

    .section-heading {
        @media (max-width: 767px) {
            font-size: 20px;
        }

        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            font-size: 32px !important;
        }
    }

    .pm-24 {
        @media (max-width: 767px) {
            padding-right: 24px !important;
            padding-left: 24px !important;
        }
    }

    .page-header {
        background-size: cover;
        height: 600px;
        background-repeat: no-repeat;
        background-position: center center;
        position: relative;

        .tagline {
            position: relative;
            padding: 88px 120px;

            h1 {
                color: $white;
                font-weight: 600;
                margin-bottom: 24px;
                font-size: 40px;

                span {
                    color: $brand-primary;
                }
            }

            h3 {
                color: $white;
                font-weight: 400;
                font-size: 24px;
                line-height: normal;
            }
        }

        @media (max-width: 767px) {
            height: 50vh;

            .tagline {
                padding: 16px 0;

                h1 {
                    font-size: 32px;
                    line-height: 40px;
                }

                h3 {
                    font-size: 18px;
                    line-height: 28px;
                }
            }
        }

        /* iPhone 6, 6S, 7 and 8 Landscape */
        @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
            .tagline {
                h1 {
                    line-height: 30px;
                    margin-bottom: 8px !important;
                }
            }
        }

        /* iPhone 6+, 6S+, 7+ and 8+ Portrait */
        @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
            .tagline {
                h1 {
                    font-size: 30px;
                    margin-bottom: 8px !important;
                }
            }
        }

        /* iPhone 6+, 6S+, 7+ and 8+ Landscape */
        @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
            .tagline {
                padding: 10px 0 !important;

                h1 {
                    margin-bottom: 8px !important;
                }
            }
        }

        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
            .tagline {
                padding: 24px 0;
            }
        }

        /* iPad Portrait */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            .tagline {
                padding: 78px 24px;
            }
        }
    }

    .section-home {
        &.dark {
            background-image: url('../../../assets/images/pattern.svg');
        }

        .infographic {
            height: 400px;
            @media (max-width: 767px) {
                height: 240px;
            }
        }

        .slider-image {
            height: 200px;

            @media (max-width: 767px) {
                height: 120px;
            }
        }
    }

    .content-area {
        margin-top: -72px;
        position: relative;
        z-index: 0;
        padding: 0 24px;

        .content {
            border-radius: 6px;
            padding: 24px;
            padding-bottom: 32px !important ;
            background-image: url('../../../assets/images/pattern.svg');
            background-size: cover;
            background-position: center center;
            color: #fff;
            background-color: $brand-primary;
            box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.1) !important;

            @media (max-width: 767px) {
                padding: 24px !important;
            }

            .header {
                .icon {
                    position: absolute;
                    top: -2px;
                }

                @media (max-width: 767px) {
                    .icon {
                        height: 20px;
                    }

                    .section-title-2 {
                        .pl48 {
                            padding-left: 36px !important;
                        }
                        font-size: 16px !important;
                    }
                }
            }
        }

        @media only screen and (max-device-width: 480px), only screen and (min-device-width: 560px) and (max-device-width: 1136px) and (-webkit-min-device-pixel-ratio: 2) {
            margin-top: -15px;
        }

        /* iPhone 6, 6S, 7 and 8 Portrait */
        @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
            margin-top: -16px;
        }

        /* iPhone 6, 6S, 7 and 8 Landscape */
        @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
            margin-top: -10%;
        }

        /* iPhone 6+, 6S+, 7+ and 8+ Landscape */
        @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
            margin-top: -10% !important;
        }

        /* iPhone x Portrait */
        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
            margin-top: -12px !important;
        }

        /* iPhone x Landscape */
        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
            margin-top: -46px !important;
        }

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            margin-top: -64px;
            .content {
                padding: 24px 24px 0;
            }
        }

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            margin-top: -52px;
        }
    }
    .how-it-works {
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            padding-bottom: 0px;
        }
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            padding-bottom: 0px;
        }

        .section-heading {
            @media (max-width: 767px) {
                line-height: 1.5;
            }
        }

        .works-wrapper {
            @media (max-width: 767px) {
                margin: 32px 0 0 0 !important;
                padding-bottom: 0px !important;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                margin-top: -8px !important;
            }
            .work {
                padding: 16px 24px;
                border-top-left-radius: 10px;
                border-bottom-right-radius: 10px;
                min-height: 300px;
                cursor: pointer;
                margin: 8px 0;

                @media (max-width: 767px) {
                    margin-top: -8px;
                    padding: 2px;
                    min-height: 120px;
                    height: 240px;
                }

                @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                    padding: 8px;
                }

                .section-subtitle {
                    @media (max-width: 767px) {
                        font-size: 14px !important;
                    }
                }

                .desc {
                    @media (max-width: 767px) {
                        font-size: 13px !important;
                    }
                }

                .counter {
                    padding: 16px;
                    h6 {
                        background: $brand-primary;
                        color: $white;
                        margin: 0 auto;
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        padding: 16px;
                        box-shadow: 0 10px 10px 0 rgba(255, 101, 0, 0.46);

                        @media (max-width: 767px) {
                            font-size: 12px;
                            width: 24px;
                            height: 24px;
                            padding: 6px;
                        }
                    }
                }

                &:hover {
                    background: $brand-primary;
                    color: $white;

                    @media (max-width: 767px) {
                        background: $white;
                        color: $brand-secondary;

                        .counter {
                            h6 {
                                background: $brand-primary !important;
                                color: $white !important;
                                box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.12);
                            }
                        }
                        h4 {
                            color: $brand-secondary !important;
                        }
                    }

                    .counter {
                        h6 {
                            background: $white;
                            color: $brand-primary;
                            box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.12);
                        }
                    }

                    h4 {
                        color: $white;
                    }
                }
            }
        }
    }

    .create-ad {
        padding-bottom: 84px !important;
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            padding-top: 64px !important;
        }

        @media (max-width: 767px) {
            padding-bottom: 64px !important;
        }

        .content {
            margin-top: 64px;

            @media (max-width: 767px) {
                margin-top: 36px;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                margin-top: 48px !important;
            }
        }

        .home_illustration {
            .image {
                background-image: url('../../../assets/images/billboard.png');
                height: 360px;
                background-size: cover;
                background-position: center center;
                background-repeat: no-repeat;

                @media (max-width: 767px) {
                    height: 206px;
                }
            }
        }
        .create-ad-content {
            .create-ad-text {
                line-height: 1.5;

                @media (max-width: 767px) {
                    padding: 24px 0px !important;
                    padding-bottom: 0px !important;
                    h4 {
                        font-size: 16px;
                        margin-top: 16px;
                    }
                    p {
                        font-size: 14px;
                    }
                }
            }
        }
    }

    .hero {
        padding: 0;

        @media (max-width: 767px) {
            height: 100% !important;
            min-height: 0px;
        }

        .heroslider {
            background: #fff;
            height: 620px;

            @media screen and (max-width: 1440px) {
                height: 546px;
            }

            @media only screen and (max-device-width: 480px), only screen and (min-device-width: 560px) and (max-device-width: 1136px) and (-webkit-min-device-pixel-ratio: 2) {
                height: 124px;
            }

            /* iPhone 6, 6S, 7 and 8 Portrait */
            @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
                height: 154px;
            }

            /* iPhone 6, 6S, 7 and 8 Landscape */
            @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
                margin-top: -10%;
            }

            /* iPhone 6+, 6S+, 7+ and 8+ Landscape */
            @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
                height: 154px;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                height: 294px !important;
            }

            /* iPad Pro Landscape */
            @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                height: 468px !important;
            }

            /* 2688x1242px at 458ppi */
            @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
                height: 620px !important;
            }

            /* iPad Pro Portrait */
            @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                height: 394px !important;
            }

            /* iPad Pro Portrait */
            @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                height: 526px !important;
            }

            /* iPad Landscape */
            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) {
                height: 392px !important;
            }

            /* iPhone x Portrait */
            @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
                height: 144px !important;
            }

            /* iPhone x LandScape */
            @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
                height: 308px !important;
            }

            /* 2688x1242px at 458ppi */
            @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) {
                height: 291px !important;
                margin: 0px !important;
            }

            /* 2688x1242px at 458ppi */
            @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) {
                height: 160px !important;
                margin: 0px !important;
            }
            .agile {
                .slide {
                    .hero-wrapper {
                        height: 620px;

                        @media screen and (max-width: 1440px) {
                            height: 546px;
                        }

                        @media only screen and (max-device-width: 480px), only screen and (min-device-width: 560px) and (max-device-width: 1136px) and (-webkit-min-device-pixel-ratio: 2) {
                            height: 124px;
                        }

                        /* iPhone 6, 6S, 7 and 8 Portrait */
                        @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
                            height: 154px;
                        }

                        /* iPhone 6, 6S, 7 and 8 Landscape */
                        @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
                            margin-top: -10%;
                        }

                        /* iPhone 6+, 6S+, 7+ and 8+ Landscape */
                        @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
                            height: 154px;
                        }

                        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                            height: 294px !important;
                        }

                        /* iPad Pro Landscape */
                        @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                            height: 468px !important;
                        }

                        /* 2688x1242px at 458ppi */
                        @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
                            height: 620px !important;
                        }

                        /* iPad Pro Portrait */
                        @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                            height: 394px !important;
                        }

                        /* iPad Pro Portrait */
                        @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                            height: 526px !important;
                        }

                        /* iPad Landscape */
                        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) {
                            height: 392px !important;
                        }

                        /* iPhone x Portrait */
                        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
                            height: 144px !important;
                        }

                        /* iPhone x LandScape */
                        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
                            height: 308px !important;
                        }

                        /* 2688x1242px at 458ppi */
                        @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape) {
                            height: 291px !important;
                            margin: 0px !important;
                        }

                        /* 2688x1242px at 458ppi */
                        @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) {
                            height: 160px !important;
                            margin: 0px !important;
                        }
                    }
                }
            }
        }
    }

    .overview {
        padding-bottom: 0px !important;
        @media (max-width: 767px) {
            padding-bottom: 0px !important;
        }

        .overview-content {
            padding-top: 0px !important;
            @media (max-width: 767px) {
                margin-top: 16px !important;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                margin-top: 32px !important;
            }
        }
        .overview-item {
            padding-top: 16px !important;
            @media (max-width: 767px) {
                padding: 8px !important;
                margin-top: 16px;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                padding: 48px !important;
            }

            /* iPad Landscape */
            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 2) {
                padding: 48px !important;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 2) {
                padding: 16px !important;
            }

            .overview_icon {
                height: 100px;
                width: 100px;
                @media (max-width: 767px) {
                    height: 48px;
                    width: 48px;
                }

                @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                    height: 64px;
                    width: 64px;
                }
            }

            .overview_text {
                font-size: 18px;
                font-weight: bold;
                @media (max-width: 767px) {
                    font-size: 13px;
                }
            }
        }
    }

    .what-is {
        .section-subtitle {
            @media (max-width: 767px) {
                font-size: 13px;
            }
            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                font-size: 18px;
                margin-top: 24px;
            }
        }
        .channels {
            @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .channel {
                /* iPad Pro Portrait */
                @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                    margin: 16px 48px;
                }
                @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                    margin: 16px 48px;
                }
                img {
                    height: 30px;
                    border: 3px solid #c7c7c9;

                    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                        height: 24px;
                    }
                }
            }
        }

        .channel-grid {
            @media (max-width: 768px) {
                display: none !important;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                display: none !important;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                margin-top: 20px !important;
                .channel {
                    margin: 14px -6px;
                }
            }
            /* iPad Pro Portrait */
            @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                display: flex !important;
                padding: 0 32px;
                justify-content: center;
                align-items: center;

                .channel {
                    margin: 0;
                    width: auto;
                    justify-content: center;

                    img {
                        height: 26px;
                    }
                }
            }
        }

        .channel-slider {
            display: none !important;
            @media (max-width: 768px) {
                display: block !important;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                display: block !important;
                margin: 48px 0;
            }

            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                display: none !important;
            }

            @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                display: block !important;
            }
            /* iPad Pro Portrait */
            @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                display: none !important;
            }
        }

        .about {
            margin-top: 96px;
            .about_text p {
                padding-right: 32px;
                @media (max-width: 767px) {
                    margin-top: 32px;
                    font-size: 14px !important;
                }

                @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                    margin-top: 32px;
                    font-size: 16px !important;
                }

                /* iPhone x Landscape */
                @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
                    margin-top: 24px !important;
                }
            }

            /* iPad Portrait */
            @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
                margin-top: 48px !important;
            }

            .about_illustration {
                .image {
                    background-image: url('../../../assets/images/localtvadsfam.png');
                    height: 360px;
                    background-size: cover;
                    background-position: center center;
                    background-repeat: no-repeat;

                    @media (max-width: 767px) {
                        height: 206px;
                    }

                    /* iPad Portrait */
                    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                        height: 480px;
                    }

                    /* iPad Pro Portrait */
                    @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                        height: 308px;
                    }
                }
            }
        }
    }

    .latest-offers {
        .offers-slider {
            position: relative;

            .slide {
                .offer {
                    background: $white;
                    width: 320px;
                    margin: 64px 24px 40px;

                    .offer-image {
                        position: relative;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                        height: 250px;
                        width: 100%;
                        background-size: cover;
                        background-repeat: no-repeat;
                    }

                    .offer-content {
                        padding: 24px 16px;
                        text-align: center;
                        height: 140px;

                        p {
                            font-size: 16px;
                            color: #4a4a4a;
                        }
                    }

                    small {
                        position: absolute;
                        bottom: 8px;
                        right: 8px;
                    }
                }
            }
        }

        @media (max-width: 767px) {
            .offers-slider {
                .slide {
                    .offer {
                        width: 100%;
                        margin: 0;
                    }
                }
            }
        }

        /* iPhone 6, 6S, 7 and 8 Landscape */
        @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
        }

        /* iPhone 6+, 6S+, 7+ and 8+ Landscape */
        @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
        }

        /* iPhone x Landscape */
        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
        }

        /* iPad Portrait */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            .offers-slider {
                .slide {
                    .offer {
                        width: 300px;
                        margin: 0 15px;
                    }
                }
            }
        }

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            .offers-slider {
                .slide {
                    .offer {
                        width: 420px;
                        .offer-image {
                            height: 320px;
                        }
                    }
                }
            }
        }

        /* iPad Pro Portrait */
        @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            .offers-slider {
                .slide {
                    .offer {
                        width: 420px;
                        .offer-image {
                            height: 320px;
                        }
                    }
                }
            }
        }
    }

    .video {
        padding: 0 !important;
        .video-bg {
            height: 480px;
            width: 100%;
            background-image: url('../../../assets/images/video-bg.jpg');
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;

            @media (max-width: 767px) {
                height: 240px;
            }
        }

        .play-button {
            color: $brand-primary;
            opacity: 0.8;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            max-width: 50%;
            background-color: #fff;
            border-radius: 50%;
            padding: 24px 21px;
            width: 120px;
            height: 120px;
            margin: 0 auto;
            border: 8px solid rgba(0, 0, 0, 0.2);

            img {
                width: 64px;
                height: 64px;
            }
        }

        @media (max-width: 767px) {
            min-height: 150px;

            .video-bg {
                background-position-x: 50%;
            }

            .play-button {
                width: 60px;
                height: 60px;
                padding: 9px 14px;

                img {
                    width: 20px;
                    height: 20px;
                }
            }
        }

        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
            min-height: 350px;

            .video-bg {
                background-position-x: 55%;
            }
        }

        /* iPad Portrait */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            min-height: 350px;

            .video-bg {
                background-position-x: 55%;
            }
        }

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            min-height: 350px;

            .video-bg {
                background-position-x: 55%;
            }
        }
    }

    .testimonial {
        p {
            line-height: 32px;
        }

        .testimonial-text {
            @media (max-width: 767px) {
                font-size: 14px;
            }
        }

        .testimonial-slider {
            padding: 0 40px;
            position: relative;

            .slide {
                .content {
                    margin: 80px 24px 40px;
                    background: $white;
                    text-align: center;
                    padding: 80px 48px 24px;
                    border-radius: 18px;
                    position: relative;
                    min-height: 340px;

                    /* iPad Portrait */
                    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
                        min-height: 240px;
                        height: 460px;
                    }

                    cursor: pointer;
                    .profile-photo {
                        position: relative;
                        top: -24px;

                        .background-image-holder {
                            width: 110px;
                            height: 110px;
                            left: 50%;
                            transform: translateX(-50%);
                            top: -88px;
                            border-radius: 50%;
                            box-shadow: 0 2px 24px 0 rgba(161, 161, 161, 0.5);
                        }
                    }

                    .name {
                        font-size: 18px;
                        font-weight: 500;
                        color: #212121;
                    }

                    .company {
                        font-size: 18px;
                        font-weight: normal;
                        color: #212121;
                    }

                    .desc {
                        margin-top: 24px;
                        position: relative;
                    }
                }
            }

            @media (max-width: 767px) {
                padding: 0;

                .slide {
                    .content {
                        padding: 72px 16px 32px;
                    }
                }
            }
        }
    }

    .contact-us {
        .info {
            background-color: $brand-primary;
            background-image: url('../../../assets/images/pattern.svg');
            height: 100%;
            background-size: 170% 80%;
            background-position: 51% 0%;
            padding: 80px 96px;

            img {
                display: block;
                margin: 0 auto;
                width: 290px;
                opacity: 0.89;
                margin-bottom: 40px;
            }

            h1 {
                font-weight: 500;
                margin-bottom: 24px;
                font-size: 40px;
            }

            p {
                line-height: 32px;
                color: $white;
            }
        }

        .contact-form-image {
            @media (max-width: 767px) {
                display: none;
            }
        }

        .contact-form {
            padding: 80px 104px;

            label {
                color: #2c3241;
            }
        }

        @media (max-width: 767px) {
            .info {
                padding: 40px;

                img {
                    width: 200px;
                }
            }

            .contact-form {
                padding: 40px 30px;
            }
        }

        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
            .info {
                padding: 40px;

                img {
                    width: 200px;
                }
            }

            .contact-form {
                padding: 40px 30px;
            }
        }

        /* iPad Portrait */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            .info {
                padding: 40px;

                img {
                    width: 200px;
                }
            }

            .contact-form {
                padding: 48px 48px 48px 28px;
            }
        }

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            .info {
                padding: 60px 40px;

                img {
                    width: 200px;
                }
            }

            .contact-form {
                padding: 48px 48px 48px 28px;
            }
        }
    }

    .subscription {
        p {
            line-height: 32px;
        }

        .signup-btn {
            border-top-right-radius: 8px !important;
            border-bottom-right-radius: 8px !important;
        }

        .subscription-form {
            input {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                background-image: url('../../../assets/images/mail.svg');
                background-repeat: no-repeat;
                background-position: 16px 14px;
                padding-left: 52px;

                @media (max-width: 767px) {
                    background-position: 16px 10px !important;
                }
            }
        }
    }
}
</style>

<style lang="scss">
.datepicker {
    padding: 12px 11px !important;
}
.flatpickr-input {
    font-size: 14px !important;
    background-color: #fff !important;
}

.VueCarousel-pagination {
    margin-top: 24x;
    margin-bottom: -56px;
}

.testimonial-slider {
    .VueCarousel-pagination {
        margin-top: -35px;
        margin-bottom: -6px;
    }
}
</style>
