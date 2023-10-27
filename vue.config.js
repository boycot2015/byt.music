var ManifestPlugin = require('webpack-manifest-plugin')
const { name } = require('./package.json')
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
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        port: 3008,
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
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => ({
                ...options,
                compilerOptions: {
                    // treat any tag that starts with css-doodle as custom elements
                    isCustomElement: tag => tag.startsWith('css-')
                }
            }))
    },
    configureWebpack: (config) => {
        return {
            resolve: {
                // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
                extensions: ['*', '.mjs', '.js', '.vue', '.json']
            },
            output: {
                library: 'micro-music', // 子应用的name就是<micro-app name='子应用的name'></micro-app>中name属性的值
                libraryTarget: 'umd',
                jsonpFunction: `webpackJsonp_${name}`
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
