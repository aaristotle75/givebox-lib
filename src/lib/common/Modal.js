import React, {Component} from 'react';
import * as Effect from './ModalEffect';
import { cloneObj, isEmpty } from "./utility";
const prefix = require('react-prefixr');

const defaultOverlayStyle = {};

const defaultContentStyle = {};

const defaultTransition = {
   property : 'all',
   duration : 300,
   timingfunction : 'linear',
};

const stopPropagation = (e) => e.stopPropagation();

let onClose;

class Modal extends Component {

	constructor(props){
		super(props);
    this.closeModal = this.closeModal.bind(this);
    this.renderActions = this.renderActions.bind(this);
    var effect;
    if (props.mobile) effect = '3DFlipVert';
    else effect = props.effect;
    const effects = {
      'scaleUp' : Effect.ScaleUp,
      'slideFromRight' : Effect.SlideFromRight,
      'slideFromBottom' : Effect.SlideFromBottom,
      'newspaper' : Effect.Newspaper,
      'fall' : Effect.Fall,
      'sideFall' : Effect.SideFall,
      '3DFlipHorz' : Effect.FlipHorizontal3D,
      '3DFlipVert' : Effect.FlipVertical3D,
      '3Dsign' : Effect.Sign3D,
      'superScaled' : Effect.SuperScaled,
      '3DFromBottom' : Effect.RotateFromBottom3D,
      '3DFromLeft' : Effect.RotateFromLeft3D,
    };

    this.state = {
      open : false,
      effect: effects[effect],
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobile: window.innerWidth < this.props.mobileBreakpoint ? true : false
    }
  }

  componentDidMount() {
    //window.addEventListener('resize', this.handleResize.bind(this));
    const transitionTimeMS = this.getTransitionDuration();
    setTimeout(() => this.setState({open: this.props.open}),0);
    onClose = (callback) => {
       this.setState({open: false}, () => {
         this.closeTimer = setTimeout(callback, transitionTimeMS);
       });
    };
  }

  componentWillUnmount() {
    onClose = null;
    clearTimeout(this.closeTimer);
  }

  /* Set width and height of screen */
  handleResize(e) {
    var mobile = window.innerWidth < this.props.mobileBreakpoint ? true : false;
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mobile: mobile
    });
  }

  renderActions() {
    var actions = [];
    if (this.props.actions) {
      this.props.actions.forEach(function(value) {
        actions.push(
          <span key={value.primary} className={`${value.primary ? 'primary' : 'secondary'}`}>
            <button onClick={() => value.onClick()}>{value.label}</button>
          </span>
        );
      })
    }
    if (!isEmpty(actions)) {
      return (
        <div className="actionBtnsContainer">
          <div className="actionBtns">
            {actions}
          </div>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  getTransitionDuration() {
    const { effect } = this.state;
    if(!effect.transition){
      return defaultTransition.duration;
    }
    return effect.transition.duration || defaultTransition.duration;
  }

  closeModal(callback) {
    var bindthis = this;
    const transitionTimeMS = this.getTransitionDuration();
    this.setState({open: false});
    setTimeout(function() {
		  window.postMessage(bindthis.props.identifier, '*');
      if (callback) callback();
    }, transitionTimeMS);
  }

  renderChildren() {
    var childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
      })
    );
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
      transition = { ...defaultTransition,transition };
    }

    const transition_style = {
      transition: `${transition.property} ${(transition.duration/1000)}s ${transition.timiingfunction}`
    }


    const closeBtn = mobile ? true : closeBtnShow;

    const defaultOverlay = cloneObj(defaultOverlayStyle);
    const overlayStyle = customOverlay ? { ...defaultOverlay, ...customOverlay } : defaultOverlayStyle;

    const defaultStyle = cloneObj(defaultContentStyle);
    let contentStyle = customStyle ? { ...defaultStyle, ...customStyle } : defaultContentStyle;
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
      transition: `opacity ${(transition.duration/1000)}s linear`,
      opacity: open ? 1 : 0
    }

    const openEffect = open ? effect.end : effect.begin;

    return (
      <div className={className}>
        <div
          onClick={() => this.closeModal(closeCallback)}
          className={`modalOverlay`} style={prefix({ ...overlayStyle, ...modalOverlayStyle})}
          >
          <div
            className={`modalContent`}
            style={prefix({ ...contentStyle, ...transition_style, openEffect })}
            onClick={stopPropagation}
          >
            {this.renderChildren()}
            {(closeBtn) && <a style={closeBtnStyle} className="modalCloseBtn" onClick={() => this.closeModal(closeCallback)}><span className="icon icon-close"></span></a>}
            {this.renderActions()}
          </div>
        </div>
      </div>
    )
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
