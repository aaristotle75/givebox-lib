import React from 'react';
import { connect } from 'react-redux';
import * as util from '../common/utility';
import * as types from '../common/types';
import Collapse from '../common/Collapse';
import { Alert } from '../common/Alert';
import {
  getResource,
  savePrefs
} from '../api/helpers';
import {
  toggleModal
} from '../api/actions';
import Paginate from '../table/Paginate';
import GBLink from '../common/GBLink';
import * as launchpadConfig from '../gbx3/admin/launchpad/launchpadConfig';

const LAUNCHPAD_URL = process.env.REACT_APP_LAUNCHPAD_URL;
const GBX_URL = process.env.REACT_APP_GBX_URL;

class RedirectPrefModal extends React.Component {

  constructor(props) {
    super(props);
    this.renderDashboardList = this.renderDashboardList.bind(this);
    this.renderArticleList = this.renderArticleList.bind(this);
    this.selectPref = this.selectPref.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.state = {
      success: false
    };
  }

  componentDidMount() {
    this.getArticles();
  }

  getArticles() {
    this.props.getResource('orgArticles', {
      orgID: this.props.orgID,
      reload: true,
      search: {
        sort: 'createdAt'
      }
    });
  }

  selectPref(url) {
    util.toTop('modalOverlay-redirectPref');
    this.props.savePrefs({ loginRedirectURL: url }, () => {
      this.setState({ success: true }, () => {
        setTimeout(() => {
          this.props.toggleModal('redirectPref', false);
        }, 2000);
      });
    }, { isSending: true });
  }

  renderDashboardList() {
    const {
      loginRedirectURL
    } = this.props;

    const list = [];
    list.push(
      <li key={'profile'} onClick={() => this.selectPref(`${GBX_URL}/${this.props.orgSlug}`)}>
        Nonprofit Page
        { loginRedirectURL === `${GBX_URL}/${this.props.orgSlug}` ?
              <div className='rightSide'>
                Current
              </div>
            : null }           
      </li>
    );

    launchpadConfig.appList.forEach((value, key) => {
      const url = `${LAUNCHPAD_URL}${value.path}`;
      list.push(
        <li key={value.slug} onClick={() => this.selectPref(url)}>
          {value.name}
          { loginRedirectURL === url ?
              <div className='rightSide'>
                Current
              </div>
            : null }          
        </li>
      );
    });

    return (
      <Collapse
        id='dashboardList'
        label='Dashboard'
        iconPrimary='list'
      >  
        <div className='formSectionContainer'>
          <div className='formSection'>   
            <ul className='avatarSelectList'>
              {list}
            </ul>
          </div>
        </div>
      </Collapse>
    )
  }

  renderArticleList() {

    const {
      orgArticlesTotal,
      orgArticles,
      loginRedirectURL
    } = this.props;

    const list = [];
    if (!util.isEmpty(orgArticles)) {
      orgArticles.forEach((value, key) => {
        const url = `${GBX_URL}/${value.ID}`;        
        list.push(
          <li key={value.ID} onClick={() => this.selectPref(url)}>
            {value.title}
            <span className='secondaryText'>{types.kind(value.kind).name}</span>
            { loginRedirectURL === url ?
              <div className='rightSide'>
                Current
              </div>
            : null }
          </li>
        )
      });
    }
    if (!util.isEmpty(list)) {
      return (
        <Collapse
          id='articleList'
          label='Payment Forms'
          iconPrimary='list'
        >
          <div className='formSectionContainer'>
            <div className='formSection'>
              <ul className='avatarSelectList'>
              {list}
              </ul>
              { orgArticlesTotal > 50 ?
                <Paginate
                  name='orgArticles'
                />
              : null }
            </div>
          </div>
        </Collapse>
      )
    }
    return null;
  }

  render() {

    return (
      <div className='modalWrapper avatarSettings'>
        <h2 style={{ display: 'flex' }} className='flexCenter'>Select the Page You Go After Login</h2>
        <Alert alert='success' display={this.state.success} msg='Saved' />
        {this.renderDashboardList()}
        <div style={{ marginTop: 30 }}>
          {this.renderArticleList()}
        </div>
      </div>
    )
  }

}

function mapStateToProps(state, props) {

  const orgID = util.getValue(state, 'resource.access.orgID');
  const orgSlug = util.getValue(state, 'resource.access.orgSlug');
  const orgArticlesTotal = util.getValue(state, 'resource.orgArticles.meta.total', 0);
  const orgArticles = util.getValue(state, 'resource.orgArticles.data', []);
  const loginRedirectURL = util.getValue(state, 'preferences.loginRedirectURL');

  return {
    orgID,
    orgSlug,
    orgArticlesTotal,
    orgArticles,
    loginRedirectURL
  }
}

export default connect(mapStateToProps, {
  getResource,
  savePrefs,
  toggleModal
})(RedirectPrefModal);
