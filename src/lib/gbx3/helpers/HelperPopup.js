import React from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../../';
import Fade from '../../common/Fade';
import GBLink from '../../common/GBLink';
import Icon from '../../common/Icon';
import ColorPicker from '../../form/ColorPicker';
import '../../styles/gbx3Helper.scss';
import {
  updateGlobal,
  updateData,
  saveGBX3
} from '../redux/gbx3actions';
import * as Effect from '../../modal/ModalEffect';
//import { FiCheckCircle } from 'react-icons/fi';

const prefix = require('react-prefixr');
const defaultTransition = {
   property : 'all',
   duration : 300,
   timingfunction : 'linear',
};

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

class HelperPopup extends React.Component {

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.transModal = this.transModal.bind(this);
    this.onClose = this.onClose.bind(this);
    this.updatePrimaryColor = this.updatePrimaryColor.bind(this);
    this.renderHelperTypeExtra = this.renderHelperTypeExtra.bind(this);
    this.state = {
      open: false,
      openColorPicker: false,
      effect: effects[props.effect]
    }
  }

  componentDidMount() {
    //window.addEventListener('resize', this.handleResize.bind(this));
    setTimeout(() => this.setState({open: true}, this.props.modalOpenCallback),0);
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

  onClose(callback) {
    const transitionTimeMS = this.getTransitionDuration();
    this.setState({open: false}, () => {
       this.closeTimer = setTimeout(callback, transitionTimeMS);
    });
  }

  getTransitionDuration() {
    const { effect } = this.state;
    if(!effect.transition){
      return defaultTransition.duration;
    }
    return effect.transition.duration || defaultTransition.duration;
  }

  transModal(callback, type = 'ok') {
    const bindthis = this;
    const transitionTimeMS = this.getTransitionDuration();
    this.setState({ open: false });
    this.closeTimer = setTimeout(function() {
      window.postMessage(bindthis.props.identifier, '*');
      if (callback) callback(type);
      bindthis.setState({ open: true });
    }, transitionTimeMS);
  }

  closeModal(callback, type = 'ok', allowClose = true) {
    const bindthis = this;
    const transitionTimeMS = this.getTransitionDuration();
    this.setState({open: false});
    this.closeTimer = setTimeout(function() {
      window.postMessage(bindthis.props.identifier, '*');
      if (callback) callback(type);
    }, transitionTimeMS);
  }

  async updatePrimaryColor(value) {

    const {
      blockType
    } = this.props;

    let globalName = 'gbxStyle';

    const globalUpdated = await this.props.updateGlobal(globalName, {
      primaryColor: value,
      backgroundColor: value
    });
    if (globalUpdated) {
      this.props.saveGBX3(blockType);
    }
  }

  renderHelperTypeExtra() {
    const {
      helper
    } = this.props;

    const {
      openColorPicker
    } = this.state;

    const item = [];

    switch (util.getValue(helper, 'type')) {
      case 'color': {
        item.push(
          <div key={'color'} className='helperColorPicker'>
            <ColorPicker
              open={openColorPicker}
              name='primaryColor'
              fixedLabel={false}
              label=''
              onAccept={(name, value) => {
                this.updatePrimaryColor(value);
              }}
              onCancel={() => console.log('colorPicker cancel')}
              value={''}
              modalID={'helperPrimaryColorPicker'}
              opts={{
                customOverlay: {
                  zIndex: 9999909
                }
              }}
            />
          </div>
        );
        break;
      }

      case 'block':
      case 'share':
      default: {
        break;
      }
    }
    return item;
  }

  render() {

    const {
      helper,
      isLastStep,
      targetElement: el
    } = this.props;

    const {
      open,
      effect,
      mobile,
      closeBtnStyle
    } = this.state;

    const helperClass = util.getValue(helper, 'className');
    const helperStyle = util.getValue(helper, 'style');
    const offsetTop = -110;
    const style = {};
    const rect = el.getBoundingClientRect();

    style.top = rect.y + offsetTop + util.getValue(helperStyle, 'top', 0);
    style.left = rect.x + util.getValue(helperStyle, 'left', 0);

    let transition = effect.transition;

    if (!transition) {
      transition = defaultTransition;
    } else {
      transition = { ...defaultTransition, ...transition };
    }

    const transition_style = {
      transition: `${transition.property} ${(transition.duration/1000)}s ${transition.timingfunction}`
    }

    const openEffect = open ? effect.end : effect.begin;

    return (
      <div
        className='gbx3Helper'
        style={{
          ...util.getValue(helper, 'style', {}),
          ...style
        }}
      >
        <div
          className='helperContainer'
          style={prefix({ ...transition_style, ...openEffect })}
        >
          <div className='closeBtn' onClick={() => this.closeModal(this.props.onClick, 'close')}><span className='icon icon-x'></span></div>
          <div onClick={() => this.props.onClick('edit')} className={`helperBubble ${helperClass}`}>
            <h1>{util.getValue(helper, 'title')}</h1>
            <span className='text'>{util.getValue(helper, 'text')}</span>
            {this.renderHelperTypeExtra()}
          </div>
          <div className='helperDefaultActions'>
            <GBLink onClick={() => this.closeModal(this.props.onClick, 'turnOff')}><span style={{ marginRight: 2 }} className='icon icon-x'></span> Turn Off Help</GBLink>
            { !isLastStep ?
            <GBLink onClick={() => this.transModal(this.props.onClick, 'doLater')}>{util.getValue(helper, 'skipText', 'Next')} <span style={{ marginLeft: 2 }} className='icon icon-chevron-right'></span></GBLink> :
            <GBLink onClick={() => this.closeModal(this.props.onClick, 'close')}>Continue Designing <span style={{ marginLeft: 2 }} className='icon icon-chevron-right'></span></GBLink>
            }
          </div>
        </div>
      </div>
    )
  }
}

HelperPopup.defaultProps = {
  effect: 'scaleUp'
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
  updateGlobal,
  saveGBX3
})(HelperPopup);
