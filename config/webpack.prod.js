const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");

module.exports = env => {
  return {
    name: "client",
    entry: {
      vendor: ["react", "react-dom"],
      main: ["./src/main.js"]
    },
    mode: "production",
    output: {
      filename: "[name]-bundle.js",
      chunkFilename: "[name].js",
      path: path.resolve(__dirname, "../dist"),
      publicPath: "/"
    },
    optimization: {
      splitChunks: {
        chunks: "initial",
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor"
          }
        }
      }
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        {
          test: /\.css$/,
          use: [
            { loader: MiniCSSExtractPlugin.loader },
            { loader: "css-loader" }
          ]
        },
        {
          test: /\.(jpg|svg|png)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "images/[name].[ext]"
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCSSExtractPlugin(),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(env.NODE_ENV)
        }
      }),
      new HTMLWebpackPlugin({
        template: "./src/index.ejs",
        inject: true,
        title: "georgefinn",
        favicon: "favicon.ico"
      }),
      new CompressionPlugin({
        algorithm: "gzip"
      }),
      new BrotliPlugin()
    ]
  };
};
