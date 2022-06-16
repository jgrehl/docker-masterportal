/**
 * See https://www.digitalocean.com/community/tutorials/vuejs-demistifying-vue-webpack
 */
const webpack = require("webpack"),
    path = require("path"),
    Vue = require("vue"),
    VueLoaderPlugin = require("vue-loader/lib/plugin");

require("regenerator-runtime/runtime");
require("jsdom-global")();
require("proj4");

global.DOMParser = window.DOMParser;
global.XMLSerializer = window.XMLSerializer;

URL.createObjectURL = function () {
    return false;
};
Vue.config.devtools = false;

module.exports = {
    mode: "development",
    target: "node",
<<<<<<< HEAD
    devtool: "inline-cheap-module-source-map",
    output: {
        // use absolute paths in sourcemaps (important for debugging via IDE)
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
        devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
    },
=======
>>>>>>> 95904fdd5 (remove webpack.test for backbone and test function in package.json In this case rename webpack.vue.test.js to webpack.test.js)
    // use when debugging:
    // devtool: "cheap-module-eval-source-map",
    // output: {
    //     devtoolModuleFilenameTemplate: "[absolute-resource-path]"
    // },

    resolve: {
        alias: {
            vue: "vue/dist/vue.js"
        },
        extensions: [".tsx", ".ts", ".js"]
    },
    externals: [
        /^(bootstrap-slider|\$)$/i
    ],
    module: {
        rules: [
            // replace untransformable code in olcs-package
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "../node_modules/olcs/util"),
                    path.resolve(__dirname, "../node_modules/olcs/core")
                ],
                use: {
                    loader: "string-replace-loader",
                    options: {
                        search: "const exports = {};",
                        replace: "var exports = {};"
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /\bvideo.js\b|\bsinon\b|\bturf\b|\bjsts\b/,
                use: {
                    loader: "esbuild-loader",
                    options: {
                        loader: "js",
                        target: "es2018",
                        format: "cjs",
                        platform: "node"
                    }
                }
            },
            {
                test: /\.[t]sx?$/,
                use: {
                    loader: "esbuild-loader"
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        js: "esbuild-loader?"
                    },
                    optimizeSSR: false
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]"
                }
            },
            {
                test: /\.(le|c|sa|sc)ss$/,
                use: "null-loader"
            },
            {
                test: /\.(svg)$/,
                exclude: /fonts/, /* dont want svg fonts from fonts folder to be included */
                use: [
                    {
                        loader: "svg-url-loader",
                        options: {
                            noquotes: true
                        }
                    }
                ]
            },
            {
                test: /\.xml$/i,
                use: "raw-loader"
            },
            {
                test: /\.worker\.js$/,
                use: {
                    loader: "worker-loader"
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: "file-loader"
                    }
                ]
            }
        ]
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.ProvidePlugin({
            i18next: ["i18next/dist/cjs/i18next.js"],
            mapCollection: [path.resolve(path.join(__dirname, "../src_3_0_0/core/maps/js/mapCollection.js")), "default"],
            Config: path.resolve(__dirname, "../test/unittests/deps/testConfig")
            // XMLSerializer: path.resolve(__dirname, "../test/unittests/deps/testXmlSerializer"),
            // fs: "fs",
            // requestAnimationFrame: "raf"
        }),
        new VueLoaderPlugin(),
        new webpack.IgnorePlugin(/canvas/, /jsdom$/)
    ],
    node: {
        fs: "empty"
    }
};
