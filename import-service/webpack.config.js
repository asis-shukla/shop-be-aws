const { IgnorePlugin } = require("webpack");
const path = require("path");

module.exports = {
  entry: "./src/handler.js",
  output: {
    libraryTarget: "commonjs",
    filename: "handler.js",
    path: path.resolve(__dirname, ".webpack"),
  },
  target: "node",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          configFile: "./babel.config.js",
        },
      },
    ],
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /^pg-native$/,
    }),
  ],
};
