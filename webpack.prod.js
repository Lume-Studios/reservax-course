const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                CHAIN_ID: JSON.stringify('0x1'),
                CONTRACT_ADDRESS: JSON.stringify('0x15526AF86721E8265139e4F3D759c343aC1d53ce'),
                PROJECT_ID: JSON.stringify('6244e0e67a36b849e1de6255'),
                SERVER: JSON.stringify('https://reservax.55unity.com/'),
                AUTHENTICATION: JSON.stringify('a9a5d580243b9ee0ab8377695b573e3aa8877803ac2596067d4b8e4ac8254266')
            }
        })
    ]
});