import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { util } from '../';
import AnimateHeight from 'react-animate-height';

var ActionsMenu =
/*#__PURE__*/
function (_Component) {
  _inherits(ActionsMenu, _Component);

  function ActionsMenu(props) {
    var _this;

    _classCallCheck(this, ActionsMenu);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ActionsMenu).call(this, props));
    _this.closeMenu = _this.closeMenu.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.openMenu = _this.openMenu.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      open: false
    };
    return _this;
  }

  _createClass(ActionsMenu, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.closeMenu();
    }
  }, {
    key: "openMenu",
    value: function openMenu(e) {
      e.stopPropagation();
      this.setState({
        open: true
      });
      document.addEventListener('click', this.closeMenu);
    }
  }, {
    key: "closeMenu",
    value: function closeMenu() {
      this.setState({
        open: false
      });
      document.removeEventListener('click', this.closeMenu);
    }
  }, {
    key: "onClick",
    value: function onClick(e) {
      e.preventDefault();
      this.setState({
        open: false
      });
    }
  }, {
    key: "listOptions",
    value: function listOptions() {
      var items = [];
      var bindthis = this;

      if (!util.isEmpty(this.props.options)) {
        this.props.options.forEach(function (value, key) {
          items.push(React.createElement("div", {
            className: "actionsMenu-item ".concat(bindthis.props.itemClass),
            key: key
          }, value));
        });
      }

      return items;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          style = _this$props.style,
          label = _this$props.label;
      var open = this.state.open;
      return React.createElement("div", {
        className: "actionsMenu",
        style: style
      }, React.createElement("button", {
        disabled: !!util.isEmpty(this.props.options),
        className: "menuLabel",
        type: "button",
        onClick: open ? this.closeMenu : this.openMenu
      }, !util.isEmpty(this.props.options) ? label : 'No Actions', React.createElement("span", {
        className: "icon ".concat(open ? 'icon-triangle-down' : 'icon-triangle-right', " ").concat(util.isEmpty(this.props.options) && 'displayNone')
      })), React.createElement("div", {
        className: "actionsMenu-content"
      }, React.createElement(AnimateHeight, {
        duration: 200,
        height: open ? 'auto' : 0
      }, this.listOptions())));
    }
  }]);

  return ActionsMenu;
}(Component);

ActionsMenu.defaultProps = {
  label: 'Actions',
  className: '',
  itemClass: 'button'
};
export default ActionsMenu;