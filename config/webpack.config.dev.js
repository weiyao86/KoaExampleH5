const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const common = require('./webpack.config.base.js');

//dashboard -- ProgressBarPlugin 取其一即可
// const Dashboard = require('webpack-dashboard');
// const DashboardPlugin = require('webpack-dashboard/plugin');
// const dashboard = new Dashboard();


const WebPackCfg = merge(common, {
  mode: 'development', //"development" | "production" | "none"
  devtool: 'inline-source-map', //开发环境定位
  plugins: [
    new CleanWebpackPlugin(),
    //使用koa-webpack后带有热更新配置，此处禁用
    // new webpack.HotModuleReplacementPlugin(),
    new ProgressBarPlugin({
      format: '编译进度：[:bar] :percent (耗时：:elapsed 秒)',
      clear: false,
      width: 60,
      stream: process.stdout ? process.stdout : undefined,
    }),
    // new DashboardPlugin()
  ],
});

module.exports = WebPackCfg;
