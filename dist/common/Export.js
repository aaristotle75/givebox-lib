import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CalendarRange from '../form/CalendarRange';
import { Error, getAPI, Select } from '../';

var Export =
/*#__PURE__*/
function (_Component) {
  _inherits(Export, _Component);

  function Export(props) {
    var _this;

    _classCallCheck(this, Export);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Export).call(this, props));
    _this.setOptions = _this.setOptions.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Export, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "onChange",
    value: function onChange(e) {
      console.log(e.currentTarget.value);
    }
  }, {
    key: "setOptions",
    value: function setOptions() {
      var items = [{
        primaryText: 'All Transactions',
        value: 'all'
      }, {
        primaryText: 'Specific date range',
        value: 'daterange'
      }];
      return items;
    }
  }, {
    key: "render",
    value: function render() {
      var style = this.props.style;
      return React.createElement("div", {
        id: "exportRecords",
        style: style,
        className: "exportRecords"
      }, React.createElement(Error, {
        msg: 'Please fix the following errors to continue.'
      }), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col right"
      }, React.createElement("label", {
        className: "side"
      }, "Time Period")), React.createElement("div", {
        className: "col left"
      }, React.createElement(Select, {
        options: this.setOptions(),
        onChange: this.onChange
      }))), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col"
      }, React.createElement("label", {
        className: "side"
      }, "Date")), React.createElement("div", {
        className: "col"
      }, React.createElement(CalendarRange, {
        enableTime: false,
        nameFrom: "exportRange1",
        labelFrom: 'From',
        nameTo: "exportRange2",
        labelTo: 'To'
      }))));
    }
  }]);

  return Export;
}(Component);

Export.defaultProps = {};

function mapStateToProps(state, props) {
  var resource = state.resource[props.name] ? state.resource[props.name] : {};
  return {
    resource: resource
  };
}

export default connect(mapStateToProps, {
  getAPI: getAPI
})(Export);