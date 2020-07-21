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
                            <div class="float-right">
                                <p class="mb0">If you do not have a video ad</p>
                                <div class="float-right">
                                    <router-link tag="a" to="/#addons" class="t-l mt8 white"> Click Here</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <BookAd></BookAd>
                    <div>
                        <div class="d-flex d-md-none justify-content-center mt16">
                            <router-link tag="a" to="/#addons" class="white">Don't have an Ad?</router-link>
                            <!-- <span @click="scrollToAddon" class="white">Don't have an Ad?</span> -->
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
                            <div class="overview-item bg-white rounded col-6 col-md-4 d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/tv-location.svg" alt />
                                <div class="overview_text mt16 t-l">Local city TV stations across Britain</div>
                            </div>
                            <div class="overview-item bg-white rounded col-6 col-md-4 d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/newspaper-fold.svg" alt />
                                <div class="overview_text mt16 t-l">Larger audience than local news-papers</div>
                            </div>
                            <div class="overview-item bg-white rounded col-6 col-md-4 d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/modern-tv-remote.svg" alt />
                                <div class="overview_text mt16 t-l">Freeview 7, Sky 117 and Virgin Media 159</div>
                            </div>
                            <div class="overview-item bg-white rounded col-6 col-md-4 d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/tv-network.svg" alt />
                                <div class="overview_text mt16 t-l">TV is the most effective form of marketing</div>
                            </div>
                            <div class="overview-item bg-white rounded col-6 col-md-4 d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/video-player.svg" alt />
                                <div class="overview_text mt16 t-l">Use your own ad or we will produce it for you</div>
                            </div>
                            <div class="overview-item bg-white rounded col-6 col-md-4 d-flex flex-column justify-content-md-center align-items-center p64">
                                <img class="overview_icon" src="@/assets/images/on-air.svg" alt />
                                <div class="overview_text mt16 t-l">Register now and be on air within a week</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="how-it-works" class="how-it-works pm-24">
                <div class="container">
                    <h2 class="text-center brand-secondary section-heading">Four steps to your TV ad - Be on air in days</h2>
                    <br class="d-none d-md-block" />
                    <div class="row works-wrapper pb24 mt24 pt-md-1">
                        <div class="col-6 col-md-3 pl0 text-center" v-for="work in workflow" :key="work.Id">
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
                    <div class="row content">
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

            <section id="addons" class="pm-24">
                <div class="container">
                    <h2 class="text-center brand-secondary section-heading">Don't have an ad?</h2>
                    <div class="t-xl section-subtitle text-center brand-secondary">
                        <p>You can still get on Local TV using our add-ons</p>
                    </div>
                    <div class="addons-parent mt32">
                        <div class="row addons-wrapper mb24" v-if="addons && addons.length > 0">
                            <div class="col mb16" v-for="addon in addons" :key="addon._key">
                                <div class="addon">
                                    <div class="name">
                                        <h5>{{ addon.Name }}</h5>
                                        <p class="desc">{{ addon.Description }}</p>
                                    </div>
                                    <div class="price">
                                        <p class="lead brand-primary mb0">Now for just</p>
                                        <h4 class="amount">{{ addon.TotalAmount | currency }}</h4>
                                    </div>
                                    <div class="benefits">
                                        <ul class="mb8">
                                            <li v-for="benefit in addon.Benefits" :key="benefit">{{ benefit }}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="what-is-local-tv" class="what-is pm-24  pt-0">
                <div class="container">
                    <h2 class="text-center mb24 brand-secondary section-heading">What is Local Tv?</h2>
                    <div class="t-xl section-subtitle text-center brand-secondary">
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
                                    <div class="row channels">
                                        <div class="col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/tyne.png" alt />
                                        </div>
                                        <div class="col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/bristol.png" alt />
                                        </div>
                                        <div class="col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/teesside.png" alt />
                                        </div>
                                        <div class="col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/northwales.png" alt />
                                        </div>
                                    </div>
                                </div>
                            </slide>
                            <slide class="slide">
                                <div class="content">
                                    <div class="row channels">
                                        <div class="col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/liverpool.png" alt />
                                        </div>
                                        <div class="col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/leeds.png" alt />
                                        </div>

                                        <div class="col-md-6 channel text-center">
                                            <img class="mt16" src="@/assets/images/channel_logo/birmingham.png" alt />
                                        </div>
                                        <div class="col-md-6 channel text-center">
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
                    <p class="testimonial-text text-center t-xl">
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
                        Get notified about latest
                        <br />updates and offers
                    </h2>
                    <div class="form-group mt32 subscription-form d-none d-md-flex flex-column flex-md-row justify-content-center">
                        <div class="d-flex w-50">
                            <input v-model="subscriberEmail" type="email" class="form-control w-100" placeholder="Your Email" />
                            <button :disabled="!isSubscriberEmailValid" @click="subscribeUser" class="w-25 signup-btn t-s btn btn-primary rounded-0 rounded-right btn-full">Sign Up</button>
                        </div>
                    </div>
                    <div class="form-group mt32 subscription-form d-flex d-md-none flex-column justify-content-center">
                        <input v-model="subscriberEmail" type="email" class="form-control" placeholder="Your Email" />
                        <button :disabled="!isSubscriberEmailValid" @click="subscribeUser" class="mt16 t-s btn btn-primary btn-full">Sign Up</button>
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
import { get } from '@/services/ApiService';

export default {
    name: 'Home',
    components: {
        BookAd,
        ResetPassword,
        VideoModal
    },
    data() {
        return {
            addons: [],
            promourl: '@/assets/images/promo.mp4',
            displayAdVideo: false,
            showAddon: false,
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
            let result = await get('api/serviceaddons/all');
            this.addons = result.data;
            result = await get(`api/offers/all?startDate=${this.moment().format('YYYY-MM-DD')}&endDate=${this.moment().format('YYYY-MM-DD')}`);
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
