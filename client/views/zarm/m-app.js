// import 'core-js/es6/set';
// import 'core-js/es6/map';//core-js/es6/set  @2.x版本无问题，@3.x版本无效
import React from 'react';
import ReactDom from 'react-dom';
import dva from 'dva';
import { StaticRouter, BrowserRouter } from 'dva/router';
import createHistory from 'history/createBrowserHistory';
import models from '@Client/models/index';
import routerConfig,{mobileRouterConfig} from '@Client/router';
import { ConfigProvider, Button } from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
import Layout from './layout';

// import './resource/style/frame.less';

const history = createHistory();
const app = dva({
  initialState: 'globalState',
  history,
});

// 2. Plugins
// app.use({});

// 3.use.model
models.forEach((model) => {
  if (model.namespace == 'global') {
    model.state = { ...model.state, ...{ test: 'testName' } };
  }
  app.model(model);
});

window.AppInstance = app;

// 4.Router

app.router((props) => (
  <BrowserRouter>
      <Layout app={props.app} routerConfig={mobileRouterConfig}></Layout>
  </BrowserRouter>
));

// 5.start

const App = app.start();

let renderMethod;
//入口需配置需热更新文件
if (module.hot) {
  module.hot.accept();
  renderMethod = ReactDom.render;
} else {
  renderMethod = ReactDom.hydrate;
}

renderMethod(<ConfigProvider locale={zhCN}><App /></ConfigProvider>, document.getElementById('app'));

//配置热更新模块，无刷新[需配置devServer]
// if (module.hot) {
//   module.hot.accept('./demo.js', function () {
//     console.log('module.hot.accept')
//   })
//   module.hot.accept('./index.js', function () {
//     console.log('module.hot.accept.index')
//   })
// }
