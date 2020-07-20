const path = require('path');
const resolve = dir => {
    return path.join(__dirname, dir);
};

module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port: 8081, // 端口
    },
    chainWebpack: config => {
        config.entry = {
            main: ['babel-polyfill', './src/main'],
            vendors: './src/vendors'
        };
        config.module
            .rule('view-design')
            .test(/view-design.src.*?js$/)
            .use('babel')
            .loader('babel-loader')
            .end();
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/components'));
    }
}
