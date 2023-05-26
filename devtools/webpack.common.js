/* eslint-disable no-process-env */
const webpack = require("webpack"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    path = require("path"),
    fse = require("fs-extra"),
    VueLoaderPlugin = require("vue-loader/lib/plugin"),

    rootPath = path.resolve(__dirname, "../"),
    addonBasePath = path.resolve(rootPath, "addons"),
    addonConfigPath = path.resolve(addonBasePath, "addonsConf.json"),
    entryPoints = {masterportal: path.resolve(rootPath, "js/main.js")},

    cesiumSource = 'node_modules/cesium',
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    cesiumWorkers = '../Build/Cesium/Workers';

let addonEntryPoints = {};

if (!fse.existsSync(addonConfigPath)) {
    console.warn("NOTICE: " + addonConfigPath + " not found. Skipping all addons.");
}
else {
    addonEntryPoints = require(addonConfigPath);
}

module.exports = function () {
    const addonsRelPaths = {},
        vueAddonsRelPaths = {};

    for (const addonName in addonEntryPoints) {
        let isVueAddon = false,
            addonPath = addonName,
            entryPointFileName = "";

        if (typeof addonEntryPoints[addonName] === "string") {
            entryPointFileName = addonEntryPoints[addonName];
        }

        // An addon is recognized as Vue-Addon, if:
        // - its configuration value is an object
        // - with at least a key named "type"
        if (typeof addonEntryPoints[addonName] === "object" && addonEntryPoints[addonName].type !== undefined) {
            isVueAddon = true;

            if (typeof addonEntryPoints[addonName].entryPoint === "string") {
                entryPointFileName = addonEntryPoints[addonName].entryPoint;
            }
            else {
                entryPointFileName = "index.js";
            }

            if (typeof addonEntryPoints[addonName].path === "string") {
                addonPath = addonEntryPoints[addonName].path;
            }
        }

        const addonCombinedRelpath = [addonPath, entryPointFileName].join("/");

        // Now check if file exists
        if (!fse.existsSync(path.resolve(addonBasePath, addonCombinedRelpath))) {
            console.error("############\n------------");
            throw new Error("ERROR: FILE DOES NOT EXIST \"" + path.resolve(addonBasePath, addonCombinedRelpath) + "\"\nABORTED...");
        }

        if (isVueAddon) {
            vueAddonsRelPaths[addonName] = Object.assign({
                "entry": addonCombinedRelpath
            }, addonEntryPoints[addonName]);
        }
        else {
            addonsRelPaths[addonName] = addonCombinedRelpath;
        }

    }

    return {
        entry: entryPoints,
        stats: {
            all: false,
            colors: true,
            warnings: true,
            errors: true,
            errorDetails: true
            // comment in for detailed logging in console
            // logging: "verbose",
            // modules: true,
            // moduleTrace: true,
            // reasons: true,
            // performance: true,
            // timings: true,
            // entrypoints: true
        },
        output: {
            path: path.resolve(__dirname, "../build/"),
            filename: "js/[name].js",
            publicPath: "../../build/",
            // Needed to compile multiline strings in Cesium
            sourcePrefix: ""
        },
      /*   amd: {
            // Enable webpack-friendly use of require in Cesium
            toUrlUndefined: true
        }, */
        resolve: {
            alias: {
                text: "text-loader",
                cesium: path.resolve(__dirname, cesiumSource),
                "variables": path.resolve(__dirname, "..", "css", "variables.scss")
            },
            mainFiles: ["Cesium"]
        },
        module: {
            rules: [
                // ignore all files ending with ".test.js".
                {
                    test: /\.(test|spec)\.js$/,
                    use: {
                        loader: "null-loader"
                    }
                },
                // take all files ending with ".js" but not with ".test.js" or ".spec.js"
                {
                    test: /\.js$/,
                    exclude: /\.(test|spec)\.js$/,
                    use: {
                        loader: "esbuild-loader",
                        options: {
                            loader: "js",
                            target: "es2015",
                            format: "cjs",
                            platform: "node"
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {}
                        },
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        "css-loader"
                    ]
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                    options: {
                        loaders: {
                            js: "esbuild-loader?"
                        }
                    }
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: "file-loader"
                        }
                    ]
                },
                {
                    test: /\.worker\.js$/,
                    use: {
                        loader: "worker-loader"
                    }
                }
            ]
        },
        plugins: [
            // provide libraries globally
            new webpack.ProvidePlugin({
                jQuery: "jquery",
                $: "jquery",
                Backbone: "backbone",
                Radio: "backbone.radio",
                i18next: ["i18next/dist/cjs/i18next.js"],
                _: "underscore"
            }),
            // create css under build/
            new MiniCssExtractPlugin({
                filename: "css/[name].css"
            }),
            new VueLoaderPlugin(),
            // create global constant at compile time
            new webpack.DefinePlugin({
                ADDONS: JSON.stringify(addonsRelPaths),
                VUE_ADDONS: JSON.stringify(vueAddonsRelPaths)
            }),
            // Copy Cesium Assets, Widgets, and Workers to a static directory
            new CopyWebpackPlugin({
                patterns: [
                    {from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
                    {from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
                    {from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
                ]

            }),
            new webpack.DefinePlugin({
                // Define relative base path in cesium for loading assets
                CESIUM_BASE_URL: JSON.stringify('')
            })
        ]
    };
};
