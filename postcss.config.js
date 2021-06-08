module.exports = {
  plugins: [
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