import React from 'react';
import ReactDom from 'react-dom';
import cn from 'classnames';
import './style.less';
const prefixCls = 'wey-modal';
class Class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            aniActive: true
        }
    }
    static defaultProps = {
        content: '自定义modal',
        title: 'title',
        okText: '好的',
        cancelText: '取消',
        okPress: () => { },
        cancelPress: () => { },
    }

    show = () => {

        this.setState({ visible: true, aniActive: true })
    }

    close = () => {
       
        this.setState({ visible: false,aniActive: false });
    }

    destory = () => {
        // this.watchVisible(false);
        this.setState({ aniActive: true }, () => {
            console.log('close')

            this.props.okPress();
            this.props.cancelPress();
        });
    }

    // watchVisible = (visible) => {
    //     if (this.aniRef) {
    //         this.tempVisible=visible;
    //         if (visible) {
                
    //             this.aniRef.addEventListener("transitionend", this.onAnimationEnd);
    //             this.aniRef.addEventListener("animationend", this.onAnimationEnd);

    //         } else {
    //             debugger;
    //             this.aniRef.removeEventListener("transitionend", this.onAnimationEnd);
    //             this.aniRef.removeEventListener("animationend", this.onAnimationEnd);
    //         }
    //     }
    // }

    onAnimationEnd = () => {
        const { visible } = this.state;
        console.log('aniActive')
        if (!visible) {
            this.destory();
        }
    }

    componentDidMount() {
        const { visible } = this.state;
        console.log('componentDidMount');
        if (visible) {
            this.setState({ aniActive: true });
        }
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
    }


    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.visible && this.props.visible) {
            this.show();
        }
        else if (prevProps.visible && !this.props.visible && this.state.visible) {
            console.log('exit', this.state.visible);
            this.close();
        }
    }

    render() {
        const { visible, aniActive } = this.state;

        const mastAniCls = visible ? 'fade-in' : 'fade-out';
        const dialogAniCls = visible ? 'zoom-in' : 'zoom-out';

        if (!visible && aniActive) {
            return null;
        }
        console.log(visible)
        return ReactDom.createPortal(<div className={cn(`${prefixCls}`)} ref={(e) => (this.modalRef = e)}>
            <div className={cn(`${prefixCls}-mask`, mastAniCls)}></div>
            <div className={cn(`${prefixCls}-dialog`, dialogAniCls)} ref={(e) => (this.aniRef = e)} onAnimationEnd={this.onAnimationEnd}>
                <p className={cn(`${prefixCls}-dialog-title`)}>
                    MODAL
                </p>
                <div className={cn(`${prefixCls}-dialog-content`)}>
                    CONTENT
                    <button onClick={this.close}>Close</button>
                </div>
            </div>
        </div>, document.body);

    }
}
export default Class;