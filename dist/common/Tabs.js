import _slicedToArray from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/slicedToArray";
import _regeneratorRuntime from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/regenerator";
import _asyncToGenerator from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { util, GBLink } from '../';

var Tabs =
/*#__PURE__*/
function (_Component) {
  _inherits(Tabs, _Component);

  function Tabs(props) {
    var _this;

    _classCallCheck(this, Tabs);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tabs).call(this, props));
    _this.renderTabPanel = _this.renderTabPanel.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderChildren = _this.renderChildren.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onTabClick = _this.onTabClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      selectedTab: props.default || ''
    };
    return _this;
  }

  _createClass(Tabs, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "onTabClick",
    value: function () {
      var _onTabClick = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(key) {
        var _this2 = this;

        var promise, validate;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                promise = new Promise(function (resolve, reject) {
                  var validate = true;

                  if (_this2.props.callbackBefore) {
                    if (!_this2.props.callbackBefore(key)) validate = false;
                  }

                  resolve(validate);
                });
                _context.next = 3;
                return promise;

              case 3:
                validate = _context.sent;

                if (validate) {
                  this.setState({
                    selectedTab: key
                  });
                  if (this.props.callbackAfter) this.props.callbackAfter(key);
                }

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function onTabClick(_x) {
        return _onTabClick.apply(this, arguments);
      };
    }()
  }, {
    key: "renderTabPanel",
    value: function renderTabPanel() {
      var items = [];
      var bindthis = this;

      if (!util.isEmpty(this.props.children)) {
        Object.entries(this.props.children).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          items.push(React.createElement("div", {
            style: bindthis.props.tabStyle,
            key: key,
            className: "panelItem"
          }, React.createElement(GBLink, {
            className: "panelTab ".concat(value.props.id === bindthis.state.selectedTab && 'selected'),
            style: bindthis.props.tabsStyle,
            onClick: function onClick() {
              return bindthis.onTabClick(value.props.id);
            }
          }, value.props.label)));
        });
      }

      return React.createElement("div", {
        style: this.props.panelStyle,
        className: "panel"
      }, items);
    }
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      var _this3 = this;

      var childrenWithProps = React.Children.map(this.props.children, function (child) {
        return React.cloneElement(child, {
          selectedTab: _this3.state.selectedTab
        });
      });
      return childrenWithProps;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          style = _this$props.style,
          className = _this$props.className;
      return React.createElement("div", {
        className: "tabs ".concat(className),
        style: style
      }, this.renderTabPanel(), this.renderChildren());
    }
  }]);

  return Tabs;
}(Component);

Tabs.defaultProps = {
  callbackBefore: null,
  callbackAfter: null
};
export default Tabs;
export var Tab = function Tab(props) {
  return React.createElement("div", {
    className: "tab ".concat(props.id !== props.selectedTab && 'displayNone')
  }, props.children);
};