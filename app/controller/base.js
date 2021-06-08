const requireAll = require('require-all');
const path = require('path');

const utils = requireAll({
  dirname: path.join(__dirname, '../utils'),
});
module.exports = {
  async index(ctx, next) {
    console.log('come in')
    await utils.returnTemplate.getBaseHtml(ctx);
    console.log(ctx.body)
  },
};
