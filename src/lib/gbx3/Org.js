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
  setPageState,
  setPageSearch,
  createFundraiser,
  clearGBX3,
  loadPostSignup
} from './redux/gbx3actions';
import {
  saveGlobal
} from './redux/orgActions';
import OrgPage from './pages/OrgPage';

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
    this.reloadGetArticles = this.reloadGetArticles.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.getArticlesCallback = this.getArticlesCallback.bind(this);
    this.getArticleSearchCallback = this.getArticleSearchCallback.bind(this);
    this.setPageState = this.setPageState.bind(this);
    this.setPageSearch = this.setPageSearch.bind(this);
    this.resetPageSearch = this.resetPageSearch.bind(this);
    this.createFundraiser = this.createFundraiser.bind(this);
    this.createFundraiserCallback = this.createFundraiserCallback.bind(this);
    this.createCallback = this.createCallback.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.renderOrgPage = this.renderOrgPage.bind(this);
    this.state = {
      defaultTitle: props.title,
      pageSearch: {},
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
      this.reloadGetArticles('gbx3ExitCallback');
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
      stage
    } = this.props;

    const isAdmin = stage === 'admin' ? true : false;
    const options = [];

    Object.entries(pages).forEach(([key, value]) => {
      const enabled = pagesEnabled.includes(key) ? true : false;
      if (enabled || isAdmin) {
        const primaryText = util.getValue(value, 'name', key);
        const secondaryText = !enabled ? <span className='gray'>Disabled</span> : null;
        const rightText = value.slug === pageSlug ? <span className='icon icon-check'></span> : null;
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

  /**
  *
  * Get Articles, reload Articles, search
  */
  async reloadGetArticles(debug = 'unknown') {
    this.setPageState({
      list: [],
      search: {},
      pageNumber: 1,
      total: 0
    }, () => this.getArticles({ reset: true, reload: true, pageNumber: 1 }))
  }

  resetPageSearch() {
    this.setPageState({ search: {} }, () => {
      this.setPageSearch({
        query: ''
      });
    })
  }

  async setPageSearch(search, callback) {
    const {
      pageSlug
    } = this.props;

    const stateUpdated = await this.props.setPageSearch(pageSlug, search);
    if (stateUpdated && callback) {
      callback();
    }
  }

  /**
  * Page State Properties
  *
  * @param {object} newState Following props are available
  *
  * // newState props //
  * @prop {array} list List of article items
  * @prop {int} pageNumber
  * @prop {object} search
  * @prop {int} total Total number of article items
  */
  async setPageState(newState = {}, callback) {
    const {
      pageSlug
    } = this.props;

    const stateUpdated = await this.props.setPageState(pageSlug, newState);
    if (stateUpdated && callback) {
      callback();
    }
  }

  getArticles(options = {}) {
    const opts = {
      reset: false,
      max: 50,
      reload: false,
      filter: '',
      query: '',
      search: false,
      showFetching: true,
      pageNumber: null,
      ...options
    };

    const {
      pages,
      activePage,
      customList,
      useCustomList,
      kind,
      pageSlug,
      orgID
    } = this.props;

    const pageState = opts.reset ? {} : {
      ...this.props.pageState[pageSlug]
    };

    const pageNumber = opts.pageNumber ? opts.pageNumber : opts.search ? util.getValue(pageState, 'search.pageNumber', 1) : util.getValue(pageState, 'pageNumber', 1);
    const kindFilter = kind === 'all' || !kind ? '' : `%3Bkind:"${kind}"`;
    const customFilter = !util.isEmpty(customList) ? util.customListFilter(customList) : null;
    const baseFilter = customFilter && useCustomList ? customFilter : `landing:true%3Bvolunteer:false${kindFilter}`;
    const filter = `${baseFilter}${opts.filter ? `%3B${opts.filter}` : ''}`;

    this.props.getResource('orgArticles', {
      orgID,
      customName: `${pageSlug}List`,
      reload: opts.reload,
      search: {
        filter,
        query: opts.query,
        max: opts.max,
        page: pageNumber,
        sort: useCustomList ? 'orderBy,createdAt' : 'createdAt,orderBy',
        order: useCustomList ? 'asc' : 'desc'
      },
      callback: (res, err) => {
        if (opts.search) {
          this.getArticleSearchCallback(res, err, opts.query);
        } else {
          this.getArticlesCallback(res, err, opts.reset);
        }
      }
    });
  }

  getArticleSearchCallback(res, err, query) {
    const {
      pageSlug
    } = this.props;

    const pageState = {
      ...this.props.pageState[pageSlug]
    };

    const pageSearch = util.getValue(this.state.pageSearch, pageSlug);
    const data = util.getValue(res, 'data', []);
    const pageNumber = util.getValue(pageState, 'search.pageNumber', 1);
    const list = util.getValue(pageState, 'search.list', []);
    const total = +util.getValue(res, 'total', 0);

    if (!util.isEmpty(data)) {
      if (!has(pageState, 'search')) pageState.search = {};
      pageState.search.pageNumber = total > list.length ? pageNumber + 1 : pageNumber;
      pageState.search.list = pageSearch === query ? [...list, ...data] : [...data];
      pageState.search.total = total;
      this.setPageState(pageState);
    } else {
      this.resetPageSearch();
    }
  }

  getArticlesCallback(res, err, reset) {
    const {
      pageSlug
    } = this.props;

    const pageState = reset ? {} : {
      ...this.props.pageState[pageSlug]
    };

    const data = util.getValue(res, 'data', []);
    const pageNumber = util.getValue(pageState, 'pageNumber', 1);
    const list = util.getValue(pageState, 'list', []);
    const total = +util.getValue(res, 'total', 0);

    if (!util.isEmpty(data)) {
      pageState.pageNumber = total > list.length ? pageNumber + 1 : pageNumber;
      pageState.list = [...list, ...data];
      pageState.total = total;
      pageState.search = {};
      this.setPageState(pageState);
    }
  }

  /**
  * End Get Articles
  */

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
                if (callback) callback();
                this.reloadGetArticles();
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
            this.reloadGetArticles();
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

    const isEditable = hasAccessToEdit && editable ? true : false;
    const isAdmin = stage === 'admin' ? true : false;

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
        reloadGetArticles={this.reloadGetArticles}
        getArticles={this.getArticles}
        setPageSearch={this.setPageSearch}
        resetPageSearch={this.resetPageSearch}
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
    editable,
    breakpoint,
    isMobile,
    title,
    pageState,
    pageSearch,
    cameFromNonprofitAdmin
  }
}

export default connect(mapStateToProps, {
  updateInfo,
  saveOrg,
  getResource,
  sendResource,
  setPageState,
  setPageSearch,
  saveGlobal,
  createFundraiser,
  clearGBX3,
  updateOrgPage
})(Org);
