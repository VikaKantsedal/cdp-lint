const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const webackConfig = module.exports = {
    context: path.resolve(__dirname + '/src/js'),
    entry: './script',
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ['bower_components', 'node_modules']
    },
    output: {
        path: __dirname + '/build/js',
        filename: 'cdp.js'
    },
    plugins: [new ExtractTextPlugin('../css/cdp.css')],
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-url!less-loader')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-url!less-loader')
            }
        ]
    },

    buildProd: function () {
        webackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                compress: {
                    warnings: false
                }
            }),
            new webpack.optimize.DedupePlugin());
    }
};
