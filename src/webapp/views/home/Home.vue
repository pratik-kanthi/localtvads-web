<template>
    <div>
        <div class="home">
            <section class="hero">
                <div class="heroslider">
                    <agile :options="herosliderOptions" :unagile="!showCarousel" v-if="heroslider">
                        <div class="slide" v-for="(hero, key) in heroslider" :key="key">
                            <div class="hero-wrapper pos-relative">
                                <div class="hero-image" :style="{ 'background-image': 'url(' + GOOGLE_BUCKET_ENDPOINT + hero.ImageUrl + ')', height: '100%', 'background-size': 'cover', 'background-position': 'center center' }"></div>
                                <div class="overlay"></div>
                                <div class="container">
                                    <div class="overlay-text container" v-html="hero.Name"></div>
                                </div>
                            </div>
                        </div>
                        <template slot="prevButton"
                        ><i class="material-icons arrow">keyboard_arrow_left</i></template
                        >
                        <template slot="nextButton"
                        ><i class="material-icons arrow">keyboard_arrow_right</i></template
                        >
                    </agile>
                </div>
            </section>
            <div class="container content-area" id="book-now">
                <div class="content">
                    <div class="header mb16 row">
                        <div class="col-md-6">
                            <h3 class="section-title-2 text-white pos-relative">
                                <img class="icon" src="@/assets/images/tv.svg" alt="tv" />
                                <span class="pl48">Book your ad</span>
                            </h3>
                        </div>
                        <div class="col-md-6 d-none d-sm-block d-md-block d-lg-block">
                            <div class="d-flex flex-row justify-content-end align-items-center">
                                <span class="mr16">Don't have an Ad?</span>
                                <router-link to="addons">
                                    <button class="btn btn-white btn-sm">Create your ad</button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <BookAd></BookAd>
                    <div class="d-flex justify-content-between d-block d-sm-none d-md-none d-lg-none">
                        <div class="mb8">Don't have an Ad?</div>
                        <router-link to="addons">
                            <button class="btn btn-white btn-sm">Create your ad</button>
                        </router-link>
                    </div>
                </div>
            </div>
            <ResetPassword v-if="$route.name === 'ResetPassword'"></ResetPassword>

            <section id="about-us" class="section-home pb16">
                <div class="container">
                    <h3 class="section-title-2 text-center mb16">About Local Tv Ads</h3>
                    <div class="underlined"></div>
                    <div class="d-flex mt32 flex-column flex-md-row justify-content-center">
                        <div class="t-l p24">
                            <p>LocalTV Ads evolved to make TV advertising easy. We provide the most technologically advanced and efficient ad booking system. Our efforts make it simple and cost effective to both create a new ad and to schedule it for airing in multiple locations. Or you can re-use your existing ad. Flexible. Simple.</p>
                            <p class="brand-primary">Launched during the 2020 Covid-19 lockdown period our aim is enable every business, from the smallest sole trader to multinational corporates, the same seamless access to get their message out to customers.</p>
                            <p>Advertising on TV has never been so easy.</p>
                        </div>
                        <div class="p24 d-flex align-items-center justify-content-center">
                            <img height="150px" src="@/assets/images/new_logo_dark.png" alt="" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="why-tv" class="section-home">
                <div class="container">
                    <h3 class="section-title-2 text-center mb16">Why Advertise on TV?</h3>
                    <div class="underlined"></div>
                    <div class="d-flex mt32 flex-md-row flex-column justify-content-between">
                        <div class="w-md-50">
                            <carousel @page-change="switchDescription" :per-page="1" :mouse-drag="false">
                                <slide>
                                    <img class="slider-image" src="@/assets/images/whytv-1.png" alt="" />
                                </slide>
                                <slide>
                                    <img class="slider-image" src="@/assets/images/whytv-2.png" alt="" />
                                </slide>
                            </carousel>
                        </div>
                        <div class="t-l p24">
                            <div v-if="currentWhyTvPage == 0">
                                <p class="t-xl black">Target an enormous audience</p>
                                <p>TV is the most profitable form of advertising. It gives you the widest reach with the least cost</p>
                            </div>
                            <div v-else>
                                <p class="t-xl black">TV is the most profitable form of advertising</p>
                                <p>TV delivers the greatest profit generated by any other form of advertising, with the greatest efficiency and for the least risk. TV advertising is a safe business investment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="why-ltv" class="section-home dark brand-primary-bg">
                <div class="container">
                    <h3 class="section-title-2 text-center white mb16">Why use Local TV</h3>
                    <div class="underlined-white"></div>
                    <div class="d-flex flex-column flex-md-row align-items-center justify-content-between mt32">
                        <div class="white t-l p24">
                            With amazing reach to customers in both domestic and commercial settings, LocalTV Ads can bring your products and services to a whole new audience.
                            <br />
                            <br />
                            Simple. Easy. Cost effective.
                        </div>
                        <div class="p24">
                            <img class="infographic" src="@/assets/images/coverage.png" alt="" />
                            <div class="white mt24">
                                <p>
                                    Our tv network coverage reaches 15% of England and Wales. <br />
                                    Nearly 9.5mn people and 800k businesses within the 6 licence areas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" class="how-it-works">
                <div class="container">
                    <h3 class="section-title-2 text-center mb16">How it works</h3>
                    <div class="underlined"></div>
                    <br />
                    <h4 class="section-title-2 text-center mb16">Follow our simple 4 step process</h4>
                    <div class="row works-wrapper mt48">
                        <div class="col-md-6 col-lg-3 text-center" v-for="work in workflow" :key="work.Id">
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

            <section class="testimonial bg--grey" id="about">
                <div class="container">
                    <h2 class="section-title-1 text-center mb16">Testimonials</h2>
                    <div class="underlined"></div>
                    <br />
                    <p class="text-center">Hear from our happy customers about how easy it is and how much you can gain by <router-link tag="a" to="/#book-now">booking</router-link> your LocalTV Ad today.</p>
                </div>
                <div class="container-fluid mt40">
                    <div class="testimonial-slider" v-if="testimonials">
                        <carousel :per-page="3" :autoplay="true" :autoplay-hover-pause="true" :loop="true" :speed="600" pagination-active-color="#ff6500" :pagination-size="16" :pagination-padding="5" :per-page-custom="[[300, 1], [769, 2], [1199, 3]]" :center-mode="true">
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
                            <img src="@/assets/images/info.png" alt="" />
                            <h1 class="text-center white">Contact Us</h1>
                            <p class="lead text-center">We'd love to hear from you. Simply fill out the form opposite and we'll get back to you within 24 hours.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 p-0">
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
                                <textarea wrap="hard" v-model="enquiryForm.Message" name="" id="" cols="30" rows="4" class="form-control" placeholder="How can we help?"></textarea>
                            </div>
                            <button @click="submitEnquiry" :disabled="!isEnquiryFormValid" class="btn btn-primary btn-full mt16">Send</button>
                        </div>
                    </div>
                </div>
            </section>
            <section class="subscription bg--grey">
                <div class="container">
                    <h2 class="section-title-1 text-center">Subscribe to exclusive email offers</h2>
                    <div class="t-l text-center mb24">And stay in touch with our monthly newsletter</div>
                    <div class="form-group subscription-form d-flex justify-content-center ">
                        <div class="d-flex">
                            <input v-model="subscriberEmail" type="email" class="form-control" placeholder="Your Email" />
                        </div>
                        <div>
                            <button :disabled="!isSubscriberEmailValid" @click="subscribeUser" class="btn btn-primary">Sign Up</button>
                        </div>
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

export default {
    name: 'Home',
    components: {
        BookAd,
        ResetPassword
    },
    data() {
        return {
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
                    Desc: 'Choose your target areas to run your ad'
                },
                {
                    Id: 2,
                    Name: 'Choose Your Plan',
                    Desc: 'Select when and how many times you want your ad aired'
                },
                {
                    Id: 3,
                    Name: 'Upload Your Ad',
                    Desc: 'If you have already got an ad, great, if not we are here to help create your content'
                },
                {
                    Id: 4,
                    Name: 'Approval',
                    Desc: 'Once your ad is ready to air we will send it to you for final approval'
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
        margin-top: -104px;
        position: relative;
        z-index: 0;

        .content {
            border-radius: 6px;
            padding: 24px 40px 40px;
            background-image: url('../../../assets/images/pattern.svg');
            background-size: cover;
            background-position: center center;
            color: #fff;
            background-color: $brand-primary;

            .header {
                .icon {
                    position: absolute;
                    top: -9px;
                }

                @media (max-width: 767px) {
                    .icon {
                        height: 24px;
                    }

                    .section-title-2 {
                        .pl48 {
                            padding-left: 32px !important;
                        }
                        font-size: 14px !important;
                    }
                }
            }
        }

        @media (max-width: 767px) {
            .content {
                margin-top: -1px;
                padding: 24px;
            }
        }

        /* iPhone 6, 6S, 7 and 8 Portrait */
        @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
            margin-top: -25%;
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
            margin-top: -10%;
        }

        /* iPhone x Landscape */
        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
            margin-top: -25%;
        }

        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            .content {
                padding: 24px 24px 0;
            }
        }
    }
    .how-it-works {
        .works-wrapper {
            .work {
                padding: 16px 24px;
                border-top-left-radius: 10px;
                border-bottom-right-radius: 10px;
                cursor: pointer;

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
                    }
                }

                &:hover {
                    background: $brand-primary;
                    color: $white;

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

    .hero {
        padding: 0;
        min-height: 550px;
        background-color: #333;

        @media (max-width: 767px) {
            height: 100% !important;
            min-height: 0px;
        }

        .heroslider {
            .agile {
                .slide {
                    .hero-wrapper {
                        /*height: 70vh;*/
                        height: 550px;

                        /* iPhone x Portrait */
                        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
                            height: 200px;
                        }
                    }

                    .overlay {
                        height: 100%;
                        width: 100%;
                        background: rgba(0, 0, 0, 0.6);
                        position: absolute;
                        top: 0;
                    }

                    .overlay-text {
                        position: absolute;
                        font-size: 24px;
                        color: $white;
                        max-width: 100%;
                        top: 50%;
                        -ms-transform: translateY(-50%);
                        transform: translateY(-50%);

                        /deep/.main {
                            color: $brand-primary !important;
                            font-size: 32px !important;
                        }

                        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
                            /deep/.main {
                                font-size: 18px !important;
                            }
                            font-size: 14px;
                            padding-bottom: 24px;
                        }
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
        width: 100%;
        min-height: 480px;
        position: relative;

        .video-bg {
            background-image: url('../../../assets/images/video-bg.jpg');
            background-position-x: 120%;
        }

        .play-button {
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            max-width: 50%;
            background-color: #fff;
            border-radius: 50%;
            padding: 36px 40px;
            width: 120px;
            height: 120px;
            margin: 0 auto;
            border: 8px solid rgba(0, 0, 0, 0.2);

            img {
                width: 30px;
                height: 30px;
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
                    min-height: 440px;
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

                        &:before {
                            content: '“';
                            position: absolute;
                            top: -24px;
                            left: -24px;
                            color: $brand-primary;
                            font-size: 50px;
                            font-weight: 500;
                            letter-spacing: -3.7px;
                            -webkit-transform: scaleY(-1);
                            transform: scaleY(-1);

                            @media (max-width: 767px) {
                                top: -30px;
                                left: -16px;
                            }
                        }
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
                padding: 32px 40px 32px 28px;
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
                padding: 32px 40px 32px 28px;
            }
        }
    }

    .subscription {
        p {
            line-height: 32px;
        }

        .subscription-form {
            .mail-icon {
                margin-right: -32px;
                z-index: 999;
            }
        }
    }
}
</style>
