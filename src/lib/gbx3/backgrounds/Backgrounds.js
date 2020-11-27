import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util
} from '../../';
import GBLink from '../../common/GBLink';
import ModalLink from '../../modal/ModalLink';
import ModalRoute from '../../modal/ModalRoute';
import {
  updateBackground,
  saveGBX3
} from '../redux/gbx3actions';
import {
  toggleModal
} from '../../api/actions';
import BackgroundsEdit from './BackgroundsEdit';
import { backgroundTemplate } from './backgroundTemplate';
const ResizableBox = require('react-resizable').Resizable;


class Backgrounds extends Component {

  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);
    this.onResizeStart = this.onResizeStart.bind(this);
    this.setStyle = this.setStyle.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.setBackground = this.setBackground.bind(this);
    const background = props.background;

    this.state = {
      background,
      defaultBackground: util.deepClone(background),
      width: util.getValue(background, 'width', 1000),
      height: util.getValue(background, 'height', 230)
    };
    this.mounted = false;
    this.backgroundRef = React.createRef();
  }

  componentDidMount() {
    this.mounted = true;
    this.setStyle();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.primaryColor !== this.props.primaryColor) {
      this.setStyle();
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  async closeEditModal(type = 'save') {
    const {
      width,
      height
    } = this.state;

    if (type !== 'cancel') {
      const background = {
        ...this.state.background,
        width,
        height
      };
      const backgroundUpdated = await this.props.updateBackground(0, background);
      if (backgroundUpdated) {
        this.props.saveGBX3('org', {
          callback: () => {
            this.setStyle();
          }
        });
      }
    } else {
      this.setState({
        background: util.deepClone(this.state.defaultBackground)
      });
    }
    this.props.toggleModal('background1', false);
  }

  setBackground(background) {
    this.setState({
      background: {
        ...this.state.background,
        ...background
      }
    });
  }

  setStyle() {
    //https://givebox-staging.s3.amazonaws.com/gbx%2F049ecc3320aac6393cbca43f01c3a85b%2F2017-03-31%2Fdefault%2Fmedium
    const {
      primaryColor
    } = this.props;

    const {
      background
    } = this.state;

    const el = document.getElementById('backgroundGBX3Style');
    let style = ``;

    const bgColor = util.getValue(background, 'bgColor', primaryColor);
    const rgb = util.hexToRgb(bgColor);
    const bgColorLight = util.pSBC(0.4, bgColor);
    const rgbLight = util.hexToRgb(bgColorLight);

    const backgroundImage = util.getValue(background, 'imageURL');
    const backgroundBlur = util.getValue(background, 'blur', 0);
    const backgroundOpacity = util.getValue(background, 'opacity', 1);

    const gradient1 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundOpacity})`;
    const gradient2 = `rgba(${rgbLight.r}, ${rgbLight.g}, ${rgbLight.b}, ${backgroundOpacity})`;

    style = `
      .gbx3 .backgroundPanel {
        background: ${gradient1};
        background: -webkit-linear-gradient(to bottom, ${gradient1} 0%, ${gradient2} 70%), url("${backgroundImage}") no-repeat center center fixed;
        background: -moz-linear-gradient(to bottom, ${gradient1} 0%, ${gradient2} 70%), url("${backgroundImage}") no-repeat center center fixed;
        background: linear-gradient(to bottom, ${gradient1} 0%, ${gradient2} 70%), url("${backgroundImage}") no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        filter: blur(${backgroundBlur}px);
        -webkit-filter: blur(${backgroundBlur}px);
      }
    `;

    if (el) {
      el.innerHTML = style;
    } else {
      const styleEl = document.head.appendChild(document.createElement('style'));
      styleEl.setAttribute('id', 'backgroundGBX3Style');
      styleEl.innerHTML = style;
    }

  }

  onResize(e, data) {
    const width = util.getValue(data, 'size.width');
    const height = util.getValue(data, 'size.height');
    this.setState({ width, height });
  }

  async onResizeStop(e, data) {
    const {
      blockType
    } = this.props;

    const el = this.backgroundRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const backgroundUpdated = await this.props.updateBackground(0, {
        height: rect.height
      });
      if (backgroundUpdated) this.props.saveGBX3(blockType);
    }
  }

  onResizeStart(e, data) {
    //console.log('onResizeStart', data);
  }

  render() {

    const {
      background,
      width,
      height
    } = this.state;

    const {
      editable,
      primaryColor,
      stage
    } = this.props;

    return (
      <>
        <ModalRoute
          className='gbx3'
          id={'background1'}
          effect='3DFlipVert' style={{ width: '70%' }}
          draggable={true}
          draggableTitle={`Editing Page Background`}
          closeCallback={this.closeEditModal}
          disallowBgClose={true}
          component={() =>
            <BackgroundsEdit
              setBackground={this.setBackground}
              background={background}
              primaryColor={primaryColor}
            />
          }
          buttonGroup={
            <div style={{ marginBottom: 0 }} className='button-group center'>
              <GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
              <GBLink className='button' onClick={this.closeEditModal}>Save</GBLink>
            </div>
          }
        />
        { editable && stage !== 'public' ?
          <ResizableBox
            width={width}
            height={height}
            axis={'y'}
            maxConstraints={[1000, 2000]}
            minConstraints={[1000, 1]}
            onResize={this.onResize}
            onResizeStop={this.onResizeStop}
            onResizeStart={this.onResizeStart}
            resizeHandles={['sw', 'se']}
          >
            <ModalLink id='background1' type='div' linkRef={this.backgroundRef} style={{ width, height }} className='backgroundPanelResizer'></ModalLink>
          </ResizableBox>
        : ''
        }
        <div style={{ width, height }} className='backgroundPanel'></div>
      </>
    )
  }
}

function mapStateToProps(state, props) {

  const index = 0;
  const stage = util.getValue(state, 'gbx3.info.stage');
  const editable = util.getValue(state, 'gbx3.admin.editable');
  const backgrounds = util.getValue(state, 'gbx3.backgrounds', []);
  const background = util.getValue(backgrounds, index, backgroundTemplate[props.blockType]);
  const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');

  return {
    stage,
    editable,
    background,
    primaryColor
  }
}

export default connect(mapStateToProps, {
  updateBackground,
  saveGBX3,
  toggleModal
})(Backgrounds);
