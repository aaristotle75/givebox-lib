import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendResource } from '../api/helpers';
import { removeResource, toggleModal } from '../api/actions';
import { Alert } from './Alert';

var Delete =
/*#__PURE__*/
function (_Component) {
  _inherits(Delete, _Component);

  function Delete(props) {
    var _this;

    _classCallCheck(this, Delete);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Delete).call(this, props));
    _this.confirm = _this.confirm.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.confirmCallback = _this.confirmCallback.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      success: ''
    };
    return _this;
  }

  _createClass(Delete, [{
    key: "confirmCallback",
    value: function confirmCallback(res, err) {
      var _this2 = this;

      if (!err) {
        this.setState({
          success: 'Deleted successfully.'
        });

        if (this.props.redirect) {
          if (this.props.history) {
            setTimeout(function () {
              _this2.props.removeResource(_this2.props.resource);

              _this2.props.toggleModal(_this2.props.modalID, false);

              _this2.props.history.push(_this2.props.redirect);
            }, 2000);
          } else {
            console.error('Must pass Router history props to redirect.');
          }
        }
      }
    }
  }, {
    key: "confirm",
    value: function confirm() {
      this.props.sendResource(this.props.resource, {
        id: [this.props.id],
        method: 'delete',
        callback: this.confirmCallback
      });
    }
  }, {
    key: "render",
    value: function render() {
      var desc = this.props.desc;
      return React.createElement("div", {
        className: "center"
      }, React.createElement(Alert, {
        alert: "success",
        msg: this.state.success
      }), React.createElement("h3", null, "You are about to delete", React.createElement("br", null), " ", desc), React.createElement("div", {
        className: "button-group"
      }, React.createElement("button", {
        className: "button",
        type: "button",
        onClick: this.confirm
      }, "Confirm Delete")));
    }
  }]);

  return Delete;
}(Component);

function mapStateToProps(state, props) {
  return {};
}

export default connect(mapStateToProps, {
  sendResource: sendResource,
  removeResource: removeResource,
  toggleModal: toggleModal
})(Delete);