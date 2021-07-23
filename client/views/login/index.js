import React from 'react';
import { message, Button, Avatar, Divider } from 'antd';
import Modal from './modal';
import './style.less';
class Class extends React.Component {
  state = {
    imgUrl: '',
    visible: false,
    touchs: 0
  };

  downLoad = () => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (req) => {
      console.log(xhr.readyState, XMLHttpRequest.DONE);
      const { status, readyState } = xhr;
      if (readyState == XMLHttpRequest.DONE && (status === 0 || (status >= 200 && status < 400))) {
        let rst = req.target.response;
        //m1
        // this.downByFileReader(rst);
        //m2
        this.downByBlobUrl(rst);
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
    let fs = new FileReader();
    fs.onload = ({ target }) => {
      let base64 = target.result;
      this.setState({ imgUrl: base64 });
      let a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      a.href = base64;
      a.download = file.name;
      a.click();
    };
    fs.readAsDataURL(file);
  };

  onOpenModal = () => {
    this.setState({ visible: true });
  }

  getTouches = (e) => {
    const { changedTouches, targetTouches, touches } = e;
    const len = targetTouches.length + '--' + changedTouches.length + '--' + touches.length;
    this.setState({ touchs: len })
  }

  touchStart = (e) => {
    console.log('touchStart', e);
    // this.getTouches(e);
    this.orignWidth = this.scaleImgRef.clientWidth;
    this.orignHeight = this.scaleImgRef.clientHeight;
    const { changedTouches, targetTouches, touches, target } = e;
    if (targetTouches.length != 2) return;

    this.first = targetTouches[0];
    this.second = targetTouches[1];
    this.startX = target.offsetLeft;
    this.startY = target.offsetTop;
    console.log(this.startX, this.startY)
    this.scaleImgRef.addEventListener('touchmove', this.touchMove.bind(this));
    this.scaleImgRef.addEventListener('touchend', this.touchEnd.bind(this));
  }
  touchMove = (e) => {
    // console.log('touchMove', e);
    e.stopPropagation();
    e.preventDefault();
    // this.getTouches(e);
    const { changedTouches, targetTouches, touches, target } = e;
    if (targetTouches.length != 2) return;
    const newFirst = targetTouches[0];
    const newSecond = targetTouches[1];

    let startRadius = Math.sqrt(Math.pow(this.second.pageX - this.first.pageX, 2) + Math.pow(this.second.pageY - this.first.pageY, 2));
    let radius = Math.sqrt(Math.pow(newSecond.pageX - newFirst.pageX, 2) + Math.pow(newSecond.pageY - newFirst.pageY, 2));
    this.scale = Math.sqrt(radius / startRadius) * 1;
    this.setState({ touchs: this.scale })

    this.scaleImgRef.style.transform = `scale(${this.scale})`;
    console.log('move', this.scaleImgRef.clientWidth)

  }
  touchEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    // console.log('touchEnd', e);
    // this.getTouches(e);
    console.log('end', this.scaleImgRef.clientWidth)
    this.scaleImgRef.style.width=this.scale*this.orignWidth+'px';
    this.scaleImgRef.style.height=this.scale*this.orignHeight+'px';
    console.log('end',this.scaleImgRef.clientWidth)
    this.scaleImgRef.removeEventListener('touchmove', this.touchMove.bind(this));
    this.scaleImgRef.removeEventListener('touchend', this.touchEnd.bind(this));
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
    return (
      <div className="custom-page">
        <label style={{ background: '#000', color: '#fff', padding: 20, margin: 20 }}>
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
          下载流
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
            <div className="legend" ref={(e) => this.scaleImgRef = e} style={{ background: `url(${imgUrl})no-repeat center/contain transparent` }}>
              {/* <img src={imgUrl} /> */}
            </div>
          </div>
        </div>
        <Modal {...cfg}>
          这是自定义children
        </Modal>
      </div>
    );
  }
}

export default Class;
