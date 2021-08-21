import { Switch, Route, withRouter, Link } from 'dva/router';
import { matchRoutes } from 'react-router-config';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Icon, TabBar, Cell, Button } from 'zarm';
import './style.less';

const TabIcon = Icon.createFromIconfont('//at.alicdn.com/t/font_1340918_lpsswvb7yv.js');
@withRouter
class Class extends React.Component {
  flattenRouters = (arr) => {
    return arr.reduce((prev, item) => {
      const isArray = Array.isArray(item.routes);
      prev.push(item);
      return isArray ? prev.concat(this.flattenRouters(item.routes)) : prev;
    }, []);
  };

  state = {
    routes: [],
  };

  componentDidMount() {
    const { routerConfig } = this.props;

    this.setState({ routes: this.flattenRouters(routerConfig) }, () => {});
  }

  initSetRoute(routes) {
    // let arr = [];
    // if (Array.isArray(routes)) {
    //   routes.forEach((item) => {
    //     let temp = null;
    //     if (item.component) {
    //       temp = this.initSetRoute(item);
    //       arr = [...arr, ...temp];
    //     }
    //     if (Array.isArray(item.routes)) {
    //       temp = this.initSetRoute(item.routes);
    //       arr = [...arr, ...temp];
    //     }
    //   });
    // } else {
    // if (routes.customBackHeader) {
    //   //TODO:通用导航栏
    // }

    // arr.push(
    // <Route
    //   path={routes.path}
    //   key={routes.path}
    //   exact={routes.exact}
    //   strict={routes.strict}
    //   render={(props) => (routes.render ? routes.render({ ...props, routes }) : <routes.component {...props} routes={routes} />)}
    // />
    // );
    // }
    // return arr;
    return routes.map((item) => (
      <Route
        path={item.path}
        key={item.path}
        exact={item.exact}
        strict={item.strict}
        render={(props) => (item.render ? item.render({ ...props, item }) : <item.component {...props} routes={item} />)}
      />
    ));
  }

  renderMenu = (curRoute) => (
    <TabBar
      visible={!!curRoute.hasButtonMenu}
      activeKey={curRoute.path}
      onChange={(activeKey) => {
        this.props.history.push(activeKey);
      }}
    >
      <TabBar.Item itemKey='/' title={'主页'} icon={<TabIcon type='home' />} />
      <TabBar.Item itemKey='/work' title='保险' icon={<TabIcon type='insurance' />} badge={{ shape: 'circle', text: '3' }} />
      <TabBar.Item itemKey='/me' title='我的' icon={<TabIcon type='user' />} badge={{ shape: 'dot' }} />
    </TabBar>
  );
  render() {
    const {
      location: { pathname },
    } = this.props;
    const { routes } = this.state;
    if (!routes.length) return null;
    // 递归设置路由
    const setRouter = this.initSetRoute(routes);
    let curRoute = routes.filter((item) => item.path == pathname)[0];
    console.log('curRoute', curRoute);
    return (
      <div className='page-wrap'>
        <Switch>{setRouter}</Switch>
        {this.renderMenu(curRoute)}
      </div>
    );
  }
}
export default Class;
