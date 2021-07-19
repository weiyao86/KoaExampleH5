import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
// import {GlobalContext} from '@Client/components/globalContext';
import { connect } from 'dva';
import Carousel,{ Modal, ModalGateway } from 'react-images'
import toolsPng from '../home/images/tools.png';
import './style.less';

//自定义指令
const withTest = props => WrapCmp => {
  console.log('p', this)
  debugger;
  // return <WrapCmp {...props}></WrapCmp>;
  return class extends React.Component {
    render() {
      // {...this.props}
      return <div>test<WrapCmp {...props}></WrapCmp></div>
    }
  }
}

// @withTest(state=>state)
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

  handleStar = () => {
    this.setState((state) => {
      return {
        star: !state.star,
      };
    });
  };
  //Context 使用
  // static contextType  = GlobalContext;
  componentDidMount() {
    // console.log(this.context, 'context');


    setTimeout(() => {
      ReactDOM.createPortal(<div>test portal</div>, document.body);
      this.props.history.push({ search: `{name:'jack',age:20}` });
      this.setState({})
    }, 2000);
  }

  render() {
    const { star } = this.state;

    return (
      <>
      <ModalGateway>
          <Modal>
            <Carousel views={[{source:toolsPng},{source:toolsPng}]}  />
          </Modal>
        
      </ModalGateway>
        <p onClick={this.handleStar.bind(null, star)}>start</p>
        main
        <div className='star'>⭐</div>
      </>
    );
  }
}
export default Class;
