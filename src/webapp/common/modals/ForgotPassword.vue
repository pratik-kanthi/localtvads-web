<template>
  <v-dialog v-model="model" width="500" persistent data-app>
    <div class="user-login">
      <div class="content">
        <div class="content-area">
          <h3>Forgot Password?</h3>
          <p>Please enter your registered email address. We will email you with a link to reset your password</p>
          <form name="forgotPasswordForm">
            <div class="form-group">
              <input
                v-model="formData.email"
                type="email"
                class="form-control"
                placeholder="Email Address"
              />

              <button
                :disabled="!formData.email"
                @click="forgotPasswordRequest();"
                class="btn btn-primary btn-full"
                type="button"
              >Submit</button>
              <div class="alert alert-danger text-center" v-if="errMessage">
                <small>{{errMessage}}</small>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </v-dialog>
</template>


<script>
import instance from "@/api";

export default {
  name: "ForgotPassword",
  props: [],
  data() {
    return {
      model: true,
      api: "api/auth/forgotpassword/",
      formData: {
        email: null,
        isValid: false
      },
      errMessage: ""
    };
  },
  methods: {
    async forgotPasswordRequest() {
      try {
        let result = await instance.get(this.api + this.formData.email);
        this.$router.push({ name: "Home" });
        this.$swal({
          title: "Check Your Email",
          text: "A reset link has been emailed to your address",
          type: "success",
          confirmButtonColor: "#ff6500"
        });
      } catch (err) {
        this.$swal({
          title: "Invalid Email",
          text: err.data.message,
          type: "warning",
          confirmButtonColor: "#ff6500"
        });
      }
    }
  },
  computed: {},
  created() {}
};
</script>

<style scoped lang="less">
.user-login {
  .tabs {
    ul {
      list-style: none;
      padding-left: 0;
      background-color: transparent;
      height: 64px;
      margin: 0;

      li {
        background-color: #eee;
        display: inline-block;
        width: 50%;
        text-align: center;
        padding: 16px;
        height: 48px;
        vertical-align: text-bottom;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        line-height: 13px;
        color: @brand-primary;
        font-weight: bold;
        cursor: pointer;

        &.active {
          background-color: #fff;
          height: 64px;
          margin-top: 0;
          line-height: 32px;
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
  }

  .content {
    position: relative;
    background-color: #fff;
    padding: 32px 64px;

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;
      opacity: 0.5;
      z-index: 2;
    }
  }
}
</style>