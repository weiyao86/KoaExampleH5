// import { Spin } from 'antd';
import { connect } from 'dva';

const appInstance = window.AppInstance;
const modelsCache = {};
//the model only load once
const registerModel = (model) => {
  if (model.namespace && !modelsCache[model.namespace]) {
    window.AppInstance.model(model);
    modelsCache[model.namespace] = 1;
  }
};

export default function asyncComponent(cmp) {
  class AsyncCmp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
        model: null,
        error: '',
      };
    }

    componentDidMount() {
      const { globalModel } = this.props;
      const cmpMethod = cmp();

      // 返回异步组件及model
      const { entry = null, models = [] } = cmpMethod;

      Promise.all([entry, ...models])
        .then((arr) => {
          let c = arr.shift();

          arr = arr.map((item) => {
            let itemDefault = item && item.default;
            registerModel(itemDefault);
            return itemDefault;
          });

          this.setState({
            component: c.default ? c.default : c,
            model: arr,
          });
        })
        .catch((err) => {
          console.log('catch', err);
          this.setState({ error: '加载错误!请重新刷新页面' });
        });
    }

    render() {
      const { error, component: C } = this.state;
      if (error) {
        return error;
      }
      return C ? <C {...this.props} /> : <div>Loading...</div>;
    }
  }

  return AsyncCmp;
}
