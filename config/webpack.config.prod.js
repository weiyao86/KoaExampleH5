const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.base.js');
const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin'); //

// 复制  plugin-->CopyPlugin
const resourceStaticPath = path.join(__dirname, '../client/resource');
const copyPath = path.join(__dirname, '../public/static');

let versionNo = 0;
const changeVersion = () => {
  const pkgPath = path.join(__dirname, '../package.json');

  const pkgStr = fs.readFileSync(pkgPath).toString();

  const pkgJson = JSON.parse(pkgStr);

  let newV = +pkgJson.version.replace(/\./g, '');

  pkgJson.version = ('' + ++newV).split('').join('.');
  console.log('更新版本号为：' + pkgJson.version);
  versionNo = pkgJson.version;

  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, '\t'));
};

changeVersion();

module.exports = merge(common, {
  mode: 'production', //"development" | "production" | "none"
  devtool: 'source-map',
  output: {
    filename: `[name].${versionNo}.js`, //'[name].[contenthash].js',
    path: path.resolve(__dirname, '../public'),
    //生产环境相对css,js路径
    publicPath: '/',
    chunkFilename: `chunk/js/[name].${versionNo}.js`,
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true, // 启用多核心高速构建
        sourceMap: false,
        extractComments: false, // 是否提取注释 .LICENSE 文件中
        uglifyOptions: {
          output: {
            comments: false, // 去掉所有注释
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.(css)$/g,
        cssProcessor: require('cssnano'), // 引入cssnano配置压缩选项
        cssProcessorPluginOptions: {
          preset: [
            'default',
            {
              normalizeWhitespace: false,
              mergeLonghand: false,
              mergeRules: false,
              minifyGradients: false,
              // discardComments: {
              //   // removeAll: true
              //   remove(comment) {
              //     return comment.indexOf('@gsg-') !== 0;
              //   },
              // },
            },
          ],
        },
        canPrint: true, // 是否将插件信息打印到控制台
      }),
    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format: '编译进度：[:bar] :percent (耗时：:elapsed 秒)',
      clear: true,
      width: 60,
      stream: process.stdout ? process.stdout : undefined,
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {
        from: resourceStaticPath,
        to: copyPath,
        toType: 'dir',
        force: true,
      },
    ]),
    new MiniCssExtractPlugin({
      // filename: `style/[name].${versionNo}.css`,
      chunkFilename: `chunk/css/[name].${versionNo}.css`,
      ignoreOrder: true,
    }),
  ],
});
