module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/localtvads-website/' : '/',
	css: {
		loaderOptions: {
			sass: {
				data: `@import '~@/scss/styles.scss'`
			}
		}
	}
};
