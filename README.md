## 基于koa-react-webpack 同构开发
>一、安装React相关的包：*
>>运行cnpm i react react-dom -S来安装包；
 
 >二、在项目中使用JSX语法：
 >>什么是JSX语法：就是符合XML规范的js语法。（语法格式相对于html严谨很多）
 
 >>如何启用JSX语法？
 >>安装babel插件：
 
 >运行：
 
 >>>cnpm i babel-core babel-loader babel-plugin-transform-runtime -D
 >>>cnpm i babel-preset-env babel-preset-stage-0 -D
 
 ## 安装能够识别转换JSX语法的包：
 
 >运行：
 
 >>>cnpm i babel-preset-react -D
 
 >>项目的根目录下添加.babelrc配置文件：
 
 >>{
     "presets": ["env", "stage-0", "react"],
     "plugins": ["transform-runtime"]
 >>}
 
 >>presets中的“react”是用来将jsx转换成js的。 
 
 >>webpack.config.js文件中添加babel-loader的配置项：
 
 module: {
     rules: [
         {
             test: /\.js|jsx$/,
             use: "babel-loader",
             exclude: /node_modules/
         }
     ]
 }
 
 ## 主要文件：
 ---
 package.json：（babel-loader必须为7.x版本）
    
 ```
 {
   "name": "wp4-1",
   "version": "1.0.0",
   "description": "",
   "main": "index.js",
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1",
     "dev": "webpack-dev-server --open chrome --port 3000 --hot --host 127.0.0.1"
   },
   "keywords": [],
   "author": "",
   "license": "ISC",
   "devDependencies": {
     "babel-core": "^6.26.3",
     "babel-loader": "^7.1.5",
     "babel-plugin-transform-runtime": "^6.23.0",
     "babel-preset-env": "^1.7.0",
     "babel-preset-react": "^6.24.1",
     "babel-preset-stage-0": "^6.24.1",
     "html-webpack-plugin": "^3.2.0",
     "webpack": "^4.41.5",
     "webpack-cli": "^3.3.10",
     "webpack-dev-server": "^3.10.1"
   },
   "dependencies": {
     "react": "^16.12.0",
     "react-dom": "^16.12.0"
   }
 }
 ```
 webpack.config.js：
 
 const path = require("path")
 const htmlWebpackPlugin = require("html-webpack-plugin") // 导入 在内存中自动生成html文件 的插件
 
 // 创建一个插件的实例对象
 ```
 const htmlPlugin = new htmlWebpackPlugin({
     template: path.join(__dirname, "./src/index.html"), // 源文件
     filename: "index.html" // 生成的 内存中首页的 名称
 })
 ```
 // 向外暴露一个打包的实例对象，因为webpack是基于Node构建的，所以webpack支持所有Node API和语法
 // webpack 默认只能打包处理.js后缀名类型的文件，想.vue .png无法主动处理，所以要配置第三方的loader
 ```
 module.exports = {
     mode: 'development', // development 或 production
     plugins: [
         htmlPlugin
     ],
     module: { // 所有第三方模块的配置规则
         rules: [ // 第三方匹配规则
             {
                 test: /\.js|jsx$/,
                 use: "babel-loader",
                 exclude: /node_modules/ // exclude千万别忘记
             }
         ]
     }
 }
 ```
 .babelrc
 ```
 
 {
     "presets": ["env", "stage-0", "react"],
     "plugins": ["transform-runtime"]
 }
 ```
 index.js：
 
 // 导入包
 ```
 import React from 'react'
 import ReactDOM from 'react-dom'
 
 // HTML是最优秀的标记语言；
 // 注意：在JS文件中，默认不能写类似于HTML的标记语言，否则打包会失败
 // 可以使用babel来转换这些JS中的标记
 // 这种在JS中混合写入类似于HTML的语法叫做JSX语法，符合XML规范的JS
 // JSX语法的本质还是在运行的时候，被babel转换成React.createElement形式来执行的
 
 const myDiv = <div id="my-div" title="my div">这是一个div元素</div>
 
 ReactDOM.render(myDiv, document.getElementById("app"))
 ```
 index.html：
 ```
 <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta http-equiv="X-UA-Compatible" content="ie=edge">
     <title>Document</title>
 </head>
 <body>
     <h1>首页</h1>
     <div id="app"></div>
 </body>
 </html>
 ```
 ## 文件夹结构：
