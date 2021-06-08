// import 'core-js/es6/set';
// import 'core-js/es6/map';//core-js/es6/set  @2.x版本无问题，@3.x版本无效
import React from 'react';
import ReactDom from 'react-dom';
import dva from 'dva';
import { StaticRouter, BrowserRouter } from 'dva/router';
import createHistory from 'history/createBrowserHistory';
import models from '@Client/models/index';
import routerConfig from '@Client/router';
import Layout from './views/layout';
import $ from 'jquery'; //测试外部externals
import './resource/style/index.css';
import './resource/style/index.scss';
import './resource/style/index.less';
import './resource/style/frame.less';

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
      <Layout app={props.app} routerConfig={routerConfig}></Layout>
  </BrowserRouter>
));

// 5.start

const App = app.start();

ReactDom.render(<App />, document.getElementById('app'));

//配置热更新模块，无刷新[需配置devServer]
// if (module.hot) {
//   module.hot.accept('./demo.js', function () {
//     console.log('module.hot.accept')
//   })
//   module.hot.accept('./index.js', function () {
//     console.log('module.hot.accept.index')
//   })
// }
