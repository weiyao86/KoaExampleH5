import ReactDOM from 'react-dom';
import { Icon, TabBar, Cell, Button } from 'zarm';
import { connect } from 'dva';
import './style.less';

const TabIcon = Icon.createFromIconfont('//at.alicdn.com/t/font_1340918_lpsswvb7yv.js');
@connect((state) => state)
class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'home',
      visible: true,
    };
  }

  //Context 使用
  // static contextType  = GlobalContext;
  componentDidMount() {
  }

  render() {
    const { visible ,activeKey} = this.state;

    return (
      <>
      <Cell
        description={
          <Button
            size="xs"
            onClick={() => {
              this.setState({visible:!visible})
            }}
          >
            {visible ? '隐藏' : '展示'}
          </Button>
        }
      >
        隐藏 | 展示
      </Cell>

      <TabBar visible={visible} activeKey={activeKey} onChange={(activeKey)=>this.setState({activeKey:activeKey})}>
        <TabBar.Item itemKey="home" title="主页" icon={<TabIcon type="home" />} />
        <TabBar.Item
          itemKey="found"
          title="保险"
          icon={<TabIcon type="insurance" />}
          badge={{ shape: 'circle', text: '3' }}
        />
        <TabBar.Item
          itemKey="me"
          title="我的"
          icon={<TabIcon type="user" />}
          badge={{ shape: 'dot' }}
        />
      </TabBar>
    </>
    );
  }
}
export default Class;
