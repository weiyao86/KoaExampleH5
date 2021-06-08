module.exports = {
  async index(ctx, next) {
    // const {backend = config.backendDefaultKey} = ctx.request.headers;
    // const pathname = ctx.url.replace(apiPrefix, '/api');
    // const res = await ctx.injectCurl(`${HOST[backend]}${pathname}`, {
    //   ...ctx.request.parameter,
    // }, ctx.request.method || 'POST');
    ctx.body = [{ name: 'name', value: 'value' }];
    ctx.status = 200;
    next();
  },
};
