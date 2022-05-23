const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack')

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        hot: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers':
                'X-Requested-With, content-type, Authorization'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                CHAIN_ID: JSON.stringify('0x1'),
                CONTRACT_ADDRESS: JSON.stringify('0xb6601B239c53820558643009c6E9784C5e757d27'),
                PROJECT_ID: JSON.stringify('62055cd53fb9db48300256a1'),
                SERVER: JSON.stringify('http://localhost:3001/'),
                AUTHENTICATION: JSON.stringify('a9a5d580243b9ee0ab8377695b573e3aa8877803ac2596067d4b8e4ac8254266')
            }
        })
    ]
});