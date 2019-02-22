import React, { Component } from 'react';
import { util, GBLink } from '../';

class Tabs extends Component {

  constructor(props) {
    super(props);
    this.renderTabPanel = this.renderTabPanel.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.state = {
      selectedTab: props.default || ''
    };
  }

  componentDidMount() {
  }

  async onTabClick(key) {
    const promise = new Promise((resolve, reject) => {
      let validate = true;
      if (typeof this.props.callbackBefore === 'function') {
        validate = this.props.callbackBefore(key);
      }
      resolve(validate);
    });
    let validate = await promise;
    if (validate) {
      this.setState({selectedTab: key});
      if (this.props.callbackAfter) this.props.callbackAfter(key);
    }
  }

  renderTabPanel() {
    const items = [];
    const bindthis = this;
    if (!util.isEmpty(this.props.children)) {
      Object.entries(this.props.children).forEach(([key, value]) => {
        items.push(
          <div style={bindthis.props.tabStyle} key={key} className={`panelItem`}>
            <GBLink className={`ripple panelTab ${(value.props.id === bindthis.state.selectedTab) && 'selected'}`} style={bindthis.props.tabsStyle} onClick={() => bindthis.onTabClick(value.props.id)}>{value.props.label}</GBLink>
          </div>
        );
      });
    }
    return (
      <div style={this.props.panelStyle} className={`panel`}>{items}</div>
    )
  }

  renderChildren() {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        selectedTab: this.state.selectedTab
      })
    );
    return childrenWithProps;
  }

  render() {

    const {
      style,
      className
    } = this.props;

    return (
      <div className={`tabs ${className}`} style={style}>
        {this.renderTabPanel()}
        {this.renderChildren()}
      </div>
    );
  }
}

Tabs.defaultProps = {
  callbackBefore: null,
  callbackAfter: null
}

export default Tabs;


export const Tab = (props) => {
  return (
    <div className={`tab ${(props.id !== props.selectedTab) && 'displayNone'} ${props.className || ''}`}>
      {props.children}
    </div>
  );
}
