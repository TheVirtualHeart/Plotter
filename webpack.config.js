var webpack = require('webpack');

var config = {
    cache: true,
    devtool: 'source-map',
    output: {
        library: 'Plotter',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            }
        })
    ]
};

module.exports = config;