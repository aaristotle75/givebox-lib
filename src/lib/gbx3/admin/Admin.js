import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import ModalRoute from '../../modal/ModalRoute';
import Icon from '../../common/Icon';
import ArticleAdmin from './article/ArticleAdmin';
import OrgAdmin from './org/OrgAdmin';
import Logo from '../Logo';
import AnimateHeight from 'react-animate-height';
import 'react-toggle/style.css';
import {
  updateInfo,
  updateAdmin
} from '../redux/gbx3actions';
import AvatarMenuButton from './AvatarMenuButton';
import ArticleList from './article/ArticleList';
import { GoDashboard } from 'react-icons/go';

class Admin extends React.Component {

  constructor(props) {
    super(props);
    this.renderHeaderMiddle = this.renderHeaderMiddle.bind(this);
    this.state = {
      referrerStep: ''
    };
  }

  componentDidMount() {
    this.props.updateInfo({ stage: 'admin' });
  }

  goBack(articleID) {
    //this.props.loadGBX3(articleID);
    this.props.updateAdmin({ step: 'design' });
  }

  renderHeaderMiddle() {
    const {
      display,
      isVolunteer,
      articleID,
      step,
      breakpoint,
      access
    } = this.props;

    const isMobile = breakpoint === 'mobile' ? true : false;
    const orgDisplay = display === 'org' ? true : false;
    const header = [];

    switch (display) {
      case 'org': {
        break;
      }

      case 'article':
      default: {
        if (articleID && !isVolunteer) {
          if (step === 'create') {
            header.push(
              <GBLink key={'goback'} style={{ fontSize: '14px' }} onClick={() => this.goBack(articleID)}><span className='icon icon-chevron-left'></span> Go Back</GBLink>
            )
          } else {
            /*
            header.push(
              <GBLink key={'create'} style={{ fontSize: '14px' }} className='link' onClick={() => this.props.loadCreateNew()}><span className='icon icon-plus'></span> { isMobile ? 'New' : 'Create New Form' }</GBLink>
            );
            */
          }
        }
        break;
      }
    }

    if (!util.isEmpty(access)) {
      header.push(
        <GBLink key={'exit'} style={{ fontSize: '14px' }} className='link' onClick={() => this.props.exitAdmin()}><Icon><GoDashboard /></Icon>{ isMobile ? 'Profile' : `Back to Profile` }</GBLink>
      )
    }

    return (
      <div className='headerMiddle'>
        {header}
      </div>
    )
  }

  render() {

    const {
      display,
      step,
      previewMode,
      saveStatus,
      editable,
      hasAccessToEdit,
      hasAccessToCreate,
      orgID
    } = this.props;

    if (!hasAccessToEdit && !hasAccessToCreate) return  <div className='flexCenter flexColumn centeritems'>You do not have access.</div>;

    let theme = 'dark';
    if (step === 'create') {
      theme = 'light';
    }

    return (
      <div className={`gbx3AdminLayout ${display}Display ${step}Step ${editable ? 'editable' : ''} ${previewMode ? 'previewMode' : ''}`}>
        <ModalRoute
          className='gbx3'
          id='articleList'
          effect='3DFlipVert'
          style={{ width: '60%' }}
          disallowBgClose={false}
          component={(props) => <ArticleList {...props} orgID={orgID} />}
        />
        <AnimateHeight height={saveStatus === 'saving' ? 'auto' : 0 } duration={500}>
          <div className='autoSaved'>Saving...</div>
        </AnimateHeight>
        { display === 'org' ?
          <OrgAdmin
            step={step}
            exitAdmin={this.props.exitAdmin}
            reloadGBX3={this.props.reloadGBX3}
          />
        :
          <div className='articleDisplayContainer'>
            <div className={`gbx3TopHeader`}>
              <header className={`navbar`}>
                <div className='container'>
                  <div className='headerLeftSide'>
                    <Logo theme={theme} className='logo' />
                  </div>
                  {this.renderHeaderMiddle()}
                  <div className='headerRightSide'>
                    <AvatarMenuButton />
                  </div>
                </div>
                <div className='headerMiddle'>
                </div>
              </header>
            </div>
            <ArticleAdmin
              step={step}
              exitAdmin={this.props.exitAdmin}
            />
          </div>
        }
      </div>
    )
  }
}

Admin.defaultProps = {
}

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const saveStatus = util.getValue(gbx3, 'saveStatus');
  const info = util.getValue(gbx3, 'info', {});
  const breakpoint = util.getValue(info, 'breakpoint');
  const display = util.getValue(info, 'display');
  const articleID = util.getValue(info, 'articleID');
  const orgID = util.getValue(info, 'orgID');
  const project = util.getValue(info, 'project');
  const admin = util.getValue(gbx3, 'admin', {});
  const step = util.getValue(admin, 'step');
  const isVolunteer = util.getValue(admin, 'isVolunteer');
  const previewMode = util.getValue(admin, 'previewMode');
  const openAdmin = util.getValue(admin, 'open');
  const access = util.getValue(state.resource, 'access');
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const hasAccessToCreate = util.getValue(admin, 'hasAccessToCreate');
  const editable = util.getValue(admin, 'editable');

  return {
    project,
    breakpoint,
    display,
    articleID,
    orgID,
    openAdmin,
    step,
    isVolunteer,
    previewMode,
    saveStatus,
    access,
    hasAccessToEdit,
    hasAccessToCreate,
    admin,
    editable
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  updateAdmin
})(Admin);
