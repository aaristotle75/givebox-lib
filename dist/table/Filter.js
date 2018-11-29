import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import FilterForm from './FilterForm';
import Form from '../form/Form';

var Filter =
/*#__PURE__*/
function (_Component) {
  _inherits(Filter, _Component);

  function Filter(props) {
    var _this;

    _classCallCheck(this, Filter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Filter).call(this, props));
    _this.closeMenu = _this.closeMenu.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.openMenu = _this.openMenu.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      open: false
    };
    return _this;
  }

  _createClass(Filter, [{
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
      this.setState({
        open: true
      });
    }
  }, {
    key: "closeMenu",
    value: function closeMenu() {
      this.setState({
        open: false
      });
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
    key: "render",
    value: function render() {
      var _this$props = this.props,
          style = _this$props.style,
          label = _this$props.label,
          options = _this$props.options,
          name = _this$props.name;
      var open = this.state.open;
      return React.createElement("div", {
        className: "filter",
        style: style
      }, React.createElement("button", {
        className: "link",
        type: "button",
        onClick: open ? this.closeMenu : this.openMenu
      }, label, React.createElement("span", {
        className: "icon-normal ".concat(open ? 'icon-triangle-down' : 'icon-triangle-right')
      })), React.createElement(AnimateHeight, {
        duration: 500,
        height: this.state.open ? 'auto' : 0
      }, React.createElement(Form, {
        name: name
      }, React.createElement(FilterForm, {
        name: name,
        options: options
      }))));
    }
  }]);

  return Filter;
}(Component);

Filter.defaultProps = {
  label: 'Filters'
};
export default Filter;