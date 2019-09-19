<template>
  <div>
    <button class="btn btn-facebook" @click="login()">
      <img src="@/assets/images/facebook.png" alt="facebook" />
      <span v-if="type === 'Login'">Login with Facebook</span>
      <span v-if="type === 'Register'">Sign up with Facebook</span>
    </button>
  </div>
</template>

<script>
import instance from "@/api";
export default {
  name: "Facebook",
  props: ["api", "type"],
  data() {
    return {
      isError: false,
      errMessage: ""
    };
  },
  methods: {
    onSignInSuccess(token) {
      FB.api(
        "/me?fields=name,email,picture&token=" + token.accessToken,
        async profile => {
          let body = {
            Name: profile.name,
            ImageUrl: profile.picture ? profile.picture.data.url : undefined,
            Email: profile.email,
            token: token.accessToken,
            AuthorisationScheme: "Facebook"
          };
          try {
            this.isError = false;
            let result = await instance.post(this.api, body);
            this.$cookies.set(
              "token",
              result.data.TokenString,
              result.data.iat - Math.floor(Date.now() / 1000) + "s"
            );
            delete result.data.TokenString;
            localStorage.setItem("user", JSON.stringify(result.data));
            this.$store.dispatch("loginSuccess");
          } catch (ex) {
            if (ex.status == 409) {
              this.$swal({
                title: "Error",
                text: ex.data.message,
                type: "warning",
                confirmButtonColor: "#ff6500"
              });
            } else if (ex.status == 404) {
              this.$swal({
                title: "Error",
                text: "Account not found. Would you like to create one?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff6500",
                confirmButtonText: "Yes",
                cancelButtonColor: "#ccc",
                cancelButtonText: "No"
              }).then(async isConfirm => {
                if (isConfirm.value) {
                  this.$store.commit("DIALOG", true);
                }
              });
            }
            this.isError = true;
            this.errMessage =
              ex.data && ex.data.message
                ? ex.data.message
                : "Some error occurred";
            this.$store.state.auth.loader = false;
          }
        }
      );
    },
    onSignInError(error) {
      console.log("Cancelled", error);
    },
    login() {
      this.$store.state.auth.loader = true;
      FB.login(
        response => {
          if (response.status === "connected") {
            this.onSignInSuccess(response.authResponse);
          } else {
            this.onSignInError();
            this.$store.state.auth.loader = false;
          }
        },
        { scope: "public_profile,email" }
      );
    }
  },
  created() {
    window.fbAsyncInit = function() {
      FB.init({
        appId: window.facebook.appId,
        cookie: true,
        xfbml: true,
        version: "v2.8"
      });
    };
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }
};
</script>

<style scoped lang="less">
.btn-facebook {
  width: 100%;
  background-color: #3b5998;
  color: #ffffff !important;
  border: none !important;
  text-transform: capitalize !important;
  position: relative;
  font-weight: 500 !important;
  &:hover {
    background: #3b5998 !important;
    color: #fff !important;
  }
}
img {
  position: absolute;
  width: 24px;
  left: 8px;
  top: 8px;
}
</style>