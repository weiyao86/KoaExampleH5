const px2rem = require("postcss-pxtorem");
module.exports = ({file})=>{
  console.log('*******************')
  console.log(file)
  return {
    plugins: [
      px2rem({
        rootValue: 75, 
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
      require('cssnano')({ preset: ['default', { discardComments: { removeAll: true } }] }) //压缩css，去除所有注释
    ]
  }
};