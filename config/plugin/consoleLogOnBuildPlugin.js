//自定义插件
const chalk = require('chalk'); /* console 颜色 */
const slog = require('single-line-log'); /* 单行打印 console */
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';
class ConsoleLogOnBuildWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  beginCompile() {
    const lineSlog = slog.stdout;
    let text = '开始编译：';
    /* 记录开始时间 */
    this.starTime = new Date().getTime();
    this.timer = setInterval(() => {
      text += '█';
      lineSlog(chalk.green(text));
    }, 50);
  }

  //实现apply
  apply(compiler) {
    /**
     * Monitor file change 记录当前改动文件
     */
    compiler.hooks.watchRun.tap(pluginName, (watching) => {
      const changeFiles = watching.watchFileSystem.watcher.mtimes;
      for (let file in changeFiles) {
        console.log(chalk.green('当前改动文件：' + file));
      }
    });

    /**
     *  before a new compilation is created. 开始 compilation 编译 。
     */
    compiler.hooks.compile.tap(pluginName, () => {
      this.beginCompile();
    });

    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建过程开始！');
    });
    //在 webpack 选项中的 entry 配置项 处理过之后，执行插件
    compiler.hooks.entryOption.tap(pluginName, (compilation) => {
      console.log('webpack 在 webpack 选项中的 entry 配置项 处理过之后，执行插件！');
    });
    //在 webpack 选项中的
    compiler.hooks.failed.tap(pluginName, (compilation) => {
      console.log('webpack failed ============================>');
    });
    //在 webpack 选项中的
    compiler.hooks.done.tap(pluginName, (compilation) => {
      console.log('webpack done ============================>');
      this.timer && clearInterval(this.timer);
      const endTime = new Date().getTime();
      const time = (endTime - this.starTime) / 1000;
      console.log(chalk.yellow(' 编译完成'));
      console.log(chalk.yellow('编译用时：' + time + '秒'));
    });
  }
}

module.exports=ConsoleLogOnBuildWebpackPlugin;
