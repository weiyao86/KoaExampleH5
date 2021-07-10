import React from 'react';
import { message, Button, Avatar, Divider } from 'antd';

class Class extends React.Component {
  state = {
    imgUrl: '',
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

  render() {
    const { imgUrl } = this.state;
    return (
      <div>
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
      </div>
    );
  }
}

export default Class;
