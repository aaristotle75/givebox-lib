import React from 'react';
import { connect } from 'react-redux';
import * as util from '../common/utility';
import * as types from '../common/types';
import Image from '../common/Image';
import GBLink from '../common/GBLink';
import history from '../common/history';
import Dropdown from '../form/Dropdown';
import Loader from '../common/Loader';
import ModalLink from '../modal/ModalLink';
import has from 'has';
import {
  getResource,
  sendResource
} from '../api/helpers';
import {
  updateOrgPage,
  updateInfo,
  saveOrg,
  updatePageState,
  resetPageSearch,
  updatePageSearch,
  createFundraiser,
  clearGBX3,
  loadPostSignup
} from './redux/gbx3actions';
import {
  saveGlobal,
  getArticles,
  reloadGetArticles,
  openOrgAdminMenu
} from './redux/orgActions';
import OrgPage from './pages/OrgPage';
import OrgModalRoutes from './OrgModalRoutes';

const GBX_URL = process.env.REACT_APP_GBX_URL;

class Org extends React.Component {

  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.resizer = this.resizer.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.pageLinks = this.pageLinks.bind(this);
    this.morePageOptions = this.morePageOptions.bind(this);
    this.adminPageOptions = this.adminPageOptions.bind(this);
    this.pageDropdown = this.pageDropdown.bind(this);
    this.onClickPageLink = this.onClickPageLink.bind(this);
    this.onClickArticle = this.onClickArticle.bind(this);
    this.createFundraiser = this.createFundraiser.bind(this);
    this.createFundraiserCallback = this.createFundraiserCallback.bind(this);
    this.createCallback = this.createCallback.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.renderOrgPage = this.renderOrgPage.bind(this);
    this.state = {
      defaultTitle: props.title,
      loading: false
    };
  }

  componentDidMount() {
    this.onBreakpointChange();
    window.addEventListener('resize', this.resizer);
    window.addEventListener('message', this.getMessage, false);
  }

  getMessage(e) {
    if (e.data === 'gbx3ExitCallback') {
      this.props.reloadGetArticles('gbx3ExitCallback');
    }
  }

  async onClickArticle(ID, adminLink = false) {
    const {
      stage,
      preview
    } = this.props;
    const infoUpdated = await this.props.updateInfo({ originTemplate: 'org' });
    if (infoUpdated) {
      if (stage === 'admin' && !preview && !adminLink) {
        console.log('execute onClickArticle do admin stuff -> ', ID);
      } else {
        history.push(`${GBX_URL}/${ID}`);
        this.props.reloadGBX3(ID);
      }
    }
  }

  async onClickPageLink(activePageSlug) {
    const updatedInfo = await this.props.updateInfo({ activePageSlug });
    if (updatedInfo) {
      //this.props.scrollTo('infinite-scroll');
    }
  }

  resizer(e) {
    this.onBreakpointChange();
  }

  async onBreakpointChange() {
    const {
      breakpointWidth
    } = this.props;

    let breakpoint = 'desktop';
    if (window.innerWidth <= this.props.breakpointWidth) {
      breakpoint = 'mobile';
    }
    if (breakpoint !== this.props.breakpoint) {
      const infoUpdated = await this.props.updateInfo({ breakpoint });
    }
  }

  pageLinks() {
    const {
      pagesEnabled,
      pageSlug,
      pages,
      stage
    } = this.props;

    const links = [];
    const isAdmin = stage === 'admin' ? true : false;

    pagesEnabled.forEach((key) => {
      const value = util.getValue(pages, key, {});
      const primaryText = util.getValue(value, 'name', key);
      const active = value.slug === pageSlug ? true : false;
      links.push(
        <GBLink
          key={key}
          className={`link ${active ? 'active' : ''}`}
          onClick={() => active ? console.log('Active Link') : this.onClickPageLink(value.slug)}
        >
          {primaryText}
        </GBLink>
      );
    });

    return links;
  }

  morePageOptions() {
    const {
      pagesEnabled,
      pageSlug,
      pages
    } = this.props;

    const options = [];

    pagesEnabled.forEach((val, key) => {
      const value = util.getValue(pages, val, {});
      const primaryText = util.getValue(value, 'name', val);
      const rightText = value.slug === pageSlug ? <span className='icon icon-check'></span> : null;
      options.push({ key: val, rightText, primaryText, value: value.slug });
    });

    return options;
  }

  adminPageOptions() {
    const {
      pagesEnabled,
      pageSlug,
      pages,
      stage,
      orgSlug
    } = this.props;

    const isAdmin = stage === 'admin' ? true : false;
    const options = [];

    Object.entries(pages).forEach(([key, value]) => {
      const pageURL = `${GBX_URL}/${orgSlug}?page=${util.getValue(value, 'customSlug', value.slug)}`;
      const enabled = pagesEnabled.includes(key) ? true : false;
      if (enabled || isAdmin) {
        const primaryText = util.getValue(value, 'name', key);
        const secondaryText =
          <div>
            <span>{pageURL}</span>
            {!enabled ? <span style={{ display: 'block' }} className='gray'>Disabled</span> : null}
          </div>
        ;
        const rightText = value.slug === pageSlug ?
          <span className='icon icon-check'></span>
        : null;
        options.push({ key, rightText, secondaryText, primaryText, value: value.slug });
      }
    });

    return options;
  }

  pageDropdown(options = [], label = 'More') {
    return (
      <Dropdown
        name='page'
        label={''}
        selectLabel={label}
        fixedLabel={false}
        onChange={(name, value) => {
          this.onClickPageLink(value);
        }}
        options={options}
      />
    )
  }

  async removeCard(articleID, kind, kindID, callback) {
    const {
      pageSlug,
      activePage,
      orgID
    } = this.props;

    const customList = [ ...util.getValue(activePage, 'customList', []) ];
    const useCustomList = util.getValue(activePage, 'useCustomList', false);

    if (articleID) {
      if (useCustomList) {
        if (customList.includes(articleID)) {
          customList.splice(customList.findIndex(l => l === articleID), 1);
          const data = {
            customList
          };
          const pageUpdated = await this.props.updateOrgPage(pageSlug, data);
          if (pageUpdated) {
            this.props.saveOrg({
              orgID,
              isSending: true,
              orgUpdated: true,
              callback: (res, err) => {
                if (callback) callback(res, err);
                this.props.reloadGetArticles();
              }
            });
          }
        }
      } else {
        this.props.sendResource(types.kind(kind).api.publish, {
          orgID,
          id: [kindID],
          method: 'patch',
          isSending: true,
          data: {
            landing: false
          },
          callback: (res, err) => {
            if (callback) callback(res, err);
            this.props.reloadGetArticles();
          }
        });
      }
    }
  }


  /**
  *  Create Article
  */
  async createFundraiser(kind) {
    this.setState({ loading: true }, () => {
      this.props.createFundraiser(kind, this.createFundraiserCallback, null, { showNewArticle: true });
    });
  }

  createFundraiserCallback(res, err) {
    if (this.createCallback) this.createCallback(res, err, () => {
      this.setState({ loading: false });
    });
  }

  async createCallback(res, err, callback) {
    const {
      pageSlug,
      activePage,
      orgID
    } = this.props;

    const customList = [ ...util.getValue(activePage, 'customList', []) ];
    const useCustomList = util.getValue(activePage, 'useCustomList', false);

    if (!util.isEmpty(res) && !err) {
      const articleID = util.getValue(res, 'articleID');
      if (articleID) {
        if (useCustomList) {
          if (!customList.includes(articleID)) {
            customList.unshift(articleID);
            const data = {
              customList
            };
            const pageUpdated = await this.props.updateOrgPage(pageSlug, data);
            if (pageUpdated) {
              this.props.saveOrg({
                orgID,
                isSending: true,
                orgUpdated: true,
                showSaving: true,
                callback: (res, err) => {
                  if (callback) callback();
                }
              });
            }
          }
        }
      } else {
        if (callback) callback();
      }
    } else {
      if (callback) callback();
    }
  }

  selectKindOptions() {
    const options = [];
    types.kinds().forEach((value) => {
      options.push(
        { primaryText: <span className='labelIcon'><span className={`icon icon-${types.kind(value).icon}`}></span> Create {types.kind(value).name}</span>, value }
      );
    });
    return options;
  }

  renderOrgPage() {
    const {
      isVolunteer,
      editable,
      hasAccessToEdit,
      breakpoint,
      stage,
      pages,
      pageSlug,
      isMobile,
      title,
      cameFromNonprofitAdmin
    } = this.props;

    const isEditable = hasAccessToEdit && editable && !isVolunteer ? true : false;
    const isAdmin = stage === 'admin' && hasAccessToEdit && !isVolunteer ? true : false;

    const morePageOptions = this.morePageOptions();
    const adminPageOptions = this.adminPageOptions();
    const selectKindOptions = this.selectKindOptions();

    return (
      <OrgPage
        {...this.props}
        isEditable={isEditable}
        isAdmin={isAdmin}
        morePageOptions={morePageOptions}
        adminPageOptions={adminPageOptions}
        saveGlobal={this.props.saveGlobal}
        pageLinks={this.pageLinks}
        pageDropdown={this.pageDropdown}
        onClickArticle={this.onClickArticle}
        reloadGetArticles={this.props.reloadGetArticles}
        openOrgAdminMenu={this.props.openOrgAdminMenu}
        getArticles={this.props.getArticles}
        setPageSearch={this.props.updatePageSearch}
        resetPageSearch={this.props.resetPageSearch}
        removeCard={this.removeCard}
        createFundraiser={this.createFundraiser}
        selectKindOptions={selectKindOptions}
      />
    )
  }

  render() {

    return (
      <>
        {this.state.loading ? <Loader msg='Creating...' /> : null }
        <OrgModalRoutes />
        {this.renderOrgPage()}
      </>
    )
  }

}

function mapStateToProps(state, props) {

  const breakpointWidth = 736;
  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const info = util.getValue(gbx3, 'info', {});
  const orgID = util.getValue(info, 'orgID');
  const stage = util.getValue(info, 'stage');
  const preview = util.getValue(info, 'preview');
  const pages = util.getValue(gbx3, 'orgPages', {});
  const pageSlug = util.getValue(info, 'activePageSlug');
  const activePage = util.getValue(pages, pageSlug, {});
  const pagesEnabled = util.getValue(gbx3, 'orgGlobals.pagesEnabled', []);
  const isVolunteer = util.getValue(admin, 'isVolunteer');
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const breakpoint = util.getValue(info, 'breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;
  const title = util.getValue(gbx3, 'orgGlobals.title.content');
  const customList = util.getValue(activePage, 'customList', []);
  const useCustomList = util.getValue(activePage, 'useCustomList', false);
  const kind = util.getValue(activePage, 'kind');
  const resourceName = `${pageSlug}List`;
  const pageState = util.getValue(gbx3, 'pageState', {});
  const pageSearch = util.getValue(gbx3, 'pageSearch', {});
  const cameFromNonprofitAdmin = util.getValue(info, 'cameFromNonprofitAdmin', false);

  return {
    orgID,
    breakpointWidth,
    stage,
    preview,
    pageSlug,
    pages,
    pagesEnabled,
    kind,
    activePage,
    customList,
    useCustomList,
    hasAccessToEdit,
    isVolunteer,
    editable,
    breakpoint,
    isMobile,
    title,
    pageState,
    pageSearch,
    cameFromNonprofitAdmin,
    orgSlug: util.getValue(state, 'resource.gbx3Org.data.slug')
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  saveOrg,
  getResource,
  sendResource,
  getArticles,
  reloadGetArticles,
  openOrgAdminMenu,
  updatePageState,
  resetPageSearch,
  updatePageSearch,
  saveGlobal,
  createFundraiser,
  clearGBX3,
  updateOrgPage
})(Org);
