const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const package = require("./package.json");

module.exports = {
    mode: "development",
    devtool: "cheap-module-source-map",
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: "src/addon/icons", to: "icons" },
            { from: "src/options.html", to: "options.html" },
            {
                from: "src/addon/manifest.json",
                to: "manifest.json",
                transform(content, path) {
                    var manifest = JSON.parse(content.toString());
                    manifest.version = package.version;
                    manifestJson = JSON.stringify(manifest, null, 4);
                    return manifestJson;
                }
            }
        ])
    ],
    entry: {
        stats: "./src/stats.js",
        tracker: "./src/tracker.js",
        options: "./src/options.js"
    },
    output: {
        filename: "[name].js"
    }
};
