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

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (prevProps.default !== this.props.default) {
      if (this.state.selectedTab !== this.props.default) {
        this.onTabClick(this.props.default);
      }
    }
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
      this.setState({
        selectedTab: key
      });
      if (this.props.callbackAfter) this.props.callbackAfter(key);
    }
  }

  renderTabPanel() {
    const {
      allowCustom,
      customColor,
      solidColor,
      borderSize
    } = this.props;
    const {
      selectedTab
    } = this.state;
    const items = [];
    const bindthis = this;

    if (!util.isEmpty(this.props.children)) {
      Object.entries(this.props.children).forEach(([key, value]) => {
        const selectedStyle = {
          borderBottom: customColor ? `${borderSize || '2px'} solid ${customColor}` : ''
        };
        const tabStyle = value.props.id === selectedTab ? { ...this.props.tabStyle,
          ...selectedStyle
        } : { ...this.props.tabStyle
        };
        const isSelected = value.props.id === selectedTab ? true : false;

        if (!util.isEmpty(value)) {
          if (util.getValue(value.props, 'id')) {
            items.push(React.createElement("div", {
              style: bindthis.props.tabStyle,
              key: key,
              className: `panelItem`
            }, React.createElement(GBLink, {
              allowCustom: isSelected ? allowCustom : false,
              customColor: customColor,
              solidColor: solidColor,
              disabled: util.getValue(value.props, 'disabled'),
              className: `${util.getValue(value.props, 'disabled') ? 'disabled' : ''} ripple panelTab ${isSelected && 'selected'}`,
              style: tabStyle,
              onClick: () => bindthis.onTabClick(value.props.id)
            }, value.props.label)));
          }
        }
      });
    }

    return React.createElement("div", {
      style: this.props.panelStyle,
      className: `panel`
    }, items);
  }

  renderChildren() {
    const childrenWithProps = React.Children.map(this.props.children, child => React.cloneElement(child, {
      selectedTab: this.state.selectedTab
    }));
    return childrenWithProps;
  }

  render() {
    const {
      style,
      className
    } = this.props;
    return React.createElement("div", {
      className: `tabs ${className}`,
      style: style
    }, this.renderTabPanel(), this.props.intro, this.renderChildren());
  }

}

Tabs.defaultProps = {
  callbackBefore: null,
  callbackAfter: null,
  allowCustom: false,
  customColor: false,
  solidColor: false
};
export default Tabs;
export const Tab = props => {
  return React.createElement("div", {
    className: `tab ${props.id !== props.selectedTab && 'displayNone'} ${props.className || ''}`
  }, props.children);
};