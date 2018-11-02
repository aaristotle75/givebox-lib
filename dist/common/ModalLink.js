import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleModal } from '../actions/actions';
import GBLink from './GBLink';

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
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "onClick",
    value: function onClick(id) {
      this.props.toggleModal(id, true);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var id = this.props.id;
      return React.createElement(GBLink, {
        className: "link",
        type: "button",
        onClick: function onClick() {
          return _this2.onClick(id);
        }
      }, this.props.children);
    }
  }]);

  return ModalLink;
}(Component);

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  toggleModal: toggleModal
})(ModalLink);