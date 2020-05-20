const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    configureWebpack: {
        devtool: process.env.NODE_ENV === 'development' ? 'eval' : 'none',
        plugins: [new BundleAnalyzerPlugin()],
        resolve: {
            alias: { moment: 'moment/src/moment' }
        }
    },
    chainWebpack(config) {
        config.plugins.delete('prefetch');
        config.plugin('CompressionPlugin').use(CompressionPlugin);
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
    lintOnSave: false,
    pwa: {
        serviceWorker: false,
        name: 'LocalTV Ads',
        themeColor: '#ff6500',
        msTileColor: '#ff6500',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black-translucent',
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            exclude: [/\.map$/, /manifest\.json$/],
            include: [/.*index.html/, /.*\.js/, /.*\.css/, /.*\.png|gif|jpg|svg/],
            swSrc: 'src/service-worker.js',
            maximumFileSizeToCacheInBytes: 30097152
        },
        iconPaths: {
            favicon32: 'img/icons/favicon-32x32.png',
            favicon16: 'img/icons/favicon-16x16.png',
            appleTouchIcon: 'img/icons/apple-touch-icon.png',
            maskIcon: 'img/icons/safari-pinned-tab.svg',
            msTileImage: 'img/icons/mstile-150x150.png'
        }
    }
};
