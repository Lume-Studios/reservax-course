const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                CHAIN_ID: JSON.stringify('0x4'),
                CONTRACT_ADDRESS: JSON.stringify('0xb6601B239c53820558643009c6E9784C5e757d27'),
                PROJECT_ID: JSON.stringify('62055cd53fb9db48300256a1'),
                SERVER: JSON.stringify('http://localhost:3001/')
            }
        })
    ]
});