import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { lookup, isEmpty } from '../common/utility';
import AnimateHeight from 'react-animate-height';

var Dropdown =
/*#__PURE__*/
function (_Component) {
  _inherits(Dropdown, _Component);

  function Dropdown(props) {
    var _this;

    _classCallCheck(this, Dropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Dropdown).call(this, props));
    _this.listOptions = _this.listOptions.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.closeMenu = _this.closeMenu.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.openMenu = _this.openMenu.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.setSelected = _this.setSelected.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      open: false,
      selected: '',
      value: ''
    };
    return _this;
  }

  _createClass(Dropdown, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.createField) this.props.createField(this.props.name, this.props.params);
      var init = lookup(this.props.options, 'value', this.props.defaultValue);

      if (!isEmpty(init)) {
        this.setState({
          value: init.value,
          selected: init.primaryText
        });
      }
    }
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
      if (!this.props.multi) document.addEventListener('click', this.closeMenu);
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
      var value = e.currentTarget.getAttribute('data-value');
      var selected = e.currentTarget.getAttribute('data-selected');
      var open = this.props.multi ? true : false;
      this.setState({
        open: open,
        value: value,
        selected: selected
      });
      this.props.onChange(this.props.name, value);
    }
  }, {
    key: "setSelected",
    value: function setSelected(selected) {
      this.setState({
        selected: selected
      });
    }
  }, {
    key: "listOptions",
    value: function listOptions() {
      var bindthis = this;
      var selectedValue = this.state.value;
      var items = [];
      this.props.options.forEach(function (value) {
        var selected = bindthis.props.multi ? bindthis.props.value.includes(value.value) ? true : false : selectedValue === value.value ? true : false;
        items.push(React.createElement("div", {
          "data-selected": value.primaryText,
          "data-value": value.value,
          onClick: function onClick(e) {
            return bindthis.onClick(e);
          },
          className: "dropdown-item ".concat(selected ? 'selected' : ''),
          key: value.value
        }, bindthis.props.multi && selected && React.createElement("span", {
          className: "icon icon-checkmark"
        }), " ", value.primaryText));
      });
      return items ? items : React.createElement("option", null, "None");
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          label = _this$props.label,
          className = _this$props.className,
          style = _this$props.style,
          selectLabel = _this$props.selectLabel,
          error = _this$props.error,
          errorType = _this$props.errorType,
          multi = _this$props.multi;
      var _this$state = this.state,
          open = _this$state.open,
          selected = _this$state.selected;
      var selectedValue = multi ? open ? 'Close Menu' : selectLabel : selected || selectLabel;
      return React.createElement("div", {
        style: style,
        className: "input-group dropdown-group ".concat(className || '', " ").concat(error ? 'error tooltip' : '')
      }, label && React.createElement("label", null, label), React.createElement("div", {
        className: "dropdown",
        style: style
      }, React.createElement("button", {
        type: "button",
        onClick: open ? this.closeMenu : this.openMenu
      }, React.createElement("span", {
        className: "label"
      }, selectedValue), React.createElement("span", {
        className: "icon ".concat(open ? multi ? 'icon-close' : 'icon-triangle-down' : 'icon-triangle-right')
      })), React.createElement("div", {
        className: "dropdown-content"
      }, React.createElement(AnimateHeight, {
        duration: 200,
        height: open ? 'auto' : 0
      }, this.listOptions()))), React.createElement("div", {
        className: "tooltipTop ".concat(errorType !== 'tooltip' && 'displayNone')
      }, this.props.error, React.createElement("i", null)), React.createElement("div", {
        className: "errorMsg ".concat((!error || errorType !== 'normal') && 'displayNone')
      }, error));
    }
  }]);

  return Dropdown;
}(Component);

Dropdown.defaultProps = {
  name: 'defaultSelect',
  multi: false,
  selectLabel: 'Please select'
};
export default Dropdown;