var ManifestPlugin = require('webpack-manifest-plugin')
module.exports = {
    css: {
        sourceMap: true,
        loaderOptions: {
            less: {
                prependData: '@import "@/assets/less/base/variables.less";'
            }
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://music.api.boycot.top',
                // target: 'https://boycot-music-api.vercel.app',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/unsplash': {
                target: 'https://unsplash.com/napi/photos',
                // target: 'https://boycot-music-api.vercel.app',
                changeOrigin: true,
                pathRewrite: {
                    '^/unsplash': ''
                }
            }
        }
    },
    chainWebpack: config => {
        // ...other chains
        config.module // fixes https://github.com/graphql/graphql-js/issues/1272
            .rule('mjs$')
            .test(/\.mjs$/)
            .include
            .add(/node_modules/)
            .end()
            .type('javascript/auto')
    },
    configureWebpack: (config) => {
        return {
            resolve: {
                // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
                extensions: ['*', '.mjs', '.js', '.vue', '.json']
            },
            plugins: [
                new ManifestPlugin({
                    fileName: 'p-' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate() + '-zch.json'
                    // publicPath: ''
                })
            ]
        }
    }
}
