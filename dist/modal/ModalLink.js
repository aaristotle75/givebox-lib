import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../api/actions';
import { GBLink } from '../';

var ModalLink =
/*#__PURE__*/
function (_Component) {
  _inherits(ModalLink, _Component);

  function ModalLink(props) {
    var _this;

    _classCallCheck(this, ModalLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ModalLink).call(this, props));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(ModalLink, [{
    key: "onClick",
    value: function onClick(id) {
      this.props.toggleModal(id, true);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          id = _this$props.id,
          className = _this$props.className,
          li = _this$props.li;
      var component = li ? React.createElement("li", {
        className: className,
        onClick: function onClick() {
          return _this2.onClick(id);
        }
      }, this.props.children) : React.createElement(GBLink, {
        className: "link ".concat(className),
        type: "button",
        onClick: function onClick() {
          return _this2.onClick(id);
        }
      }, this.props.children);
      return component;
    }
  }]);

  return ModalLink;
}(Component);

ModalLink.defaultProps = {
  li: false
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  toggleModal: toggleModal
})(ModalLink);