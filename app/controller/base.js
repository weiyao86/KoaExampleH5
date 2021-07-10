const requireAll = require('require-all');
const axios = require('axios');
const path = require('path');

const instance = axios.create({
  timeout: 20 * 1000,
  adapter: require('axios/lib/adapters/http'),
});

const utils = requireAll({
  dirname: path.join(__dirname, '../utils'),
});
module.exports = {
  async index(ctx, next) {
    console.log('come in')
    await utils.returnTemplate.getBaseHtml(ctx);
    console.log(ctx.body)
  },

  //下载流
  async downloadFile(ctx,next){
    console.log('下载流  come in')
    let url="http://gsg-imgpvs.oss-cn-hangzhou.aliyuncs.com/export/gs_company/20210507/16203790356058tj2ar.jpeg";
    let file=await instance.get(url,{responseType:'stream'});
    console.log('***文件流****',file);
    ctx.set('Content-disposition','attachment;filename='+'16203790356058tj2ar.jpeg');
    // ctx.type="jpeg";
    ctx.body=file.data;
  }
};
