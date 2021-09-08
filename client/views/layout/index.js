import { Switch, Route, withRouter, Link } from 'dva/router';
import { matchRoutes } from 'react-router-config';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { getBreadcrumbs } from '@Client/components/breadCrumbs';
import { GlobalContext, GlobalData } from '@Client/components/globalContext';
import './style.less';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const ANIMATION_MAP = {
  PUSH: 'forward',
  POP: 'back',
};

@withRouter
class Class extends React.Component {
  flattenRouters = (arr) =>
    arr.reduce((prev, item) => {
      const isArray = Array.isArray(item.routes);
      prev.push(item);
      return isArray ? prev.concat(this.flattenRouters(item.routes)) : prev;
    }, []);

  routeWithSubRoutes(route) {
    // <Route component>：在地址匹配的时候React的组件才会被渲染，route props也会随着一起被渲染；

    // <Route render>：这种方式对于内联渲染和包装组件却不引起意料之外的重新挂载特别方便；

    // <Route children>：与render属性的工作方式基本一样，除了它是不管地址匹配与否都会被调用；

    return (
      <Route
        key={route.path}
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        // children={(props) =><route.component {...props} routes={route.routes} className='fade' />}
        render={(props) => (route.render ? route.render({ ...props, route }) : <route.component {...props} routes={route.routes} className='fade' />)}
      />
    );
  }

  initSetRoute(routes) {
    let arr = [];
    if (Array.isArray(routes)) {
      routes.forEach((item) => {
        const nextRoute = Array.isArray(item.routes) ? item.routes : item;
        const temp = this.initSetRoute(nextRoute);
        arr = [...arr, ...temp];
      });
    } else {
      arr.push(
        <Route
          path={routes.path}
          key={routes.path}
          exact={routes.exact}
          strict={routes.strict}
          render={(props) => (routes.render ? routes.render({ ...props, routes }) : <routes.component {...props} routes={routes} />)}
        />
      );
    }
    return arr;
  }
  initDynamicMenu = (routes) => {
    let menu = [];
    routes.map((item) => {
      if (Array.isArray(item.routes)) {
        const m = (
          <SubMenu
            key={item.path}
            title={
              <span>
                <Icon type='user' />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.initDynamicMenu(item.routes)}
          </SubMenu>
        );
        menu = [...menu, m];
      } else {
        menu.push(
          <Menu.Item key={item.path} to={item.path}>
            {item.title}
          </Menu.Item>
        );
      }
      return [];
    });

    return menu;
  };

  render() {
    const { app, routerConfig, history } = this.props;

    // 面包屑
    this.breadcrumbs = getBreadcrumbs(routerConfig, this.props.location);

    // 菜单重组
    const curRouterConfig = this.flattenRouters(routerConfig);

    // 递归设置路由
    const setRouter = this.initSetRoute(routerConfig);

    // 加载菜单
    const menu = this.initDynamicMenu(routerConfig);

    // 加入递归查询
    const curRoute = matchRoutes(curRouterConfig, this.props.location.pathname);
    // 设置当前选中菜单
    const stKey = (curRoute[0] && curRoute[0].route.path) || '/';

    // return (
    //   <div className='layout-main'>
    //     <TransitionGroup className='todo-list' childFactory={(child) => React.cloneElement(child, { classNames: history.action })}>
    //       <CSSTransition in={true} timeout={300} classNames='fade' key={location.pathname} unmountOnExit>
    //         <Switch>{curRouterConfig.map((route, i) => this.routeWithSubRoutes(route))}</Switch>
    //       </CSSTransition>
    //     </TransitionGroup>
    //   </div>
    // );
    return (
      //使用Context
      // <GlobalContext.Provider value={GlobalData}> {/* </GlobalContext.Provider> */}
      <Layout>
        <Header className='header'>
          <div className='logo'>Logo</div>
          <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['2']}>
            <Menu.Item key='1'>nav 1</Menu.Item>
            <Menu.Item key='2'>nav 2</Menu.Item>
            <Menu.Item key='3'>nav 3</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} className='site-layout-background' collapsible>
            <Menu
              mode='inline'
              style={{ height: '100%', borderRight: 0 }}
              // defaultSelectKeys={['/']}
              selectedKeys={[stKey]}
              onClick={(item, key, keyPath, domEvent) => {
                //传参四方式
                //地址栏无显示
                // this.props.history.push({pathname:item.key,query:{name:'jack',age:19}});
                // this.props.history.push({pathname:item.key,state:{value:'i am the state'}});
                //保留地址
                this.props.history.push({ pathname: item.key, search: 'tttttt' });
                //report/:id
              }}
            >
              {menu}
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb
              style={{ margin: '16px 0' }}
              itemRender={(route, params, routes, paths) => {
                const last = routes.indexOf(route) === routes.length - 1;
                return last ? (
                  <span>{route.breadcrumbName}</span>
                ) : (
                  <Link to={route.path}>
                    {route.path === '/' && <Icon type='home' />}
                    {route.breadcrumbName}
                  </Link>
                );
              }}
              routes={this.breadcrumbs}
            />

            <Content
              className='site-layout-background'
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Switch>{setRouter}</Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
export default Class;
