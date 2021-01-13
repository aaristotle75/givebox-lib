import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import GBLink from '../../../common/GBLink';
import ModalLink from '../../../modal/ModalLink';
import Icon from '../../../common/Icon';
import Layout from '../../Layout';
import ReceiptEmail from '../receipt/ReceiptEmail';
import {
  updateAdmin,
  updateInfo,
  toggleAdminLeftPanel,
  setLoading,
  closeHelper,
  updateHelperSteps
} from '../../redux/gbx3actions';
import Toggle from 'react-toggle';
import { FaPalette } from 'react-icons/fa';
import { GoBeaker } from 'react-icons/go';
import { FiPenTool } from 'react-icons/fi';
import { AiOutlineNotification } from 'react-icons/ai';
import BasicBuilderSteps from './BasicBuilderSteps';
import BasicBuilderMenu from './BasicBuilderMenu';
import { builderStepsConfig } from './builderStepsConfig';

const GBX3_URL = process.env.REACT_APP_GBX_URL;

class BasicBuilder extends React.Component {

  constructor(props) {
    super(props);
    this.renderDisplay = this.renderDisplay.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.renderTopPanel = this.renderTopPanel.bind(this);
    this.changePreviewDevice = this.changePreviewDevice.bind(this);
    this.previewReceipt = this.previewReceipt.bind(this);
    this.previewArticle = this.previewArticle.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.gotoStep = this.gotoStep.bind(this);
    this.stepCompleted = this.stepCompleted.bind(this);
    this.state = {
    };
    this.iframePreviewRef = React.createRef();
    this.config = util.getValue(builderStepsConfig, props.kind, []);
    this.steps = this.config.length - 1;
    const mobile = props.breakpoint === 'mobile' ? true : false;
  }

  renderTopPanel() {
    const {
      createType,
      breakpoint,
      previewMode,
      previewDevice,
      advancedBuilder,
      openAdmin: open
    } = this.props;

    const mobile = breakpoint === 'mobile' ? true : false;
    const leftSide = [];
    const middle = [];
    const rightSide = [];

    if (!previewMode && !mobile) {
      leftSide.push(
        <div
          className='leftSide'
          key='leftSide'
        >
          <Toggle
            icons={false}
            checked={advancedBuilder}
            onChange={this.props.toggleBuilder}
          />
          <GBLink className='link side' style={{ marginRight: 10 }} onClick={this.props.toggleBuilder}>{ mobile ? <Icon><GoBeaker /></Icon> : <span>Advanced Builder</span> }</GBLink>
        </div>
      );
    }

    if (!mobile) {
      rightSide.push(
        <div
          className='rightSide'
          key='rightSide'
        >
          <GBLink className='link side' style={{ marginRight: 10 }} onClick={this.togglePreview}>{ mobile ? <span className='icon icon-eye'></span> : <span>Preview Mode</span> }</GBLink>
          <Toggle
            icons={false}
            checked={previewMode}
            onChange={this.togglePreview}
          />
        </div>
      );
    } else {
      rightSide.push(<div className='rightSide' key='rightSide'>&nbsp;</div>)
    }

    if (previewMode) {
      middle.push(
        <div key={'middle'} className='button-group middle'>
          <GBLink className={`ripple link ${previewDevice === 'phone' ? 'selected' : ''}`} onClick={() => this.previewArticle('phone')}><span className='icon icon-smartphone'></span><span className='iconText'>Mobile</span></GBLink>
          <GBLink className={`ripple link ${previewDevice === 'desktop' ? 'selected' : ''}`} onClick={() => this.previewArticle('desktop')}><span className='icon icon-monitor'></span><span className='iconText'>Desktop</span></GBLink>
          <GBLink className={`ripple link ${previewDevice === 'receipt' ? 'selected' : ''}`} onClick={() => this.previewReceipt()}><span className='icon icon-mail'></span><span className='iconText'>Receipt</span></GBLink>
        </div>
      );
    } else {
      middle.push(
        <div key={'middle'} className='topMiddleTitle'>
          Welcome to Givebox Form Builder
        </div>
      );
    }

    return (
      <div id='topPanelContainer' className='topPanelContainer'>
        <div className='leftSide'>
          {leftSide}
        </div>
        <div className='middle centerAlign adminPanelTabs'>
          {middle}
        </div>
        {rightSide}
      </div>
    )
  }

  togglePreview() {

    const {
      createType
    } = this.props;

    const previewMode = this.props.previewMode ? false : true;
    let previewDevice = 'desktop';

    if (createType === 'receipt') {
      previewDevice = 'receipt';
      if (this.props.previewMode) {
        const iframeEl = document.getElementById('emailIframePreview');
        if (iframeEl) {
          iframeEl.contentWindow.location.replace('about:blank');
        }
      }
    }
    this.props.closeHelper();
    this.props.updateAdmin({ previewDevice, previewMode, editable: previewMode ? false : true });
  }

  async changePreviewDevice(previewDevice) {
    this.props.setLoading(true);
    const adminUpdated = await this.props.updateAdmin({ previewDevice });
    if (adminUpdated) {
      this.timeout = setTimeout(() => {
        this.props.setLoading(false);
        this.timeout = null;
      }, 0);
    }
  }

  previewReceipt() {
    this.props.updateAdmin({ createType: 'receipt', previewDevice: 'receipt' });
  }

  async previewArticle(previewDevice) {
    const createTypeUpdated = await this.props.updateAdmin({ createType: 'layout' });
    if (createTypeUpdated) {
      this.changePreviewDevice(previewDevice);
    }
  }

  renderDisplay() {
    const {
      createType,
      previewDevice,
      previewMode,
      articleID,
      completed,
      openAdmin
    } = this.props;

    const items = [];

    if (previewMode) {
      switch(createType) {
        case 'receipt': {
          items.push(
            <div key='receipt' className='gbx3ReceiptLayout'>
              <div className='gbx3ReceiptContainer'>
                <div className='block'>
                  <iframe id='emailIframePreview' className='emailIframe' style={{ height: previewMode ? '100vh' : 0 }} ref={this.iframePreviewRef} title='Email iFrame Preview'></iframe>
                  <ReceiptEmail iframePreviewRef={this.iframePreviewRef} />
                </div>
              </div>
            </div>
          );
          break;
        }

        case 'layout':
        default: {
          items.push(
            <div
              key={'layout'}
              className={`deviceLayoutWrapper ${previewDevice}Wrapper` }>
              <div className='stagePreview'>
                <iframe src={`${GBX3_URL}/${articleID}/?public&preview`} title={`${util.toTitleCase(previewDevice)} Preview`} />
              </div>
            </div>
          );
          break;
        }
      }
    } else {
      items.push(
        <BasicBuilderSteps
          key={'basicBuilder'}
          gotoStep={this.gotoStep}
          nextStep={this.nextStep}
          previousStep={this.previousStep}
          stepCompleted={this.stepCompleted}
          config={this.config}
          steps={this.steps}
          completed={completed}
          openAdmin={openAdmin}
          exitAdmin={this.props.exitAdmin}
          toggleBuilder={this.props.toggleBuilder}
        />
      )
    }

    return items;
  }

  gotoStep(gotoStep) {
    const {
      step
    } = this.props;
    this.props.updateHelperSteps({ step: +gotoStep });
  }

  previousStep() {
    const {
      step
    } = this.props;
    const prevStep = step > 0 ? step - 1 : step;
    this.props.updateHelperSteps({ step: prevStep });
  }

  nextStep() {
    const {
      step
    } = this.props;
    const nextStep = step < +this.steps ? step + 1 : step;
    return nextStep;
  }

  async stepCompleted(step) {
    let updated = false;
    const completed = [ ...this.props.completed ];
    if (!completed.includes(step)) {
      completed.push(step);
      updated = await this.props.updateHelperSteps({ completed });
    } else {
      updated = true;
    }
    return updated;
  }

  render() {

    const {
      step,
      createType,
      completed,
      openAdmin: open
    } = this.props;

    return (
      <>
        <div className={`topPanel`}>
          {this.renderTopPanel()}
        </div>
        <div className={`leftPanel ${open ? 'open' : 'close'}`}>
          <div className='leftPanelOpenButton' onClick={this.props.toggleAdminLeftPanel}><span className='icon icon-menu'></span></div>
          <BasicBuilderMenu
            config={this.config}
            steps={this.steps}
            gotoStep={this.gotoStep}
            step={step}
            completed={completed}
          />
        </div>
        <div
          id='GBX3StageAligner'
          className='stageAligner'
        >
          <div
            key={'form'}
            className={`stageContainer ${open ? 'open' : 'close'}`}
          >
            {this.renderDisplay()}
          </div>
        </div>
      </>
    )
  }
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const breakpoint = util.getValue(gbx3, 'info.breakpoint');
  const admin = util.getValue(gbx3, 'admin', {});
  const articleID = util.getValue(gbx3, 'info.articleID');
  const previewMode = util.getValue(admin, 'previewMode');
  const previewDevice = util.getValue(admin, 'previewDevice');
  const openAdmin = util.getValue(admin, 'open');
  const createType = util.getValue(admin, 'createType');

  return {
    breakpoint,
    articleID,
    previewMode,
    previewDevice,
    openAdmin,
    createType,
    completed: util.getValue(state, 'gbx3.helperSteps.completed', []),
    step: util.getValue(state, 'gbx3.helperSteps.step', 0),
    kind: util.getValue(state, 'gbx3.info.kind', 'fundraiser')
  }
}

export default connect(mapStateToProps, {
  updateAdmin,
  updateInfo,
  toggleAdminLeftPanel,
  setLoading,
  closeHelper,
  updateHelperSteps
})(BasicBuilder);
