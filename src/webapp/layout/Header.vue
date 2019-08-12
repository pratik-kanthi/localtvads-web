<template>
    <div class="nav-container">
        <nav>
            <div class="nav-bar">
                <div class="module left">
                    <img class="logo" src="@/assets/images/logo-white.svg" alt="Local TV Ads">
                    <span class="tagline">low cost, local TV Time</span>
                </div>
                <div class="module-group right">
                    <ul class="menu">
                        <li><a>My Campaigns</a></li>
                        <li><a>My Ads</a></li>
                        <li><a>FAQs</a></li>
                        <li><a>Login</a></li>
                        <li><button class="btn btn-white">Register</button></li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
    .nav-container {
        background-color: @brand-primary;
        background-image: url('../../assets/images/pattern.svg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        height: 65px;
        line-height: 65px;
        color: #fff !important;
        padding: 0 32px;
        background-size: cover;
        nav {
            background-color: transparent;
            .nav-bar {
                height: 65px;
                max-height: 65px;
                line-height: 65px;
                border: none;
                .module {
                    padding: 0;
                    height: 65px;
                    .logo {
                        display: inline;
                        max-height: 65%;
                    }
                    .tagline {
                        margin-left: 32px;
                        font-family: @font-family-heading;
                        font-weight: 500;
                        font-size: 16px;
                    }
                }
                .module-group {
                    height: 65px;
                    .module {
                        .menu {
                            width: 100%;
                            height: 65px;
                            li {
                                margin-right: 32px;
                                float: left;
                                a {
                                    font-family: @font-family-heading;
                                }
                            }
                        }
                    }
                }
            }
        }
        
    }
    .menu li a{ font-size: 16px; text-transform: capitalize; font-weight: 500; letter-spacing: 1px; color: #fff; opacity: 1; .transition(0.3s); }
</style>
