<template>
	<b-modal v-model="model" centered hide-footer no-close-on-esc no-close-on-backdrop title="Forgot Password?">
		<button slot="modal-header-close" @click="cancel" class="close">×</button>
		<div class="user-login">
			<div class="content">
				<div class="content-area">
					<p>Please enter your registered email address. We will email you with a link to reset your password</p>
					<form name="forgotPasswordForm">
						<div class="form-group">
							<input v-model="formData.email" type="email" class="form-control mb16" placeholder="Email Address" />
							<button :disabled="checkEmail" @click="forgotPasswordRequest" class="btn btn-primary btn-full" type="button">Submit</button>
							<div class="alert alert-danger text-center" v-if="errMessage">
								<small>{{errMessage}}</small>
							</div>
							<button class="btn btn-full btn-danger btn-bordered mt16" @click="cancel">Cancel</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</b-modal>
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
			cancel() {
				this.$router.push('/', () => { });
			},
			async forgotPasswordRequest() {
				try {
					let result = await instance.get(this.api + this.formData.email);
					this.$router.push({ name: "Home" }, () => { });
					this.$swal({
						title: "Check Your Email",
						text: "A reset link has been emailed to your address",
						type: "success",
						confirmButtonColor: "#ff6500"
					});
				} catch (err) {
					this.$swal({
						title: "Error",
						text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
						type: "error"
					});
					console.error(err);
				}
			}
		},
		computed: {
			checkEmail() {
				return !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.formData.email);
			}
		}
	};
</script>

<style lang="scss" scoped>
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
					color: $brand-primary;
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
			padding: 32px;

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