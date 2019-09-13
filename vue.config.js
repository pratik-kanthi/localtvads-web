const path = require('path');
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: [ path.resolve(__dirname, './src/less/styles.less') ]
		}
	},
	configureWebpack: {
		devtool: 'eval'
	}
};
