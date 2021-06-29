const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const ConsoleLogOnBuildWebpackPlugin = require('./plugin/consoleLogOnBuildPlugin');
const EndWebpackPlugin = require('./plugin/endWebpackPlugin');

const fs = require('fs');
const path = require('path');
const os = require('os');
const webpack = require('webpack');

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const ClientDir = path.resolve(__dirname, '../client');


const HappyPack = require('happypack');

const cpuSize = (os.cpus() || []).length || 4;
console.log('当前核心数：', cpuSize);
// 多线程运行
const happyThreadPool = HappyPack.ThreadPool({size: cpuSize});

const happyPackLoaders = IS_PROD ?
  [
    'cache-loader',
    'babel-loader?cacheDirectory',
  ] :
  [
    'cache-loader',
    'babel-loader?cacheDirectory',
  ];


console.log('****************process.env.NODE_ENV**********');

console.log(process.env.NODE_ENV);
console.log(path.resolve(__dirname));
console.log(path.resolve(__dirname, '../client'));
console.log(process.cwd());
console.log('****************process.env.END**********');




// console.log(resourceStaticPath,copyPath)
// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
  
  const loaders = [!IS_PROD && 'style-loader', IS_PROD && MiniCssExtractPlugin.loader, cssOptions,'postcss-loader'].filter(Boolean);
  if (preProcessor) {
    loaders.push(preProcessor);
    console.log('**********loaders**************', loaders);
  }
  //验证文件名
  loaders.push('filename-loader');
 
  return loaders;
};

module.exports = {
  // 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader
  context: ClientDir,
  //动态入口 （暂时没用--）
  // entry: () => ({ main: ['./index.js'], demo: ['./test.js'] }),
  entry: {
    // main: ['react-hot-loader/patch', './index.js']   //使用koa-webpack后带有热更新配置，此处禁用
    main: ['./app.js'],
  },
  output: {
    filename: IS_PROD ? '[name].[contenthash].js' : '[name].[hash:10].js', //'[name].[contenthash].js',
    path: path.resolve(__dirname, '../public'),
    //生产环境相对css,js路径
    publicPath: IS_PROD ? '/' : '/'
    // chunkFilename: `chunk/js/[name].js`,
  },

  externals: {
    jquery: 'jQuery',
    // only define the dependencies you are NOT using as externals!
    canvg: 'canvg',
    // html2canvas: 'html2canvas',
    dompurify: 'dompurify',
  },

  //配置.css,.scss,.less
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'happypack/loader?id=babel',
        // loader:'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: getStyleLoaders('css-loader'),
      },
      {
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        use: getStyleLoaders('css-loader', 'sass-loader'),
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        // use: getStyleLoaders('css-loader', 'less-loader'),
        use: getStyleLoaders('css-loader', {loader:'less-loader',options:{lessOptions:{javascriptEnabled:true}}}),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            // url-loader(limit范围内转化为base64) 包含file-loader
            loader: 'url-loader',
            options: {
              name: 'image/[name]-[hash:5].[ext]',
              limit: 8192, // 大概8k以下的图片打包成base64
            },
          },
          {
            //压缩图片
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              //todo:ios 好像有兼容问题？？禁用先 the webp option will enable WEBP
              // webp: {
              //   quality: 75
              // }
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '@Client': ClientDir,
    },
  },
  resolveLoader: {
    modules: [path.join("../config/loader"), 'node_modules'],
    
  },
  //创建web服务，缓存在内存中，改变文件自动更新
  // devServer:{
  //   contentBase: path.join(__dirname, 'dist'),
  //   compress: true,
  //   port: 9000,
  //   open:true,
  //   hot:true
  // },

  //SplitChunksPlugin 插件可以将公共的依赖模块提取到已有的 entry chunk 中，或者提取到一个新生成的 chunk
  optimization: {
    splitChunks: {
      chunks: 'all', // all, async, initial 三选一, 插件作用的chunks范围// initial只对入口文件处理
      name: 'chunk',
      cacheGroups: {
        // vendor: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name: 'chunk-vendors',
        //   chunks: 'all'
        // },
        jquery: {
          name: 'chunk-jquery', // 单独将 jquery 拆包
          priority: 1, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
          test: /[\\/]node_modules[\\/]_?jquery(.*)/,
        },
      },
    },
    runtimeChunk: 'single',
  },
  plugins: [
    //给模块取个别名，用的地方无需引入了eg:   ...自动解析引入
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    //指定生成页
    new HtmlWebpackPlugin({
      title: 'Webpack-title',
      filename: 'index.html',
      template: path.resolve(__dirname, '../client/components/layout/index.html'),
      //指定引入的资源文件，默认entry入口 ，如多页面可指定不同chunks
      // chunks: ['main'],
      inject: 'body',
      minify: {
        //开发环境下禁用
        collapseWhitespace: IS_PROD, // 去除html的换行
        minifyJS: IS_PROD, // 压缩html中的js
      },
    }),

    new HappyPack({
      // 多线程运行 默认是电脑核数-1
      id: 'babel', // 对于loaders id
      loaders: happyPackLoaders,
      threadPool: happyThreadPool,
      // 是否允许 happypack 在运行 webpack --profile 时输出日志，默认是 false
      verboseWhenProfiling: true, // 显示信息
    }),

    new WebpackBar(),

    //自定义插件，内部实现各类钩子函数
    // new ConsoleLogOnBuildWebpackPlugin(),
    new EndWebpackPlugin(()=>{
      console.log('success');
    },(err)=>{
      console.log('fail',err);
    }),
  ],
};
