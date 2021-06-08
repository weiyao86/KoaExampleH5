const cheerio = require("cheerio");
const fs = require("fs");
const path = require('path');

let contentHtml = '';

async function loadHTMLTemplate (ctx){
  try {
      let content = '';
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        content = ctx.webpackCompiler.outputFileSystem.readFileSync(path.join(ctx.webpackCompiler.outputPath, 'index.html')).toString();
      } else if (contentHtml) {
        content = contentHtml;
      } else {
        contentHtml = fs.readFileSync(path.join(process.cwd(), '/public', 'index.html'));
        content = contentHtml;
      }
      return cheerio.load(content);
    } catch (e) {
      return false;
    }
}

exports.getBaseHtml=async function(ctx){
  // debugger;
  const $ = await loadHTMLTemplate(ctx);
    if(!$){
      ctx.body=null;
      return;
    }
  ctx.body = $.html();
}
