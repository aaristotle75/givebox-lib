import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as Effect from './ModalEffect';
import { cloneObj, isEmpty } from '../common/utility';
import animateScrollTo from 'animated-scroll-to';
import Waypoint from 'react-waypoint';
import Fade from '../common/Fade';
import GBLink from '../common/GBLink';
import Draggable from 'react-draggable';
import { util } from '../';
import has from 'has';

const prefix = require('react-prefixr');
const defaultOverlayStyle = {};
const defaultContentStyle = {};
const defaultTransition = {
   property : 'all',
   duration : 300,
   timingfunction : 'linear',
};

const stopPropagation = (e) => e.stopPropagation();

class Modal extends Component {

	constructor(props){
		super(props);
    this.closeModal = this.closeModal.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onExit = this.onExit.bind(this);
    this.toTop = this.toTop.bind(this);
    this.searchForOpenModals = this.searchForOpenModals.bind(this);
    let effect;
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
      mobile: window.innerWidth < this.props.mobileBreakpoint ? true : false,
      scrolled: false
    }
    this.modalRef = React.createRef();
  }

  componentDidMount() {
    //window.addEventListener('resize', this.handleResize.bind(this));
    setTimeout(() => this.setState({open: this.props.open}),0);
    this.onClose();
  }

  componentWillUnmount() {
    clearTimeout(this.closeTimer);
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.closeModal(null, 'unmounted');
  }

  onEnter(pos) {
    this.setState({ scrolled: false });
  }

  onExit(pos) {
    this.timeout = setTimeout(() => {
      this.setState({ scrolled: true });
      this.timeout = null;
    }, 200);
  }

  toTop() {
    //const el = document.getElementById('layout-main');
    animateScrollTo(0, { element: this.modalRef.current });
  }

  onClose(callback) {
    const transitionTimeMS = this.getTransitionDuration();
    this.setState({open: false}, () => {
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
        <div className='actionBtnsContainer'>
          <div className='actionBtns'>
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

  searchForOpenModals(ignore) {
    let modalIsOpen = false;
    let allModalsClosed = true;
    if (this.props.modals) {
      Object.entries(this.props.modals).forEach(([key, value]) => {
        if (ignore !== key && value.open) modalIsOpen = true;
        if (value.open) allModalsClosed = false;
      });
      if (modalIsOpen) {
        return true;
      } else if (allModalsClosed) {
        return false;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  closeModal(callback, type = 'ok', allowClose = true) {
    const bindthis = this;
    const transitionTimeMS = this.getTransitionDuration();
    const current = util.getValue(this.props.appRef, 'current', {});
    if (allowClose) {
      if (this.props.appRef && !this.searchForOpenModals(this.props.identifier)) {
        if (!util.isEmpty(current)) {
          if (this.props.appRef.current.classList.contains('blur')) {
            this.props.appRef.current.classList.remove('blur');
          }
        }
      }
      this.setState({open: false});
      this.closeTimer = setTimeout(function() {
  		  window.postMessage(bindthis.props.identifier, '*');
        if (callback) callback(type);
      }, transitionTimeMS);
    }
  }

  renderChildren() {
    const childrenWithProps = React.Children.map(this.props.children,
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
      className,
      iconClose,
      appRef,
      identifier,
      draggable,
			draggableTitle
    } = this.props;

    let transition = effect.transition;

    if (!transition) {
      transition = defaultTransition;
    } else {
      transition = { ...defaultTransition, ...transition };
    }

    const transition_style = {
      transition: `${transition.property} ${(transition.duration/1000)}s ${transition.timingfunction}`
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

    if (appRef) {
      if (open) {
        if (appRef.current) appRef.current.classList.add('blur');
      } else {
        if (appRef && !this.searchForOpenModals(identifier)) {
          if (appRef.current) {
            if (appRef.current.classList.contains('blur')) {
              appRef.current.classList.remove('blur');
            }
          }
        }
      }
    }

    const modalContent =
      <div
        className={`modalContent ${className}`}
        style={prefix({ ...contentStyle, ...transition_style, ...openEffect })}
        onClick={stopPropagation}
      >
        {(closeBtn) && <button style={closeBtnStyle} className='modalCloseBtn' onClick={() => this.closeModal(closeCallback, 'ok')}>{iconClose}</button>}
				<div className='modalTop'></div>
		    {draggable ? <div className='handle'><span className='draggableTitle'><span className='icon icon-move'></span> {draggableTitle}</span></div> : <></>}
        {this.renderChildren()}
        {this.renderActions()}
        <Fade
          duration={500}
          in={this.state.scrolled}
        >
          <GBLink onClick={this.toTop} className={`modalToTop ${this.state.scrolled ? '' : 'displayNone'}`}><span className='icon icon-chevrons-up'></span></GBLink>
        </Fade>
        <div className='modalBottom'></div>
      </div>
    ;

    return (
      <div className={`modal ${draggable ? 'draggable' : ''}`}>
        <div
          ref={this.modalRef}
          onClick={() => this.closeModal(closeCallback, 'ok', this.props.disallowBgClose ? false : true)}
          id={`modalOverlay-${identifier}`}
          className={`modalOverlay`} style={prefix({ ...overlayStyle, ...modalOverlayStyle})}
        >
          <Waypoint
            onEnter={this.onEnter}
            onLeave={this.onExit}
            bottomOffset={'100px'}
          />
          {draggable ?
		        <Draggable
		          allowAnyClick={false}
		          handle={'.handle'}
		        >
							{modalContent}
		        </Draggable>
          :
            modalContent
          }
        </div>
      </div>
    )
  }
}

Modal.defaultProps = {
  disallowBgClose: false,
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
  actions: false,
  iconClose: <span className='icon icon-x'></span>,
  draggable: false,
	draggableTitle: ''
};

function mapStateToProps(state, props) {

  return {
    modals: state.modal
  }
}

export default connect(mapStateToProps, {
})(Modal)
