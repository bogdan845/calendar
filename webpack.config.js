const webpack = require("webpack");
const path = require("path");
const ASSET_PATH = process.env.ASSET_PATH || '/';
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

/* vars for building project in dev/prod mode */
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

/* FUNCTIONS START*/

// optimization
const optimization = () => {
    const config = {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace("@", "")}`;
                    }
                }
            }
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

// filename
const filename = (extnsn) => isDev ? `[name].${extnsn}` : `[name].[contenthash].bundle.${extnsn}`;

// css loader
const styleLoader = (loader) => {
    const styleConfig = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hrm: isDev,
                reload: true
            }
        },
        "source-map-loader",
        "css-loader",
    ];

    if (loader) {
        styleConfig.push(loader);
    }

    return styleConfig;
};

// babel options
const babelOptions = (preset) => {
    const babelConfig = {
        presets: [
            "@babel/preset-env"
        ],
        plugins: [
            "@babel/plugin-proposal-class-properties"
        ]
    }

    if (preset) {
        babelConfig.presets.push(preset);
    }

    return babelConfig;
};

// esLint
const jsLoaders = () => {
    const loaders = [{
        loader: "babel-loader",
        options: babelOptions()
    }]

    return loaders;
};

/* FUNCTIONS END*/


module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: ["@babel/polyfill", "./index.js", "./index.html"],
    },
    output: {
        chunkFilename: filename("js"),
        filename: filename("js"),
        path: path.resolve(__dirname, "dist"),
        publicPath: ASSET_PATH,
    },
    optimization: optimization(),
    resolve: {
        extensions: [".js"],
        alias: {
            "@parts": path.resolve(__dirname, "src/parts"),
            "@": path.resolve(__dirname, "src")
        },
        modules: ["node_modules"]
    },
    devServer: {
        port: 4200,
        open: true,
        hot: isDev,
    },
    devtool: isDev ? "source-map" : false,
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./src/favicon.ico"),
                    to: path.resolve(__dirname, "dist")
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename("css"),
        }),
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader"
            },
            {
                test: /\.css$/,
                use: styleLoader()
            },
            {
                test: /\.s[ac]ss$/,
                use: styleLoader("sass-loader")
            },
            {
                test: /\.(jpg|jpeg|png|svg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            },
            {
                test: /\.(ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
        ]
    }
}