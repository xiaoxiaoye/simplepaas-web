// const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    devServer: {
        proxy: {
            '/repository': {
                ws: false,
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            },
            '/token': {
                ws: false,
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            },
            '/cluster/status': {
                ws: false,
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            },
            '/logout': {
                ws: false,
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            },
            '/application': {
                ws: false,
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            },
            '/config': {
                ws: false,
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/': ''
                }
            }
        }
    },
    configureWebpack: config => {
        // if (process.env.NODE_ENV === 'production') {
        //     return {
        //         plugins: [
        //             new CompressionPlugin({
        //                 test: /\.js$|\.html$|\.css/,
        //                 threshold: 1024,
        //                 deleteOriginalAssets: false
        //             })
        //         ]
        //     }
        // }
        return {
            devtool: 'source-map'
        }
    }
}