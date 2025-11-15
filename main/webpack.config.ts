import * as path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { fileURLToPath } from "url";

const isDev = process.env.NODE_ENV === "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createHtml(resolvePath: string, fileName: string): HtmlWebpackPlugin {
  return new HtmlWebpackPlugin({
    template: path.resolve(__dirname, resolvePath),
    filename: fileName,
    minify: {
      collapseWhitespace: !isDev,
    },
  });
}

interface WebpackConfiguration extends Configuration {
  devServer?: DevServerConfiguration;
}

const config: WebpackConfiguration = {
  context: path.resolve(__dirname, "src"),
  mode: isDev ? "development" : "production",
  entry: "./main.ts",
  output: {
    filename: "./[name].js",
    path: path.join(__dirname, "dist"),
    assetModuleFilename: "[path][name][ext]",
  },
  plugins: [
    createHtml("src/index.html", "index.html"),
    new MiniCssExtractPlugin({
      filename: "./[name].css",
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.hmpl$/i,
        use: ["hmpl-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    open: true,
    compress: true,
    port: 5000,
  },
};

export default config;
