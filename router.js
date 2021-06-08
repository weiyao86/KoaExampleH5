const requireAll = require('require-all');
const router = require('koa-better-router')().loadMethods();
const path = require('path');

const filter = requireAll({
  dirname: path.join(__dirname, './app/filter'),
});
const api = requireAll({
  dirname: path.join(__dirname, './app/api'),
});

const controller = requireAll({
  dirname: path.join(__dirname, './app/controller'),
});

const backUrl = '/';

//供接口使用
const apiWrapHttp = {
  get(url, api) {
    router.get(`${backUrl + url}`, api);
  },
  post(url, api) {
    router.post(`${backUrl + url}`, api);
  },
};

apiWrapHttp.get('/*', api.base.index);

router.get('/redirect', async (ctx, next) => {

  console.log('***************redirect***************');
  await ctx.render('index');//views index.html
});
router.get('/login', async (ctx, next) => {

  await ctx.render('login');//views index.html
});

router.get('/*', (ctx, next) => {

  const ignores=['public','/favicon.ico'];
    if (ignores.some(p=>ctx.url.indexOf(p) != -1)) {
      return true;
    }
    return next();
  }
,filter.verify,controller.base.index);//SPA  返回页面

module.exports = router;
