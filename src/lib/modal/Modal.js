import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as Effect from './ModalEffect';
import { cloneObj, isEmpty } from '../common/utility';
import animateScrollTo from 'animated-scroll-to';
import Waypoint from 'react-waypoint';
import Fade from '../common/Fade';
import GBLink from '../common/GBLink';
import Draggable from 'react-draggable';
import * as util from '../common/utility';

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
    this.onEnter = this.onEnter.bind(this);
    this.onExit = this.onExit.bind(this);
    this.toTop = this.toTop.bind(this);
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
    this.modalContentRef = React.createRef();
  }

  componentDidMount() {
    //window.addEventListener('resize', this.handleResize.bind(this));
    if (this.props.open) {
      const appRoot = document.getElementById('app-root');
      const blurClass = this.props.blurClass;
      if (!appRoot.classList.contains(blurClass)) appRoot.classList.add(blurClass);
      setTimeout(() => this.setState({open: true}) ,0);
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.open && this.state.open && this.props.opened) {
      this.closeModal();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.closeTimer);
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.closeModal('unmounted');
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
    animateScrollTo(0, { element: this.modalContentRef.current });
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

  closeModal(type = 'ok', allowClose = true) {
    const {
      modals,
      identifier
    } = this.props;
    const bindthis = this;
    const transitionTimeMS = this.getTransitionDuration();

    const appRoot = document.getElementById('app-root');
    const blurClass = bindthis.props.blurClass;
    let openModals = [];
    if (!util.isEmpty(modals)) {
      const filtered = util.filterObj(modals, 'open', true);
      openModals = Object.keys(filtered);
      const index = openModals.indexOf(identifier);
      if (index !== -1) {
        openModals.splice(index, 1);
      }
    }
    if (appRoot.classList.contains(blurClass) && util.isEmpty(openModals)) {
      const classRemoved = appRoot.classList.remove(blurClass);
    }

    if (allowClose) {
      this.setState({open: false});
      this.closeTimer = setTimeout(() => {
        window.postMessage(bindthis.props.identifier, '*');
        if (bindthis.props.closeCallback) bindthis.props.closeCallback(type);
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
      closeBtnShow,
      customStyle,
      customOverlay,
      className,
      iconClose,
      appRef,
      identifier,
      draggable,
      draggableTitle,
      draggableTitleClass,
      buttonGroup,
      modalContentAlt,
      forceShowModalGraphic
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

    const modalContent =
      <div
        id={`modalContent-${identifier}`}
        ref={this.modalContentRef}
        className={`modalContent ${className}`}
        style={prefix({ ...contentStyle, ...transition_style, ...openEffect })}
        onClick={stopPropagation}
      >
        <Waypoint
          onEnter={this.onEnter}
          onLeave={this.onExit}
          bottomOffset={'100px'}
        />
        {(closeBtn) && <button style={closeBtnStyle} className='modalCloseBtn' onClick={() => this.closeModal('ok')}>{iconClose}</button>}
        <div className='modalTop'>
          <img width="100%" height='50px' src='https://cdn.givebox.com/givebox/public/images/modalTop.svg' />
          {/*
          <svg
            height="100%"
            width="100%"
            id="svg"
            viewBox="0 0 1440 400"
            xmlns="http://www.w3.org/2000/svg"
            className="transition duration-300 ease-in-out delay-150"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="gradient"
                gradientTransform="rotate(5)"
              >
                <stop offset="5%" stopColor="#5d45d8" stopOpacity="1"></stop>
                <stop offset="35%" stopColor="#1d63ef" stopOpacity=".8"></stop>
                <stop offset="85%" stopColor="#01eee7" stopOpacity=".4"></stop>
                <stop offset="100%" stopColor="#ed8f90" stopOpacity=".2"></stop>
              </linearGradient>
            </defs>
            <path d="M 0,400 C 0,400 0,200 0,200 C 91.39712918660285,171.08133971291866 182.7942583732057,142.16267942583733 272,130 C 361.2057416267943,117.83732057416269 448.22009569377997,122.43062200956939 544,156 C 639.77990430622,189.5693779904306 744.3253588516748,252.11483253588517 851,273 C 957.6746411483252,293.88516746411483 1066.4784688995214,273.11004784689 1165,254 C 1263.5215311004786,234.88995215311002 1351.7607655502393,217.444976076555 1440,200 C 1440,200 1440,400 1440,400 Z" stroke="none" strokeWidth="0" fill="url(#gradient)" className="transition-all duration-300 ease-in-out delay-150" transform="rotate(-180 720 200)">
            </path>
          </svg>
          */}
        </div>
        {draggable ?
          <div className='handle'>
            {!mobile ? <span className='icon icon-move'></span> : <></>}
            <span className={`draggableTitle editingText ${draggableTitleClass}`}>
              {draggableTitle}
            </span>
          </div>
          : <></>
        }
        {this.renderChildren()}
        { buttonGroup && !mobile ?
          <div className='modalButtonGroup'>
            {buttonGroup}
          </div>
        : <></> }
        {this.renderActions()}
        <Fade
          duration={500}
          in={this.state.scrolled}
        >
          <GBLink onClick={this.toTop} className={`modalToTop ${this.state.scrolled ? '' : 'displayNone'}`}><span className='icon icon-chevron-up'></span></GBLink>
        </Fade>
        <div className='modalBottom'>
          <img width="100%" height='50px' src='https://cdn.givebox.com/givebox/public/images/modalBottom.svg' />
          {/*
          <svg
            height="100%"
            width="100%"
            id="svg"
            viewBox="0 0 1440 400"
            xmlns="http://www.w3.org/2000/svg"
            className="transition duration-300 ease-in-out delay-150"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="gradient"
                gradientTransform="rotate(5)"
              >
                <stop offset="5%" stopColor="#5d45d8" stopOpacity="1"></stop>
                <stop offset="35%" stopColor="#1d63ef" stopOpacity=".8"></stop>
                <stop offset="85%" stopColor="#01eee7" stopOpacity=".4"></stop>
                <stop offset="100%" stopColor="#ed8f90" stopOpacity=".2"></stop>
              </linearGradient>
            </defs>
            <path d="M 0,400 C 0,400 0,200 0,200 C 91.39712918660285,171.08133971291866 182.7942583732057,142.16267942583733 272,130 C 361.2057416267943,117.83732057416269 448.22009569377997,122.43062200956939 544,156 C 639.77990430622,189.5693779904306 744.3253588516748,252.11483253588517 851,273 C 957.6746411483252,293.88516746411483 1066.4784688995214,273.11004784689 1165,254 C 1263.5215311004786,234.88995215311002 1351.7607655502393,217.444976076555 1440,200 C 1440,200 1440,400 1440,400 Z" stroke="none" strokeWidth="0" fill="url(#gradient)" className="transition-all duration-300 ease-in-out delay-150">
            </path>
          </svg>
          */}
        </div>
      </div>
    ;

    return (
      <div className={`modal ${className} ${draggable ? 'draggable' : ''} ${forceShowModalGraphic ? 'forceShowModalGraphic' : ''}`}>
        <div
          ref={this.modalRef}
          onClick={() => this.closeModal('ok', this.props.disallowBgClose ? false : true)}
          id={`modalOverlay-${identifier}`}
          className={`modalOverlay`} style={prefix({ ...overlayStyle, ...modalOverlayStyle})}
        >
          {mobile && buttonGroup ?
            <div className='modalButtonGroup'>
              {buttonGroup}
              {(closeBtn) && <button style={closeBtnStyle} className='modalCloseBtn' onClick={() => this.closeModal('ok')}>{iconClose}</button>}
            </div>
          : <></> }
          {draggable && !mobile ?
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
  mobileBreakpoint: 768,
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
  draggableTitle: '',
  draggableTitleClass: '',
  blurClass: 'blur',
  forceShowModalGraphic: false
};

function mapStateToProps(state, props) {

  return {
    modals: state.modal
  }
}

export default connect(mapStateToProps, {
})(Modal)
