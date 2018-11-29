import _objectSpread from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/objectSpread";
import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { util } from '../';
import { getResource } from '../api/helpers';
import has from 'has';

var ExportLink =
/*#__PURE__*/
function (_Component) {
  _inherits(ExportLink, _Component);

  function ExportLink(props) {
    var _this;

    _classCallCheck(this, ExportLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ExportLink).call(this, props));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.makeLink = _this.makeLink.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      link: null
    };
    return _this;
  }

  _createClass(ExportLink, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.makeLink();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (has(prevProps.resource, 'endpoint')) {
        if (this.props.resource.endpoint !== prevProps.resource.endpoint) {
          this.makeLink();
        }
      }
    }
  }, {
    key: "makeLink",
    value: function makeLink() {
      var resource = this.props.resource;
      var max = {
        max: 100000000
      };

      var search = _objectSpread({}, resource.search, max);

      var link = this.props.getResource(this.props.name, {
        csv: true,
        search: search
      });
      this.setState({
        link: link
      });
    }
  }, {
    key: "onClick",
    value: function onClick() {
      window.open(this.state.link, '_blank');
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          style = _this$props.style,
          align = _this$props.align;
      return React.createElement("div", {
        style: style,
        className: "exportRecordsLink ".concat(align)
      }, React.createElement("button", {
        onClick: this.onClick,
        className: "link"
      }, "Export Report"));
    }
  }]);

  return ExportLink;
}(Component);

ExportLink.defaultProps = {
  align: 'center'
};

function mapStateToProps(state, props) {
  var resource = state.resource[props.name] ? state.resource[props.name] : {};
  var sort, order;

  if (!util.isLoading(resource)) {
    sort = has(resource.search, 'sort') ? resource.search.sort : '';
    order = has(resource.search, 'order') ? resource.search.order : '';
  }

  return {
    resource: resource,
    sort: sort,
    order: order
  };
}

export default connect(mapStateToProps, {
  getResource: getResource
})(ExportLink);