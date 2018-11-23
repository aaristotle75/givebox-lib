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

  onTabClick(key) {
    this.setState({selectedTab: key});
  }

  renderTabPanel() {
    const items = [];
    const bindthis = this;
    if (!util.isEmpty(this.props.children)) {
      Object.entries(this.props.children).forEach(([key, value]) => {
        items.push(
          <div style={bindthis.props.tabStyle} key={key} className={`panelItem`}>
            <GBLink className={`panelTab ${(value.props.id === bindthis.state.selectedTab) && 'selected'}`} style={bindthis.props.tabsStyle} onClick={() => bindthis.onTabClick(value.props.id)}>{value.props.label}</GBLink>
          </div>
        );
      });
    }
    return (
      <div style={this.props.panelStyle} className={`panel`}>{items}</div>
    )
  }

  renderChildren() {
    var childrenWithProps = React.Children.map(this.props.children,
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

export default Tabs;


export const Tab = (props) => {
  return (
    <div className={`tab ${(props.id !== props.selectedTab) && 'displayNone'}`}>
      {props.children}
    </div>
  );
}
