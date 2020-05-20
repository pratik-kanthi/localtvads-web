<template>
    <footer>
        <div class="container-fluid">
            <div class="row">
                <div class="col footer-content d-flex flex-column flex-sm-row justify-content-between align-items-center">
                    <div class="logo">
                        <router-link tag="a" to="/">
                            <img src="@/assets/images/new_logo_dark.png" alt="" />
                        </router-link>
                    </div>
                    <div class="footer-nav d-flex flex-column flex-sm-row justify-content-between">
                        <div>
                            <router-link tag="a" to="/#how-it-works">How It Works</router-link>
                        </div>
                        <div>
                            <router-link tag="a" to="/#book-now">Book Now</router-link>
                        </div>
                        <div>
                            <router-link tag="a" to="/#offers">Offers</router-link>
                        </div>
                        <div>
                            <router-link tag="a" to="/#about">About</router-link>
                        </div>
                        <div>
                            <router-link tag="a" to="/#contact">Contact us</router-link>
                        </div>
                    </div>
                    <div>
                        © 2020 Local TV Ads
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
};
</script>

<style lang="scss" scoped>
.footer-content {
    .footer-nav {
        a {
            padding: 16px;
        }
    }

    @media (max-width: 767px) {
        align-items: flex-start !important;
        padding: 24px 16px;
        .logo {
            width: 80px;
        }
        .footer-nav {
            padding: 24px 0;
            a {
                padding: 0;
            }
        }
    }
}
footer {
    padding: 40px 45px;
    .logo {
        width: 120px;
        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
    ul.menu {
        @include list-unstyled();
        margin: 0;
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        li {
            float: left;
            margin-right: 40px;
            line-height: 80px;
            font-size: 16px;
            font-family: $font-family-heading;
            font-weight: 400;
            &:last-child {
                margin-right: 0;
            }
            a {
                color: $brand-primary;
            }
        }
    }
    ul.social {
        @include list-unstyled();
        li {
            float: left;
            margin-right: 40px;
            line-height: 80px;
            font-size: 14px;
            font-family: $font-family-body;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    /* Mobile */
    @media (max-width: 767px) {
        padding: 16px 0;
        ul.menu {
            justify-content: flex-start;
            li {
                line-height: 48px;
            }
        }
    }
    /* iPad Portrait */
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        padding: 24px;
        ul.menu {
            justify-content: space-between;
        }
    }
    /* iPad Landscape */
    @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
        padding: 24px;
        ul.social {
            li {
                margin-right: 24px;
                font-size: 11px;
            }
        }
    }
    /* iPad Pro Portrait */
    @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
        padding: 24px;
        ul.social {
            li {
                margin-right: 24px;
                font-size: 11px;
            }
        }
    }
}
</style>
