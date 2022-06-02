import React from 'react';
import { message, Button, Avatar, Divider } from 'antd';
import CustomTabs, { CustomTabPane } from './components/tabs';
import ProviderPage, { GlobalContext, Provider, Consumer } from '@Client/components/globalContext';
import classnames from 'classnames';
import Modal from './modal';
import TestContext from './testContext';
import TestContext1 from './testContext1';
import './style.less';


class Class extends React.Component {
  state = {
    imgUrl: '',
    visible: false,
    touchs: 0, iv: 'ivtest'
  };

  constructor(props) {
    super(props);
    this.scale = 1;
    this.startScale = 1;
    this.moveX = 0;
    this.moveY = 0;
  }

  downLoad = () => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (req) => {
      console.log(xhr.readyState, XMLHttpRequest.DONE);
      const { status, readyState } = xhr;
      if (readyState == XMLHttpRequest.DONE && (status === 0 || (status >= 200 && status < 400))) {
        let rst = req.target.response;
        //m1
        this.downByFileReader(rst);
        //m2
        // this.downByBlobUrl(rst);
      }
    };
    xhr.responseType = 'blob';
    xhr.open('GET', 'http://gsg-imgpvs.oss-cn-hangzhou.aliyuncs.com/export/gs_company/20210507/16203790356058tj2ar.jpeg');
    xhr.send();
  };

  downByFileReader = (blob) => {
    let fs = new FileReader();
    fs.onload = ({ target }) => {
      let base64 = target.result;
      this.setState({ imgUrl: base64 });
      let aLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      let isSupport = 'download' in aLink;
      alert('support the download attribute?------' + isSupport);

      aLink.href = base64;
      aLink.download = '16203790356058tj2ar.jpeg';
      aLink.click();
    };
    fs.readAsDataURL(blob);
  };

  downByBlobUrl = (blob) => {
    let u = window.URL || window.webkitURL || window;
    let voke = u.createObjectURL(blob);
    this.setState({ imgUrl: voke });
    // let aLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    let aLink = document.createElement('a');
    let isSupport = 'download' in aLink;
    alert('support the download attribute?------' + isSupport);
    aLink.href = voke;
    aLink.download = '1.jpeg';
    aLink.click();
    // document.body.appendChild(aLink);
    setTimeout(() => u.revokeObjectURL(voke), 3000);
  };

  //上传
  upload = ({ target }) => {
    let file = target.files[0];
    this.downByFileReader(file);
  };


  onOpenModal = () => {
    this.setState({ visible: true });
  }

  getDistance = (touches) => {
    if (touches.length != 2) return 0;
    const [first, second] = touches;
    return Math.sqrt(Math.pow(second.pageX - first.pageX, 2) + Math.pow(second.pageY - first.pageY, 2));
  }

  setScale = ({ scale, top = 0, left = 0 }) => {
    this.scaleImgRef.style.transform = `scale(${scale}) translate(${left}px,${top}px)`;
  }
  getTouches = (e) => {
    const { changedTouches, targetTouches, touches } = e;
    const len = targetTouches.length + '--' + changedTouches.length + '--' + touches.length;
    this.setState({ touchs: len })
  }

  resetTouchStatus = () => {
    this.deltaX = 0;
    this.deltaY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  touchStart = (e) => {

    const { changedTouches, targetTouches, touches, target } = e;

    let offsetX = this.offsetX === void 0 ? 0 : this.offsetX;
    //记录初始坐标
    this.resetTouchStatus();
    this.moving = targetTouches.length == 1 && this.scale != 1;
    //是否两指非移动
    this.zooming = targetTouches.length == 2 && !offsetX;

    //起点坐标
    this.startX = targetTouches[0].pageX;
    this.startY = targetTouches[0].pageY;
    this.startMoveX = this.moveX;
    this.startMoveY = this.moveY;
    //缩放操作
    if (this.zooming) {
      //初始半径
      this.startRadius = this.getDistance(targetTouches);
      this.startScale = this.scale;
      console.log(this.startX, this.startY, this.startRadius)
    }
    this.scaleImgRef.addEventListener('touchmove', this.touchMove.bind(this));
    this.scaleImgRef.addEventListener('touchend', this.touchEnd.bind(this));
  }
  touchMove = (e) => {
    if (this.zooming || this.moving) {
      e.preventDefault();
    }
    let offsetX = this.offsetX;
    const { changedTouches, targetTouches, touches, target } = e;

    //记录坐标点
    this.deltaX = targetTouches[0].pageX - this.startX;
    this.deltaY = targetTouches[0].pageY - this.startY;
    this.offsetX = Math.abs(this.deltaX);
    this.offsetY = Math.abs(this.deltaY);

    if (this.moving) {
      this.moveX = this.deltaX + this.startMoveX;
      this.moveY = this.deltaY + this.startMoveY;
    }

    if (targetTouches.length == 2 && this.zooming) {

      let radius = this.getDistance(targetTouches);
      this.scale = this.startScale * radius / this.startRadius;
      this.setState({ touchs: this.scale < 1 ? 1 : this.scale })
    }
    let scale = this.scale < 1 ? 1 : this.scale;
    this.setScale({
      scale,
      top: this.moveY / scale,
      left: this.moveX / scale,
    });

  }
  touchEnd = (e) => {
    const { changedTouches, targetTouches, touches, target } = e;
    if (!targetTouches.length) {
      this.startMoveX = this.startMoveY = 0;
      this.startScale = 1;
    }
    e.stopPropagation();
    if (this.zooming) {
      this.zooming = false;
    }
    if (this.moving) {
      this.moving = false;
    }

    this.scaleImgRef.removeEventListener('touchmove', this.touchMove.bind(this));
    this.scaleImgRef.removeEventListener('touchend', this.touchEnd.bind(this));
    this.resetTouchStatus();
  }

  componentDidMount() {
    if (this.scaleImgRef) {
      this.scaleImgRef.addEventListener('touchstart', this.touchStart.bind(this));

      // alert(this.orignWidth+'//'+this.orignHeight)
    }

  }


  render() {
    const { imgUrl, visible, touchs } = this.state;
    const cfg = {
      visible,
      content: '自定义modal',
      title: 'title',
      okText: '好的',
      cancelText: '取消',
      okPress: () => { this.setState({ visible: false }) },
      cancelPress: () => { this.setState({ visible: false }) },
    }
    console.log(classnames({
      'test': true,
      'active': true
    }))
    console.log('this.context', this.context)
    return (
      <ProviderPage>
        <div className="custom-page">

          <CustomTabs>
            <CustomTabPane
              tab={<div>title1</div>}
            >
              <TestContext1>
                <span style={{ color: '#f00', 'fontWeight': 'bold', 'fontSize': 40 }}> 测试Context中contextType属性</span>
              </TestContext1>
            </CustomTabPane>
            <CustomTabPane
              tab={<div>title3</div>}
            >
              <input type='text' defaultValue={'this is a defaultTValue'}></input>
              <select ref="selectRef" value={this.state.sv} multiple={true} onChange={v => {

                let { options } = v.target;
                var arr = Object.keys(options).filter(ck => options[ck].selected).map(i => options[i].value);

                console.log('vvv', arr)
                this.setState({
                  sv: arr
                })
              }}>
                <option value="1">tttt</option>
                <option value="2">1111</option>
                <option value="3">2222</option>
                <option value="4">2222</option>
                <option value="5">2222</option>
                <option value="6">2222</option>
              </select>
              <input
                defaultValue={this.state.iv}
                onChange={e => {
                  this.setState({ iv: e.target.value.toUpperCase() })
                }}
              />

              <TestContext>
                <span style={{ color: '#f00', 'fontWeight': 'bold', 'fontSize': 40 }}> 测试Context中Consumer组件</span>
              </TestContext>
            </CustomTabPane>

          </CustomTabs >

          <label ref="labelRef" style={{ background: '#000', color: '#fff', padding: 20, margin: 20 }}>
            看我上传文件后再下载
            <input type='file' onChange={(e) => this.upload(e)} style={{ display: 'none' }} />

          </label>
          <Avatar src={imgUrl} size={{ xs: 124, sm: 132, md: 140, lg: 164, xl: 180, xxl: 200 }} />
          <Divider plain>Text</Divider>
          <Button type='primary' onClick={() => this.downLoad()}>
            my-Blob
          </Button>
          <Divider plain>my-Blob</Divider>
          <a href='/downloadFile' target='_blank'>
            ******下载流******
          </a>
          <Divider plain>下载流</Divider>
          <Button type='primary' onClick={() => this.onOpenModal()}>
            弹出Modal
          </Button>
          <Divider plain>自定义Modal</Divider>

          <Divider plain>图片放大缩小</Divider>
          <div>
            <p>图片放大缩小****{touchs}</p>
            <div className="legend-wrap">
              <div className="legend" ref={(e) => this.scaleImgRef = e} style={{ background: `url(${imgUrl})no - repeat center / contain transparent` }}>
                <img src={imgUrl} />
              </div>
            </div>
          </div>
          <Modal {...cfg}>
            这是自定义children
          </Modal>
        </div >
      </ProviderPage>
    );
  }
}

export default Class;
