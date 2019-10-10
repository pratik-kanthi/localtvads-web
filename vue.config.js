module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	configureWebpack: {
		devtool: 'eval'
	},
	css: {
		loaderOptions: {
			scss: {
				prependData: `
				@import "~bootstrap/scss/_functions.scss";
				@import "~bootstrap/scss/_variables.scss";
				@import "~@/scss/variables.scss";
				@import "~@/scss/mixins/mixins.scss";
				`
			}
		}
	},
	lintOnSave: true
};
