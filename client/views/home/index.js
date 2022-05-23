import { Link, Route } from 'dva/router';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import { Button, Modal, Progress } from 'antd';
import { DialogPop } from 'weui-react-v2';
import React from 'react';
import HtmlToPdf from '@Client/components/html-to-pdf';
import _ from 'lodash';
// import { Picker, List, WhiteSpace } from 'antd-mobile';
import './style.less';

let TweenOneGroup = TweenOne.TweenOneGroup;

class Fun extends React.Component {
  render() {
    return <div>test</div>;
  }
}

const queue = (function () {
  let pending = [];

  function next(p) {
    let fn = pending.shift();
    if (fn) {
      fn(next);
    }
  }

  return {
    add: function (fn) {
      if (typeof fn === 'function') pending.push(fn);
    },

    getQueue: function () {
      return pending;
    },

    clear: function () {
      pending.length = 0;
    },

    trigger: function () {
      next();
    },
  };
})();

const judge = {
  getType: v => Object.prototype.toString.call(v).slice(8, -1).toLowerCase(),
  isFunction: v => judge.getType(v) === 'function',
  isObject: v => judge.getType(v) === 'object',
  isArray: v => judge.getType(v) === 'array',
  isNumber: v => judge.getType(v) === 'number',
  isString: v => judge.getType(v) === 'string',
}


class Class extends React.Component {
  state = {
    star: false,
    current: 0,
    visible: false
  };

  timeTotal = 5 * 1000;
  calcCount = 0;
  timer = null;

  setRandom(size = 10, sum = 100) {
    let csize = size - 1;
    let csum = sum;
    let arr = [];
    while (csize--) {
      let rad = Math.ceil(Math.random() * (csum / 2));
      arr.push(rad);
      csum -= rad;
    }
    arr.push(csum);
    return arr;
  }

  doneByTime({ next, totalTime, percent, cb }) {
    let startLoop = +new Date();
    let count = 0;
    let delay = 16.733;
    let prev = 0;

    let begin = () => {
      let now = +new Date();
      let sub = now - startLoop;
      sub >= totalTime && (sub = totalTime);
      let cur = sub / totalTime;

      let percentByms = percent * cur;
      this.calcCount += percentByms - prev;
      this.setState({ current: this.calcCount });

      if (cur < 1) {
        let nextTime = delay - (now - (startLoop + count * delay));
        if (nextTime < 0) {
          nextTime = 0;
        }
        this.timer = setTimeout(begin, Math.min(delay, nextTime));
      } else {
        clearTimeout(this.timer);
        typeof cb == 'function' && cb(`进度条值:${percent}--总进度:${this.calcCount}---次数:${count}---块时间:${totalTime}`);
        next();
      }

      prev = percentByms;
      count++;
    };
    begin();
  }

  onStart = () => {
    let self = this;
    this.calcCount = 0;
    let random = this.setRandom();

    clearTimeout(this.timer);
    queue.clear();
    random.forEach((curPercent, idx) => {
      let curTime = (curPercent / 100) * this.timeTotal;
      queue.add(function (next) {

        console.log(`当前步骤=>${idx + 1}`);

        self.doneByTime({
          next,
          totalTime: curTime,
          percent: curPercent,
          cb: (msg) => {
            console.log(msg + `---步骤${idx + 1}`);
            if (queue.getQueue().length == 0) {
              console.timeEnd('time');
              self.setState({ current: 100 });
            }
          },
        });
      });
    });

    console.time('time');
    queue.trigger();
  };

  onShowModal = () => {
    this.setState({ visible: !this.state.visible })

  }

  isObjectEqualComplex = (source, comparison) => {
    const flag = data => ['object', 'array'].includes(judge.getType(data));
    if (!flag(source)) {
      throw new Error(`source should be a Object or Array, but got ${judge.getType(source)}`);
    }
    if (judge.getType(source) !== judge.getType(comparison)) return true;

    const sourceKeys = Object.keys(source);
    const comparisonKeys = Object.keys({ ...source, ...comparison });

    if (sourceKeys.length !== comparisonKeys.length) return true;

    return comparisonKeys.some((key) => {
      if (flag(source[key])) {
        return this.isObjectEqualComplex(source[key], comparison[key]);
      } else {
        return source[key] !== comparison[key];
      }
    });
  }

  componentDidMount() {
    let test = [{ name: 'test' }, 1, 24, 5];
    let copy = _.cloneDeep(test);
    // copy[0].name = '432';
    // debugger;
    let s = this.isObjectEqualComplex(test, copy);
    console.log(s)
  }

  showModal = () => {
    // this.setIsModalVisible(true);
    Modal.confirm();
    // DialogPop({
    //   title: '对话框标题',
    //   children: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
    //   onConfirm: () => {
    //     return new Promise((resolve) => {
    //       setTimeout(() => {
    //         resolve(true);
    //       }, 2000);
    //     });
    //   },
    // });
  };

  handleOk = () => {
    this.setIsModalVisible(false);
  };

  handleCancel = () => {
    this.setIsModalVisible(false);
  };

  setIsModalVisible(type) {
    this.setState({ visible: type });
  }

  render() {
    const { current } = this.state;
    return (
      <>
        <h2 className="wrap">Home</h2>
        <QueueAnim
          // className="wrap-modal"
          animConfig={[
            { left: ['0%', '100%'], opacity: [1, 0] },
          ]}
        >
          {this.state.visible ? [<div key="a" className="wrap-modal" onClick={this.handleCancel}>进出场动画</div>] : null}

        </QueueAnim>

        <Button onClick={() => this.onShowModal()}>进出场动画</Button>
        <Button onClick={() => this.onStart()}>Progress</Button>
        <Progress
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          percent={current}
        />
        <HtmlToPdf></HtmlToPdf>
        <Button onClick={() => this.setState(this.showModal)}>Modal</Button>
        {/* <Picker
          data={[{value: '1', label: '5'}, {value: '2', label: '51'}, {value: '3', label: '52'}]}
          key={'ttt'}
          cols={1}
          onOk={
          (e) => {

          }
        }
        >
          <List.Item arrow="horizontal">Single</List.Item>
        </Picker>
         */}
        {/* <Modal title="Basic Modal" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal> */}
        {/* <img src={toolsPng} alt="" /> */}
      </>
    );
  }
}
export default Class;
