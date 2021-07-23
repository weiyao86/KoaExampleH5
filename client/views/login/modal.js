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
        this.setState({ visible: true }, () => {
            this.watchVisible();
        });
    }

    close = () => {
        this.setState({ visible: false, aniActive: false });
    }

    destory = () => {
        this.props.okPress();
        this.props.cancelPress();
    }

    watchVisible = (visible) => {
        if (this.aniRef) {
            this.aniRef.removeEventListener("transitionend", this.onAnimationEnd.bind(this));
            this.aniRef.removeEventListener("animationend", this.onAnimationEnd.bind(this));
            this.aniRef.addEventListener("transitionend", this.onAnimationEnd.bind(this));
            this.aniRef.addEventListener("animationend", this.onAnimationEnd.bind(this));
        }
    }

    onAnimationEnd = () => {
        const { visible } = this.state;

        this.setState({ aniActive: true }, () => {
            if (!visible) {
                this.destory();
            }
        });
    }

    componentDidMount() {
        const { visible } = this.state;
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.visible && this.props.visible) {
            this.show();
        }
        else if (prevProps.visible && !this.props.visible && this.state.visible) {
            this.close();
        }
    }

    render() {
        const { visible, aniActive } = this.state;
        const { title, content, okText, cancelText } = this.props;

        const mastAniCls = visible ? 'fade-in' : 'fade-out';
        const dialogAniCls = visible ? 'zoom-in' : 'zoom-out';

        if (!visible && aniActive) {
            return null;
        }
        return ReactDom.createPortal(<div id="test-way" className={cn(`${prefixCls}`)} ref={(e) => (this.modalRef = e)}>
            <div className={cn(`${prefixCls}-mask`, mastAniCls)} onClick={this.close}></div>
            <div className={cn(`${prefixCls}-dialog`, dialogAniCls)} ref={(e) => (this.aniRef = e)}>
                <p className={cn(`${prefixCls}-dialog-title`)}>
                    {title}
                </p>
                <div className={cn(`${prefixCls}-dialog-content`)}>
                    {this.props.children ? this.props.children : content}
                </div>
                <div className={cn(`${prefixCls}-dialog-footer`)}>
                    <button className={cn(`${prefixCls}-dialog-button-primary`)} onClick={this.close}>{okText}</button>
                    <button className={cn(`${prefixCls}-dialog-button-primary`)} onClick={this.close}>{cancelText}</button>
                </div>
            </div>
        </div>, document.body);

    }
}
export default Class;