import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
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
import AvatarMenu from '../avatar/AvatarMenu';
import ArticleList from './article/ArticleList';

class Admin extends React.Component {

  constructor(props) {
    super(props);
    this.renderHeaderMiddle = this.renderHeaderMiddle.bind(this);
    this.state = {
      referrerStep: ''
    };
  }

  componentDidMount() {
    const {
      access
    } = this.props;

    const status = util.getValue(access, 'status');
    const role = util.getValue(access, 'role');
    const suspendedPerms = status === 'suspended' && role === 'admin' ? true : false;

    if (suspendedPerms) {
      return window.location.replace(process.env.REACT_APP_LAUNCHPAD_URL);
    } else {
      this.props.updateInfo({ stage: 'admin' });
    }
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
      access,
      project
    } = this.props;

    const isMobile = breakpoint === 'mobile' ? true : false;
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
      const style = {};
      if (util.getValue(access, 'masker')) {
        style.marginTop = 25;
        style.marginRight = 10;
      }
      header.push(
        <GBLink 
          key={'exit'} 
          style={{ fontSize: '14px', ...style }} 
          className='link' 
          onClick={() => {
            if (project === 'share') {
              this.props.updateAdmin({ publicView: true });
              this.props.updateInfo({ stage: 'public' });
            } else {
              this.props.exitAdmin();
            }
          }}>
            { project === 'share' ?
              `View Public Page`
            :
              `Exit ${display === 'org' ? 'Page Editor' : 'Form Editor'}`
            }
        </GBLink>
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
      stage,
      display,
      step,
      previewMode,
      saveStatus,
      editable,
      editFormOnly,
      hasAccessToEdit,
      hasAccessToCreate,
      orgID
    } = this.props;

    if (stage !== 'admin') return <Loader msg='Loading Admin...' />

    if (!hasAccessToEdit && !hasAccessToCreate) return  <div className='flexCenter flexColumn centeritems'>You do not have access.</div>;

    let theme = 'dark';
    if (step === 'create') {
      theme = 'light';
    }

    return (
      <div className={`gbx3AdminLayout ${display}Display ${step}Step ${editable ? 'editable' : ''} ${previewMode ? 'previewMode' : ''} ${editFormOnly ? 'editFormOnly' : ''}`}>
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
                    <AvatarMenu 
                      exitAdmin={this.props.exitAdmin}
                    />
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
  const stage = util.getValue(info, 'stage', {});
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
  const editFormOnly = util.getValue(admin, 'editFormOnly');

  return {
    stage,
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
    editable,
    editFormOnly
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  updateAdmin
})(Admin);
