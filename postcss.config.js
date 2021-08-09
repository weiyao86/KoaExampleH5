const px2rem = require("postcss-pxtorem");
module.exports = ({file,a,b})=>{
  let remUnit; // 判断条件
  console.log('*******************'+ file)
  console.log(file,a,b)
  //按750*1334 设计稿1：1还原,第三方UI框架没适配rem－如(zarm 根字体为37.5px),后续重写zarm组件样式时需px/2
  let otherUI=['zarm'];
  if (file &&  otherUI.some(n=>file.indexOf(n)>-1)) {
    remUnit = 37.5;
  } else {
    remUnit = 75;
  }
  return {
    plugins: [
      px2rem({
        rootValue: remUnit, 
        unitPrecision: 5,
        propList: ['*']
        // selectorBlackList: [],
        // replace: true,
        // mediaQuery: false,
        // minPixelValue: 12
      }),
      require('postcss-flexbugs-fixes'),
      require('postcss-preset-env')({
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
      }),
      require('postcss-normalize')(),
      require('cssnano')({ preset: ['default', { discardComments: { removeAll: false } }] }) //压缩css，去除所有注释
    ]
  }
};