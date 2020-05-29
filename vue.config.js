const dayjs = require('dayjs');
const webpack = require('webpack');
const PACKAGE = require('./package.json');
const _ = require('lodash');
// const path = require('path');
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const fs = require('fs');
let proxyTarget = 'http://127.0.0.1:5005';
try {
    proxyTarget = fs.readFileSync('./.env.local');
    proxyTarget = _.replace(proxyTarget, 'REMOTE_SERVER=', '');
} catch (e) {
    console.warn('no proxy target');
}

const commitHash = require('child_process')
    // .execSync('git rev-parse --short HEAD')
    .toString();

module.exports = {
    configureWebpack: {
        devServer: {
            overlay: {
                warnings: true,
                errors: true,
            },
            proxy: {
                '/api': {
                    target: proxyTarget,
                    secure: false,
                    logLevel: 'debug',
                },
            },
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    BUILD_DATE: JSON.stringify(dayjs()),
                    CLIENT_VERSION: JSON.stringify(PACKAGE.version),
                    COMMIT_HASH: JSON.stringify(commitHash),
                },
            }),
            // 如果要启用dll加速编译，就启用下面这些代码
            // new webpack.DllReferencePlugin({
            //     context: process.cwd(),
            //     manifest: require('./public/vendor/vendor-manifest.json'),
            // }),
            // 将 dll 注入到 生成的 html 模板中
            // new AddAssetHtmlPlugin({
            //     // dll文件位置
            //     filepath: path.resolve(__dirname, './public/vendor/*.js'),
            //     // dll 引用路径
            //     publicPath: './vendor',
            //     // dll最终输出的目录
            //     outputPath: './vendor',
            // }),
        ],
    },
    pluginOptions: {
        webpackBundleAnalyzer: {
            openAnalyzer: false,
        },
    },
    chainWebpack: config => {
        // 移除 prefetch 插件，https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
        config.plugins.delete('prefetch');
        // config.plugins.delete('preload');
    },
};
