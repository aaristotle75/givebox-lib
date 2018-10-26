import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { mime } from 'common/types';
import { formatBytes } from 'common/utility';

var ImageUpload =
/*#__PURE__*/
function (_Component) {
  _inherits(ImageUpload, _Component);

  function ImageUpload(props) {
    var _this;

    _classCallCheck(this, ImageUpload);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImageUpload).call(this, props));
    _this.onDrop = _this.onDrop.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.this.state = {
      accepted: [],
      rejected: []
    };
    return _this;
  }

  _createClass(ImageUpload, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.createField) this.props.createField(this.props.name, this.props.params);
    }
  }, {
    key: "onDrop",
    value: function onDrop(accepted, rejected) {
      console.log('onDrop', accepted, rejected);
      this.setState({
        accepted: accepted,
        rejected: rejected
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          name = _this$props.name,
          label = _this$props.label,
          className = _this$props.className,
          style = _this$props.style,
          onChange = _this$props.onChange,
          error = _this$props.error,
          errorType = _this$props.errorType;
      var id = "".concat(name, "-image-upload");
      var mimes = mime.image + ',' + mime.text + ',' + mime.applications;
      return React.createElement("div", {
        style: style,
        className: "input-group ".concat(className || '', "  ").concat(error ? 'error tooltip' : '')
      }, label && React.createElement("label", null, label), React.createElement(Dropzone, {
        className: "dropzone",
        onDrop: this.onDrop,
        accept: mimes
      }, React.createElement("span", {
        className: "text"
      }, "Upload files")), React.createElement("span", null, "Accepted Files:"), React.createElement("ul", null, this.state.accepted.map(function (f) {
        return React.createElement("li", {
          key: f.name
        }, f.name, " - ", formatBytes(f.size, 1));
      })), React.createElement("span", null, "Rejected Files:"), React.createElement("ul", null, this.state.rejected.map(function (f) {
        return React.createElement("li", {
          key: f.name
        }, f.name, " - ", f.size, " bytes");
      })), React.createElement("div", {
        className: "tooltipTop ".concat(errorType !== 'tooltip' && 'displayNone')
      }, this.props.error, React.createElement("i", null)), React.createElement("div", {
        className: "errorMsg ".concat(!error || errorType !== 'normal' && 'displayNone')
      }, error));
    }
  }]);

  return ImageUpload;
}(Component);

ImageUpload.defaultProps = {
  name: 'defaultImageUpload',
  label: 'Image Upload'
};
export default ImageUpload;