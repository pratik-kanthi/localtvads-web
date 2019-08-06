const path = require('path');
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/localtvads-website/' : '/',
	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'scss',
			patterns: [ path.resolve(__dirname, './src/scss/styles.scss') ]
		}
	}
};
