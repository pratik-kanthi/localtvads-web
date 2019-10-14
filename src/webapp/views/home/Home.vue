<template>
    <div class="home">
        <div class="page-header" id="book-now">
            <div class="overlay-layer"></div>
            <div class="container">
                <div class="tagline">
                    <h1>
                        Grow Your Business
                        <span class="brand-primary">Faster</span>
                    </h1>
                    <h3>
                        Creating an ad for your business is easier than you think.
                        <br />Free ad slots for all new users.
                    </h3>
                </div>
            </div>
        </div>
        <div class="container content-area">
            <ul class="tabs">
                <li :class="{'active' : activeTab === 'bookad'}" @click="goToComponent('bookad')">Book Your Ad</li>
                <li :class="{'active' : activeTab === 'createad'}" @click="goToComponent('createad')">Create Your Ad</li>
            </ul>
            <div class="content">
                <BookAd v-if="activeTab === 'bookad'"></BookAd>
                <CreateAd v-if="activeTab === 'createad'"></CreateAd>
            </div>
        </div>
        <ResetPassword v-if="$route.name === 'ResetPassword'"></ResetPassword>
        <ForgotPassword v-if="$route.name ==='ForgotPassword'"></ForgotPassword>
        <section id="how-it-works" class="how-it-works">
            <div class="container">
                <h3 class="section-title-2 text-center mb16">How it works</h3>
                <div class="underlined"></div>
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
        <section class="latest-offers bg--grey" id="offers">
            <div class="container">
                <h3 class="section-title-2 text-center mb16">Latest Offers</h3>
                <div class="underlined"></div>
                <div class="offers mt48">
                    <div class="offer" v-for="offer in offers" :key="offer.Id">
                        <div class="offer-image" :style="{'background-image': 'url(' + offer.ImageUrl + ')'}"></div>
                        <div class="offer-content">
                            <h4 class="section-subtitle mb-3">{{ offer.Name }}</h4>
                            <p>{{ offer.Desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="video" id="about">
            <div class="background-image-holder video-bg">
                <div class="play-button"><img src="@/assets/images/play.svg" alt=""></div>
            </div>
        </section>
        <section class="testimonial bg--grey">
            <div class="container">
                <h2 class="section-title-1 text-center mb56">Happy Customers, Happy Businesses</h2>
                <p class="text-center">Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since. Corporate social responsibility policymaker inclusion, resist; compassion mass incarceration correlation white paper. Program area energize optimism radical shared value policymaker.</p>
            </div>
            <div class="contianer-fluid mt40">
                <div class="testimonial-slider">
                    <agile :options="sliderOptions">
                        <div class="slide" v-for="t in testimonials" :key="t.id">
                            <div class="content">
                                <div class="profile-photo">
                                    <div class="profile-photo">
                                        <div class="background-image-holder image" :style="{'background-image': 'url('+ require('../../../assets/images/testimonials/' + t.LogoUrl) + ')'}"></div>
                                    </div>
                                </div>
                                <h6 class="name">{{ t.Manager }}</h6>
                                <h6 class="company">{{ t.Company }}</h6>
                                <p class="desc">{{ t.Desc }}</p>
                            </div>
                        </div>
                    </agile>
                </div>
            </div>
        </section>
        <section class="contact-us p-0" id="contact">
            <div class="row">
                <div class="col-sm-6 p-0">
                    <div class="info">
                        <img src="@/assets/images/info.png" alt="">
                        <h1 class="text-center white">Contact Us</h1>
                        <p class="lead text-center">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                </div>
                <div class="col-sm-6 p-0">
                    <div class="contact-form">
                        <div class="form-group">
                            <label for="" class="ml0">Name</label>
                            <input v-model="enquiryForm.Name" type="text" class="form-control" placeholder="Your Name">
                        </div>
                        <div class="form-group">
                            <label for="" class="ml0">Email ID</label>
                            <input v-model="enquiryForm.Email" type="email" class="form-control" placeholder="Your email address">
                        </div>
                        <div class="form-group">
                            <label for="" class="ml0">Subject</label>
                            <input v-model="enquiryForm.Subject" type="text" class="form-control" placeholder="What can we help you with..">
                        </div>
                        <div class="form-group">
                            <label for="" class="ml0">Message</label>
                            <textarea v-model="enquiryForm.Message" name="" id="" cols="30" rows="4" class="form-control" placeholder="Gives us more details.."></textarea>
                        </div>
                        <button @click="submitEnquiry" :disabled="!isEnquiryFormValid" class="btn btn-primary btn-full mt16">Send a Message</button>
                    </div>
                </div>
            </div>
        </section>
        <section class="subscription bg--grey">
            <div class="container">
                <h2 class="section-title-1 text-center mb48">Get notified <br>about latest updates and offers</h2>
                <p class="lead text-center mb48">Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br>It has been the industry's standard dummy text ever since.</p>
                <div class="form-group email-wrapper">
                    <img src="@/assets/images/mail.svg" class="mail-icon" alt="">
                    <input v-model="subscriberEmail" type="email" class="form-control" placeholder="Your Email">
                    <button :disabled="!isSubscriberEmailValid" @click="subscribeUser" class="btn btn-primary subscribe">Subscribe</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import BookAd from '@/webapp/views/home/BookAd.vue';
import CreateAd from '@/webapp/views/home/CreateAd.vue';
import ResetPassword from '@/webapp/common/modals/ResetPassword.vue';
import ForgotPassword from '@/webapp/common/modals/ForgotPassword.vue';
import instance from '@/api';
import testimonials from '@/assets/data/testimonials.json';

export default {
    name: 'Home',
    components: {
        BookAd,
        CreateAd,
        ResetPassword,
        ForgotPassword
    },
    data() {
        return {
            activeTab: 'bookad',
            testimonials: testimonials,
            sliderOptions: {
                autoplay: true,
                infinite: true,
                autoplaySpeed: 5000,
                slidesToShow: 3,
                navButtons: false,
                responsive: [{
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 3
                    }
                }, {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                }, {
                    breakpoint: 300,
                    settings: {
                        slidesToShow: 1
                    }
                }]
            },
            workflow: [{
                Id: 1,
                Name: 'Select Your Slot',
                Desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut error optio voluptatibus ab voluptatum esse voluptates? Perspiciatis, maxime similique. Debitis, earum nulla. Molestias soluta sit aspernatur ipsa expedita libero ex!'
            }, {
                Id: 2,
                Name: 'Choose Your Plan',
                Desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut error optio voluptatibus ab voluptatum esse voluptates? Perspiciatis, maxime similique. Debitis, earum nulla. Molestias soluta sit aspernatur ipsa expedita libero ex!'
            }, {
                Id: 3,
                Name: 'Upload Your Ad',
                Desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut error optio voluptatibus ab voluptatum esse voluptates? Perspiciatis, maxime similique. Debitis, earum nulla. Molestias soluta sit aspernatur ipsa expedita libero ex!'
            }, {
                Id: 4,
                Name: 'Dont Lorem ipsum',
                Desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut error optio voluptatibus ab voluptatum esse voluptates? Perspiciatis, maxime similique. Debitis, earum nulla. Molestias soluta sit aspernatur ipsa expedita libero ex!'
            }],
            offers: [{
                Id: 1,
                Name: 'No Ad?',
                ImageUrl: require('@/assets/images/offers/1.jpg'),
                Desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut abore et dolore magna ali.'
            }, {
                Id: 2,
                Name: 'Hurry! 50% Off',
                ImageUrl: require('@/assets/images/offers/2.jpg'),
                Desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut abore et dolore magna ali.'
            }, {
                Id: 3,
                Name: 'Coffee Slots',
                ImageUrl: require('@/assets/images/offers/3.jpg'),
                Desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut abore et dolore magna ali.'
            }],
            subscriberEmail: '',
            enquiryForm: {},
            emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        };
    },
    methods: {
        goToComponent(name) {
            this.activeTab = name;
        },
        async subscribeUser() {
            try {
                await instance.post('api/contact/subscribe', { subscriberEmail: this.subscriberEmail });
                this.$swal({
                    title: 'Successful',
                    text: 'You have subscribed sucessfully.',
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
                throw (err);
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
                throw (err);
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
    created() {
        if (this.$route.query && this.$route.query.emailconfirmed) {
            this.$store.commit('DIALOG_CHOSEN', 'login');
        }
    }
};
</script>

<style lang="scss" scoped>
.home {
    .page-header {
        background-image: url('../../../assets/images/home-cover.jpg');
        background-size: cover;
        height: 400px;
        background-repeat: no-repeat;
        background-position: center center;
        position: relative;

        .overlay-layer {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.7);
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }
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
    .content-area {
        margin-top: -110px;
        position: relative;
        ul.tabs {
            list-style: none;
            padding: 0;
            margin-bottom: 0;
            height: 64px;
            li {
                display: inline-block;
                background-color: #f56100;
                width: 50%;
                text-align: center;
                padding: 12px;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                height: 56px;
                line-height: 24px;
                vertical-align: text-bottom;
                color: rgba(256, 256, 256, 0.6);
                font-weight: 400;
                font-size: 16px;
                font-family: $font-family-heading;
                cursor: pointer;

                a {
                    text-decoration: none;
                    color: #fff !important;
                    font-weight: bold;
                }

                &.active {
                    background-color: $brand-primary;
                    color: $white;
                    border-bottom: none;
                    height: 64px;
                    font-size: 20px !important;
                    margin-top: 0;
                    line-height: 40px;
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
        .content {
            background-image: url('../../../assets/images/pattern.svg');
            background-size: cover;
            background-position: center center;
            color: #fff;
            background-color: $brand-primary;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
        }
        @media (max-width: 767px) {
            margin-top: -14%;
            .content {
                margin-top: -1px;
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
            margin-top: -45%;
        }
        /* iPhone x Landscape */
        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
            margin-top: -25%;
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
    .latest-offers {
        .offers {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            .offer {
                background: $white;
                border-radius: 10px;
                max-width: 320px;
                display: inline-block;
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
                    p {
                        font-size: 16px;
                        color: #4a4a4a;
                    }
                }
            }
        }
        @media (max-width: 767px) {
            .offers {
                .offer {
                    max-width: 100%;
                    margin-bottom: 24px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
        /* iPhone 6, 6S, 7 and 8 Landscape */
        @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
            .offers {
                .offer {
                    .offer-image {
                        height: 380px;
                    }
                }
            }
        }
        /* iPhone 6+, 6S+, 7+ and 8+ Landscape */
        @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
            .offers {
                .offer {
                    .offer-image {
                        height: 380px;
                    }
                }
            }
        }
        /* iPhone x Landscape */
        @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
            .offers {
                .offer {
                    margin-bottom: 24px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
        /* iPad Portrait */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            .offers {
                .offer {
                    margin-bottom: 24px;
                }
            }
        }
        /* iPad Landscape */
        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
            .offers {
                .offer {
                    max-width: 288px;
                }
            }
        }
        /* iPad Pro Portrait */
        @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
            .offers {
                .offer {
                    max-width: 288px;
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
        .email-wrapper {
            max-width: 500px;
            position: relative;
            margin: 0 auto;
            input {
                padding-left: 50px;
            }
            .mail-icon {
                position: absolute;
                top: 14px;
                left: 12px;
            }
            .subscribe {
                position: absolute;
                top: 0;
                right: 0;
                padding: 6px 24px;
                font-size: 20px;
            }
        }
        @media (max-width: 767px) {
            .email-wrapper {
                .subscribe {
                    position: inherit;
                    margin-top: 32px;
                    width: 100%;
                }
            }
        }
    }
}
</style>
