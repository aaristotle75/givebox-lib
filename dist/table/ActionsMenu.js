import React, { Component } from 'react';
import { util } from '../';
import AnimateHeight from 'react-animate-height';
import Fade from '../common/Fade';

class ActionsMenu extends Component {
  constructor(props) {
    super(props);
    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      open: false,
      display: false,
      direction: ''
    };
    this.dropdownRef = /*#__PURE__*/React.createRef();
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.closeMenu();

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  openMenu(e) {
    e.stopPropagation();
    const ref = this.dropdownRef.current;
    const height = window.innerHeight;
    const rect = ref.getBoundingClientRect();
    let direction = '';
    if (height - rect.top < 300) direction = 'top';
    this.setState({
      direction,
      open: true,
      display: true
    });
    document.addEventListener('click', this.closeMenu);
  }

  closeMenu() {
    this.setState({
      open: false
    });
    document.removeEventListener('click', this.closeMenu);
    this.timeout = setTimeout(() => {
      this.setState({
        display: false
      });
      this.timeout = null;
    }, this.props.overlayDuration);
  }

  onClick(e) {
    e.preventDefault();
    this.setState({
      open: false
    });
  }

  listOptions() {
    const items = [];
    const bindthis = this;

    if (!util.isEmpty(this.props.options)) {
      this.props.options.forEach(function (value, key) {
        items.push( /*#__PURE__*/React.createElement("div", {
          className: `actionsMenu-item ${bindthis.props.itemClass}`,
          key: key
        }, value));
      });
    }

    return items;
  }

  render() {
    const {
      style,
      label,
      iconOpened,
      iconClosed,
      overlay,
      overlayDuration,
      className
    } = this.props;
    const {
      open,
      display,
      direction
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: `actionsMenu ${className || ''}`,
      style: style
    }, /*#__PURE__*/React.createElement(Fade, {
      in: open && overlay,
      duration: overlayDuration
    }, /*#__PURE__*/React.createElement("div", {
      onClick: this.closeMenu,
      className: `dropdown-cover ${display ? '' : 'displayNone'}`
    })), /*#__PURE__*/React.createElement("button", {
      disabled: !!util.isEmpty(this.props.options),
      className: "menuLabel",
      type: "button",
      onClick: open ? this.closeMenu : this.openMenu
    }, !util.isEmpty(this.props.options) ? label : 'No Actions', /*#__PURE__*/React.createElement("span", {
      className: `${util.isEmpty(this.props.options) && 'displayNone'}`
    }, open ? iconOpened : iconClosed)), /*#__PURE__*/React.createElement("div", {
      ref: this.dropdownRef,
      className: `${open ? 'opened' : ''} actionsMenu-content ${this.props.direction || direction}`
    }, /*#__PURE__*/React.createElement(AnimateHeight, {
      duration: 200,
      height: open ? 'auto' : 0
    }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("div", {
      className: "actionsMenu-text"
    }, this.listOptions()))));
  }

}

ActionsMenu.defaultProps = {
  label: 'Actions',
  className: '',
  itemClass: 'button',
  iconOpened: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-chevron-down"
  }),
  iconClosed: /*#__PURE__*/React.createElement("span", {
    className: "icon icon-chevron-right"
  }),
  overlayDuration: 200,
  overlay: true,
  direction: ''
};
export default ActionsMenu;