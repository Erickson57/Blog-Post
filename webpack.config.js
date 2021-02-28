const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development' // Определяет режим сборки 
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetPlugin(),
            new TerserPlugin()
        ]
    }
    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './js/index.js']
    },
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
        publicPath: ''
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    optimization: optimization(),
    devServer: {
        historyApiFallback: true,
        clientLogLevel: 'none',
        contentBase: path.resolve(__dirname, 'dist'),
        open: true,
        compress: true,
        port: 8080
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, 'dist') }
            ]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, 'css-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },

            {
                test: /\.s[ac]ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: (resourcePath, context) => {
                            return path.relative(path.dirname(resourcePath), context) + '/';
                        },
                    }
                },
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(?:|png|jpg|svg|gif)$/,
                use: [
                    `file-loader?name=./img/${filename('[ext]')}`,
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            mozjpeg: {
                                progressive: true,
                            },
                            webp: {
                                quality: 75
                            }
                        },
                    }],
            },
            {
                test: /\.(ttf|woff|woff2|eot|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `fonts/${filename('[ext]')}`
                        }
                    }
                ],
            }
        ]
    }
}       