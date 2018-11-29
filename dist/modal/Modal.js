import _objectSpread from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/objectSpread";
import _classCallCheck from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "/Users/aaron/Sites/projects/givebox/givebox-lib/node_modules/@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component } from 'react';
import * as Effect from './ModalEffect';
import { cloneObj, isEmpty } from '../common/utility';

var prefix = require('react-prefixr');

var defaultOverlayStyle = {};
var defaultContentStyle = {};
var defaultTransition = {
  property: 'all',
  duration: 300,
  timingfunction: 'linear'
};

var stopPropagation = function stopPropagation(e) {
  return e.stopPropagation();
};

var Modal =
/*#__PURE__*/
function (_Component) {
  _inherits(Modal, _Component);

  function Modal(props) {
    var _this;

    _classCallCheck(this, Modal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Modal).call(this, props));
    _this.closeModal = _this.closeModal.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderActions = _this.renderActions.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onClose = _this.onClose.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    var effect;
    if (props.mobile) effect = '3DFlipVert';else effect = props.effect;
    var effects = {
      'scaleUp': Effect.ScaleUp,
      'slideFromRight': Effect.SlideFromRight,
      'slideFromBottom': Effect.SlideFromBottom,
      'newspaper': Effect.Newspaper,
      'fall': Effect.Fall,
      'sideFall': Effect.SideFall,
      '3DFlipHorz': Effect.FlipHorizontal3D,
      '3DFlipVert': Effect.FlipVertical3D,
      '3Dsign': Effect.Sign3D,
      'superScaled': Effect.SuperScaled,
      '3DFromBottom': Effect.RotateFromBottom3D,
      '3DFromLeft': Effect.RotateFromLeft3D
    };
    _this.state = {
      open: false,
      effect: effects[effect],
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobile: window.innerWidth < _this.props.mobileBreakpoint ? true : false
    };
    return _this;
  }

  _createClass(Modal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      //window.addEventListener('resize', this.handleResize.bind(this));
      setTimeout(function () {
        return _this2.setState({
          open: _this2.props.open
        });
      }, 0);
      this.onClose();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this.closeTimer);
    }
  }, {
    key: "onClose",
    value: function onClose(callback) {
      var _this3 = this;

      var transitionTimeMS = this.getTransitionDuration();
      this.setState({
        open: false
      }, function () {
        _this3.closeTimer = setTimeout(callback, transitionTimeMS);
      });
    }
    /* Set width and height of screen */

  }, {
    key: "handleResize",
    value: function handleResize(e) {
      var mobile = window.innerWidth < this.props.mobileBreakpoint ? true : false;
      this.setState({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        mobile: mobile
      });
    }
  }, {
    key: "renderActions",
    value: function renderActions() {
      var actions = [];

      if (this.props.actions) {
        this.props.actions.forEach(function (value) {
          actions.push(React.createElement("span", {
            key: value.primary,
            className: "".concat(value.primary ? 'primary' : 'secondary')
          }, React.createElement("button", {
            onClick: function onClick() {
              return value.onClick();
            }
          }, value.label)));
        });
      }

      if (!isEmpty(actions)) {
        return React.createElement("div", {
          className: "actionBtnsContainer"
        }, React.createElement("div", {
          className: "actionBtns"
        }, actions));
      } else {
        return React.createElement("div", null);
      }
    }
  }, {
    key: "getTransitionDuration",
    value: function getTransitionDuration() {
      var effect = this.state.effect;

      if (!effect.transition) {
        return defaultTransition.duration;
      }

      return effect.transition.duration || defaultTransition.duration;
    }
  }, {
    key: "closeModal",
    value: function closeModal(callback) {
      var bindthis = this;
      var transitionTimeMS = this.getTransitionDuration();
      this.setState({
        open: false
      });
      setTimeout(function () {
        window.postMessage(bindthis.props.identifier, '*');
        if (callback) callback();
      }, transitionTimeMS);
    }
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      var childrenWithProps = React.Children.map(this.props.children, function (child) {
        return React.cloneElement(child, {});
      });
      return childrenWithProps;
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$state = this.state,
          open = _this$state.open,
          effect = _this$state.effect,
          mobile = _this$state.mobile,
          closeBtnStyle = _this$state.closeBtnStyle;
      var _this$props = this.props,
          closeCallback = _this$props.closeCallback,
          closeBtnShow = _this$props.closeBtnShow,
          customStyle = _this$props.customStyle,
          customOverlay = _this$props.customOverlay,
          className = _this$props.className;
      var transition = effect.transition;

      if (!transition) {
        transition = defaultTransition;
      } else {
        transition = _objectSpread({}, defaultTransition, transition);
      }

      var transition_style = {
        transition: "".concat(transition.property, " ").concat(transition.duration / 1000, "s ").concat(transition.timingfunction)
      };
      var closeBtn = mobile ? true : closeBtnShow;
      var defaultOverlay = cloneObj(defaultOverlayStyle);
      var overlayStyle = customOverlay ? _objectSpread({}, defaultOverlay, customOverlay) : defaultOverlayStyle;
      var defaultStyle = cloneObj(defaultContentStyle);
      var contentStyle = customStyle ? _objectSpread({}, defaultStyle, customStyle) : defaultContentStyle;

      if (mobile) {
        contentStyle = cloneObj(contentStyle);
        contentStyle.width = '100%';
        contentStyle.height = '100%';
        contentStyle.borderRadius = 0;
        contentStyle.margin = 0;
        contentStyle.border = 0;
        contentStyle.overflow = 'auto';
      }

      var modalOverlayStyle = {
        transition: "opacity ".concat(transition.duration / 1000, "s linear"),
        opacity: open ? 1 : 0
      };
      var openEffect = open ? effect.end : effect.begin;
      return React.createElement("div", {
        className: className
      }, React.createElement("div", {
        onClick: function onClick() {
          return _this4.closeModal(closeCallback);
        },
        className: "modalOverlay",
        style: prefix(_objectSpread({}, overlayStyle, modalOverlayStyle))
      }, React.createElement("div", {
        className: "modalContent",
        style: prefix(_objectSpread({}, contentStyle, transition_style, openEffect)),
        onClick: stopPropagation
      }, this.renderChildren(), closeBtn && React.createElement("button", {
        style: closeBtnStyle,
        className: "modalCloseBtn",
        onClick: function onClick() {
          return _this4.closeModal(closeCallback);
        }
      }, React.createElement("span", {
        className: "icon icon-close"
      })), this.renderActions())));
    }
  }]);

  return Modal;
}(Component);

Modal.defaultProps = {
  mobileBreakpoint: 800,
  customStyle: {},
  effect: 'fall',
  closeBtnShow: true,
  closeBtnStyle: {
    marginTop: '10px',
    fontSize: 12,
    fontWeight: 500,
    color: '#9aa7ad'
  },
  actions: false
};
export default Modal;