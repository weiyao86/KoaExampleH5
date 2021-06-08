//中间件
module.exports = {
  //忽略文件
  ignoreAssets(mw) {
    return async function (ctx, next) {

      if (/(\.js|\.css|\.ico)$/.test(ctx.path)) {
        await next();
      } else {
        // must .call() to explicitly set the receiver
        await mw.call(this, ctx, next);
      }
    };
  },

  async setTime(ctx, next) {
    await next();

    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url}-${rt}`);
  },

  async getTime(ctx, next) {
    const start = new Date();

    let rst = await next();
    console.log(rst);
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  },

  async respond(ctx, next) {
    // ctx.body = 'Hello World!';
    ctx.cookies.set('name', 'tobi', { signed: true });

    console.log(`${ctx.cookies.get('name.sig')}`);
    // return '返回值 ： success';
    return next();
  },


};
