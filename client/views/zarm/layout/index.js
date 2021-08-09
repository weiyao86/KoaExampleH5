import { Switch, Route, withRouter, Link } from 'dva/router';
import { matchRoutes } from 'react-router-config';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './style.less';

@withRouter
class Class extends React.Component {

  initSetRoute(routes) {
    let arr = [];
    if (Array.isArray(routes)) {
      routes.forEach((item) => {
        const nextRoute = Array.isArray(item.routes) ? item.routes : item;
        const temp = this.initSetRoute(nextRoute);
        arr = [...arr, ...temp];
      });
    } else {
      arr.push(<Route
        path={routes.path}
        key={routes.path}
        exact={routes.exact}
        strict={routes.strict}
        render={props => (routes.render ? routes.render({ ...props, routes }) : <routes.component {...props} routes={routes} />)}
      />);
    }
    return arr;
  }

  render() {
    const { app, routerConfig, history } = this.props;

    // 递归设置路由
    const setRouter = this.initSetRoute(routerConfig);

    return (
      <div className="page-contant">
        <Switch>
          {setRouter}
        </Switch>
      </div>

    );
  }
}
export default Class;
