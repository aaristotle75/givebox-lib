import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Portal from '../common/Portal';
import Loader from '../common/Loader';
import { toggleModal } from '../api/actions';
import has from 'has';

var ModalRoute =
/*#__PURE__*/
function (_Component) {
  _inherits(ModalRoute, _Component);

  function ModalRoute(props) {
    var _this;

    _classCallCheck(this, ModalRoute);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ModalRoute).call(this, props));
    _this.receiveMessage = _this.receiveMessage.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(ModalRoute, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('message', this.receiveMessage, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "receiveMessage",
    value: function receiveMessage(e) {
      if (e.data === this.props.id) {
        if (this.props.open) this.props.toggleModal(e.data, false);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          effect = _this$props.effect,
          closeBtnShow = _this$props.closeBtnShow,
          style = _this$props.style,
          open = _this$props.open,
          component = _this$props.component,
          id = _this$props.id,
          opts = _this$props.opts,
          className = _this$props.className;
      var modalRoot = document.getElementById('modal-root');

      if (!modalRoot) {
        return React.createElement(Loader, null);
      }

      return React.createElement("div", null, open && React.createElement(Portal, {
        rootEl: modalRoot,
        className: "modal"
      }, React.createElement(Modal, {
        className: className,
        identifier: id,
        effect: effect,
        open: open,
        closeBtnShow: closeBtnShow,
        customStyle: style
      }, component(opts))));
    }
  }]);

  return ModalRoute;
}(Component);

ModalRoute.defaultProps = {
  className: ''
};

function mapStateToProps(state, props) {
  var open = false;
  var opts = {};

  if (has(state.modal, props.id)) {
    open = state.modal[props.id].open;
    opts = state.modal[props.id].opts;
  }

  return {
    open: open,
    opts: opts
  };
}

export default connect(mapStateToProps, {
  toggleModal: toggleModal
})(ModalRoute);