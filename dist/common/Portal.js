import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import { Component } from 'react';
import ReactDOM from 'react-dom';

var Portal =
/*#__PURE__*/
function (_Component) {
  _inherits(Portal, _Component);

  function Portal(props) {
    var _this;

    _classCallCheck(this, Portal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Portal).call(this, props));
    _this.el = document.createElement('div');

    _this.el.classList.add(props.className);

    return _this;
  }

  _createClass(Portal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.rootEl.appendChild(this.el);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.rootEl.removeChild(this.el);
    }
  }, {
    key: "render",
    value: function render() {
      return ReactDOM.createPortal(this.props.children, this.el);
    }
  }]);

  return Portal;
}(Component);

export { Portal as default };
Portal.defaultProps = {
  className: 'portal'
};