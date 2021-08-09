import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'dva';
import './style.less';

@connect((state) => state)
class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      star: false,
    };

    //监听地址变化
    // this.unlisten = this.props.history.listen((location, action) => {
    //   if (location.pathname !== this.state.location.pathname) {
    //     this.setState({defaultSelectKeys: [location.pathname], location});
    //   }
    // });
  }

  //Context 使用
  // static contextType  = GlobalContext;
  componentDidMount() {
  }

  render() {
    const { star } = this.state;

    return (
      <>
        <p>start</p>
        home
        <div className='star'>⭐</div>
      </>
    );
  }
}
export default Class;
