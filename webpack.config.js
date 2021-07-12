const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js",
    },
    module: {
        // Use `ts-loader` on any file that ends in '.ts'
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    // Bundle '.ts' files as well as '.js' files.
    resolve: {
        extensions: [".ts", ".js"],
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 5000,
        watchContentBase: true,
    },

    devtool: "inline-source-map",
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "public" }, { from: "assets", to: "assets" }],
        }),
    ],
};
