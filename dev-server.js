// 导入koa模块
const Koa = require('koa');
let router = require('./router');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const session = require('koa-session');
// const serve = require('koa-static');
const serve = require('koa-static-server');
const compose = require('koa-compose');
const views = require('koa-views');
const favicon = require('koa-favicon');
const koaWebpack = require('koa-webpack');
const middlewareFile = require('./app/middleware');
const path = require('path');
const webpackCng = require('./config/webpack.config.dev.js');
const webpack = require('webpack');
const os = require('os');

// 创建koa的实例app
const app = new Koa();

const CONFIG = {
  key: 'koa.sess' /** (string) cookie key (default is koa.sess) */,
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
  secure: true /** (boolean) secure cookie*/,
  sameSite: null /** (string) session cookie sameSite options (default null, don't set it) */,
};
//session
app.use(session(CONFIG, app));

//favicon
app.use(favicon(__dirname + '/favicon.ico'));

// 将 webpack.config.base.js 配置文件作为基础配置
// koa-webpack-dev-middleware 是一个封装器(wrapper)，它可以把 webpack 处理过的文件发送到一个 server,保存在内存中，开发环境使用
webpackCng.entry.main.unshift(`webpack-hot-client/client?whc_${new Date().getTime()}`);
// webpackCng.entry.main.unshift('react-hot-loader/patch');

webpackCng.plugins = webpackCng.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
]);

const compiler = webpack(webpackCng);

app.context.webpackCompiler = compiler;

// new webpack.ProgressPlugin().apply(compiler);

// compiler.run(function (err, stats) {
//   console.log("**********************")
//   console.log(stats)
//   console.log(err)
//   console.log('======================')
// });

// new webpack.ProgressPlugin((percentage, message, ...args) => {
//   // console.log("**********************")
//   // console.log(+percentage * 100 + '%', message);
//   // console.log(message);
//   // console.log([...args]);
//   // console.log('======================')
//   // console.info(percentage, message, ...args);
// }).apply(compiler)

let localIp = '';
let port = 3000;
function getIPAdress() {
  if (localIp) return localIp;
  let localIPAddress = '';
  let interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        localIPAddress = alias.address;
      }
    }
  }
  localIp = localIPAddress;
  return localIPAddress;
}

koaWebpack({
  compiler, //or configPath path.join(__dirname, 'client', 'webpack.config.js')
  devMiddleware: {
    // reporter,
    reporter(middlewareOptions, options) {
      const { log, state, stats } = options;

      if (state) {
        const displayStats = middlewareOptions.stats !== false;

        if (displayStats) {
          if (stats.hasErrors()) {
            log.error(stats.toString(middlewareOptions.stats));
          } else if (stats.hasWarnings()) {
            log.warn(stats.toString(middlewareOptions.stats));
          } else {
            log.info(stats.toString(middlewareOptions.stats));
          }
        }

        let message = 'Compiled successfully.**';

        if (stats.hasErrors()) {
          message = 'Failed to compile.';
        } else if (stats.hasWarnings()) {
          message = 'Compiled with warnings.';
        }
        setTimeout(() => {
          log.info(message);
          log.info(`请访问 http://127.0.0.1:${port} 或 http://${getIPAdress()}:${port}`);
        }, 233);
      } else {
        log.info('Compiling...');
      }
    },

    methods: ['GET', 'POST'],
    headers: { 'X-Custom-Header': 'yes' },
    publicPath: webpackCng.output.publicPath,
  },
  //热更新
  hotClient: {
    allEntries: false,
    autoConfigure: false,
    logTime: true,
    logLevel: 'error',
    // host: '127.0.0.1',
    // port: 8080,
    // server: app,
    // HTTPS: true,
  },
}).then((middleware, ...args) => {
  app.use(middleware);

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.body = error;
      // ctx.app.emit('error');
    }
  });

  //post 请求参数解析，文件上传
  app.use(
    koaBody({
      jsonLimit: '11mb', // JSON主体字节 1mb //application/json
      formLimit: '56kb', // 表单主体字节 56kb //application/x-www-urlencoded
      textLimit: '56kb', // 文本主体字节 56kb
      onError: (err, ctx) => {
        //eslint-disable-line
        console.log(err);
        throw err;
      },
      multipart: true, //
      formidable: {
        // multipart/form-data
        maxFields: 1000, // query 字符数 (0表示无限制)
        maxFieldsSize: 2 * 1024 * 1024, // 默认单位内存量 2MB
        maxFileSize: 20 * 1024 * 1024, // 限制上传文件的大小 20MB
        keepExtensions: true,
      },
    })
  );

  //统一设置中间件
  const { ignoreAssets, setTime, getTime, respond } = middlewareFile;

  //控制台输出日志--忽略相关文件
  // const ignore = ignoreAssets(logger());
  // const allMiddle = compose([setTime, getTime, respond, ignore]);

  // app.use(allMiddle)
  // app.use(router.middleware());
  //设置模板目录，ejs引擎

  app.use(
    views(path.join(__dirname, './app/views'), {
      map: {
        html: 'ejs',
      },
      extension: 'html',
    })
  );

  app.use((ctx, next) => router.middleware()(ctx, next));
  // app.use((ctx, next) => router.middleware()(ctx, next));

  app.use((ctx, next) => {
    //
    if (ctx.body) {
      return true;
    }
    return next();
  });

  //静态文件夹
  //静态文件夹,并指定首页
  // app.use(serve(path.join(__dirname, './public'),{index:'index.html'}));

  app.use(
    serve({
      rootDir: path.join(__dirname, '/public'),
      rootPath: '/public',
    })
  );
  // app.use(serve(path.join(__dirname, './public1')));
  // app.use(serve(path.join(__dirname, './public3')));
  // app.use(serve('.'));
});
//设置cookies
app.keys = ['im a newer secret', 'i like turtle2'];

//应用级错误
// app.on('error', (err) => {
//   console.log('server error', err);
// });

// 监听端口
app.listen(port, () => {
  console.log(`服务器已启动，http://localhost:${port}`);
});
