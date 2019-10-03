<template>
    <footer>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-3">
                    <div class="logo">
                        <router-link tag="a" to="/">
                        <img src="@/assets/images/logo-dark.svg" alt="">
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-6">
                    <ul class="menu">
                        <li><router-link tag="a" to="/#book-now">Book Now</router-link></li>
                        <li><router-link tag="a" to="/#how-it-works">How it works</router-link></li>
                        <li><router-link tag="a" to="/#offers">Offers</router-link></li>
                        <li><router-link tag="a" to="/#about">About</router-link></li>
                        <li><router-link tag="a" to="/#contact">Contact us</router-link></li>
                    </ul>
                </div>
                <div class="col-sm-3">
                    <ul class="social">
                        <li><a><img src="@/assets/images/facebook.svg" alt=""></a></li>
                        <li><a><img src="@/assets/images/twitter.svg" alt=""></a></li>
                        <li>© 2019 Localtvads.com</li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: "Footer"
}
</script>

<style lang="scss" scoped>
    footer {
        padding-left: 50px;
        padding-right: 50px;
        .logo {
            width: 120px;
            img {
                max-width: 100%;
                max-height: 100%
            }
        }
        ul.menu {
            @include list-unstyled();
            margin: 0;
            display: flex;
            flex-direction: row;
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
                a {color: $brand-primary}
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
    }

</style>
