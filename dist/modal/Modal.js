import React, { Component } from 'react';
import * as Effect from './ModalEffect';
import { cloneObj, isEmpty } from '../common/utility';

const prefix = require('react-prefixr');

const defaultOverlayStyle = {};
const defaultContentStyle = {};
const defaultTransition = {
  property: 'all',
  duration: 300,
  timingfunction: 'linear'
};

const stopPropagation = e => e.stopPropagation();

class Modal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.onClose = this.onClose.bind(this);
    let effect;
    if (props.mobile) effect = '3DFlipVert';else effect = props.effect;
    const effects = {
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
    this.state = {
      open: false,
      effect: effects[effect],
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobile: window.innerWidth < this.props.mobileBreakpoint ? true : false
    };
  }

  componentDidMount() {
    //window.addEventListener('resize', this.handleResize.bind(this));
    setTimeout(() => this.setState({
      open: this.props.open
    }), 0);
    this.onClose();
  }

  componentWillUnmount() {
    clearTimeout(this.closeTimer);
  }

  onClose(callback) {
    const transitionTimeMS = this.getTransitionDuration();
    this.setState({
      open: false
    }, () => {
      this.closeTimer = setTimeout(callback, transitionTimeMS);
    });
  }
  /* Set width and height of screen */


  handleResize(e) {
    const mobile = window.innerWidth < this.props.mobileBreakpoint ? true : false;
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobile: mobile
    });
  }

  renderActions() {
    const actions = [];

    if (this.props.actions) {
      this.props.actions.forEach(function (value) {
        actions.push(React.createElement("span", {
          key: value.primary,
          className: `${value.primary ? 'primary' : 'secondary'}`
        }, React.createElement("button", {
          onClick: () => value.onClick()
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

  getTransitionDuration() {
    const {
      effect
    } = this.state;

    if (!effect.transition) {
      return defaultTransition.duration;
    }

    return effect.transition.duration || defaultTransition.duration;
  }

  closeModal(callback) {
    const bindthis = this;
    const transitionTimeMS = this.getTransitionDuration();
    this.setState({
      open: false
    });
    this.closeTimer = setTimeout(function () {
      window.postMessage(bindthis.props.identifier, '*');
      if (callback) callback();
    }, transitionTimeMS);
  }

  renderChildren() {
    const childrenWithProps = React.Children.map(this.props.children, child => React.cloneElement(child, {}));
    return childrenWithProps;
  }

  render() {
    const {
      open,
      effect,
      mobile,
      closeBtnStyle
    } = this.state;
    const {
      closeCallback,
      closeBtnShow,
      customStyle,
      customOverlay,
      className
    } = this.props;
    let transition = effect.transition;

    if (!transition) {
      transition = defaultTransition;
    } else {
      transition = { ...defaultTransition,
        ...transition
      };
    }

    const transition_style = {
      transition: `${transition.property} ${transition.duration / 1000}s ${transition.timingfunction}`
    };
    const closeBtn = mobile ? true : closeBtnShow;
    const defaultOverlay = cloneObj(defaultOverlayStyle);
    const overlayStyle = customOverlay ? { ...defaultOverlay,
      ...customOverlay
    } : defaultOverlayStyle;
    const defaultStyle = cloneObj(defaultContentStyle);
    let contentStyle = customStyle ? { ...defaultStyle,
      ...customStyle
    } : defaultContentStyle;

    if (mobile) {
      contentStyle = cloneObj(contentStyle);
      contentStyle.width = '100%';
      contentStyle.height = '100%';
      contentStyle.borderRadius = 0;
      contentStyle.margin = 0;
      contentStyle.border = 0;
      contentStyle.overflow = 'auto';
    }

    const modalOverlayStyle = {
      transition: `opacity ${transition.duration / 1000}s linear`,
      opacity: open ? 1 : 0
    };
    const openEffect = open ? effect.end : effect.begin;
    return React.createElement("div", {
      onClick: () => this.closeModal(closeCallback),
      className: `modalOverlay`,
      style: prefix({ ...overlayStyle,
        ...modalOverlayStyle
      })
    }, React.createElement("div", {
      className: `modalContent ${className}`,
      style: prefix({ ...contentStyle,
        ...transition_style,
        ...openEffect
      }),
      onClick: stopPropagation
    }, this.renderChildren(), closeBtn && React.createElement("button", {
      style: closeBtnStyle,
      className: "modalCloseBtn",
      onClick: () => this.closeModal(closeCallback)
    }, React.createElement("span", {
      className: "icon icon-close"
    })), this.renderActions()));
  }

}

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