import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import ProviderPage, { Provider, Consumer } from '@Client/components/globalContext';
import './style.less';
class Class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0
        }
    }

    handleTabClick = () => {

    }
    render() {
        const { className, classPrefix, children } = this.props;
        const classes = classnames(className, 'ui-tabs');
        return <div className={classes}>
            <CustomTabNav
                key="tabBar"
                onTabClick={this.handleTabClick}
                classPrefix={classPrefix}
                activeIndex={this.state.activeIndex}
                panels={children}
            ></CustomTabNav>
            <CustomTabContent
                key="tabcontent"
                classPrefix={classPrefix}
                panels={children}
                activeIndex={this.state.activeIndex}
            ></CustomTabContent>
        </div>
    }
}

//tab 头
const CustomTabNav = class Class extends Component {

    getTabs() {
        const { panels, classPrefix, activeIndex } = this.props;

        return React.Children.map(panels, (child) => {
            if (!child) return;
            const order = parseInt(child.props.order, 10);
            // 利用 class 控制显示和隐藏
            let classes = classnames({
                [`${classPrefix}-tab`]: true,
                [`${classPrefix}-active`]: activeIndex === order,
                [`${classPrefix}-disabled`]: child.props.disabled,
            });
            return (<li
                className={classes}>
                {child.props.tab}
            </li>);
        })
    }
    render() {
        const { children } = this.props;
        return <ul>{this.getTabs()}</ul>
    }
}

//tab 内容
const CustomTabContent = class Class extends Component {

    getTabPanes() {
        const { classPrefix, activeIndex, panels } = this.props;

        return React.Children.map(panels, (child) => {
            if (!child) return;

            const order = parseInt(child, this.props.order, 10) || 0;
            const isActive = activeIndex === order;
            return React.cloneElement(child, {
                classPrefix, isActive, children: child.props.children,
                key: `tabpane-${order}`
            })
        })
    }
    render() {
        const { classPrefix } = this.props;
        const classes = classnames({
            [`${classPrefix}-content`]: true,
        });
        return <div className={classes}>
            {this.getTabPanes()}
        </div>
    }
}

const CustomTabPane = class Class extends Component {

    render() {
        const { classPrefix, className, isActive, children } = this.props;
        const classes = classnames({
            [className]: className,
            [`${classPrefix}-panel`]: true,
            [`${classPrefix}-active`]: isActive,
        });
        return <div
            role="tabpanel"
            className={classes}
            aria-hidden={!isActive}>
            {children}
        </div>
    }
}
export { CustomTabPane };


export default Class;