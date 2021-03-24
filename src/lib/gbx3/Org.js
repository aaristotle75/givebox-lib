import React from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import * as util from '../common/utility';
import Image from '../common/Image';
import GBLink from '../common/GBLink';
import ScrollTop from '../common/ScrollTop';
import Dropdown from '../form/Dropdown';
import ModalLink from '../modal/ModalLink';
import has from 'has';
import {
  getResource
} from '../api/helpers';
import {
  updateOrgPage,
  updateOrgGlobal,
  updateData,
  updateInfo,
  setStyle,
  updateAdmin,
  saveOrg,
  setPageState,
  setPageSearch
} from './redux/gbx3actions';
import Header from './pages/Header';
import Pages from './pages/Pages';
import Footer from './Footer';
import history from '../common/history';
import Icon from '../common/Icon';
import { GoDashboard } from 'react-icons/go';

const GBX_URL = process.env.REACT_APP_GBX_URL;

class Org extends React.Component {

  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.resizer = this.resizer.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.pageLinks = this.pageLinks.bind(this);
    this.pageOptions = this.pageOptions.bind(this);
    this.pageDropdown = this.pageDropdown.bind(this);
    this.onClickPageLink = this.onClickPageLink.bind(this);
    this.onClickArticle = this.onClickArticle.bind(this);
    this.saveGlobal = this.saveGlobal.bind(this);
    this.savePage = this.savePage.bind(this);
    this.reloadGetArticles = this.reloadGetArticles.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.getArticlesCallback = this.getArticlesCallback.bind(this);
    this.getArticleSearchCallback = this.getArticleSearchCallback.bind(this);
    this.setPageState = this.setPageState.bind(this);
    this.setPageSearch = this.setPageSearch.bind(this);
    this.resetPageSearch = this.resetPageSearch.bind(this);
    this.state = {
      defaultTitle: props.title,
      pageSearch: {}
    };
  }

  componentDidMount() {
    this.onBreakpointChange();
    window.addEventListener('resize', this.resizer);
  }

  async saveGlobal(name, obj = {}, callback) {
    const globalUpdated = await this.props.updateOrgGlobal(name, obj);
    if (globalUpdated) {
      this.props.saveOrg({
        callback: (res, err) => {
          if (callback) callback();
        }
      })
    }
  }

  async savePage(name, obj = {}, callback) {
    const pageUpdated = await this.props.updateOrgPage(name, obj);
    if (pageUpdated) {
      this.props.saveOrg({
        callback: (res, err) => {
          if (callback) callback();
        }
      })
    }
  }

  async onClickArticle(ID, pageSlug) {
    const {
      stage,
      preview
    } = this.props;
    const infoUpdated = await this.props.updateInfo({ originTemplate: 'org' });
    if (infoUpdated) {
      if (stage === 'admin' && !preview) {
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

  pageOptions() {
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
  reloadGetArticles() {
    this.setPageState({
      list: [],
      search: {},
      pageNumber: 1,
      total: 0
    }, () => this.getArticles({ reload: true, pageNumber: 1 }))
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

    const pageState = {
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
        sort: 'orderBy',
        order: 'asc'
      },
      callback: (res, err) => {
        if (opts.search) {
          this.getArticleSearchCallback(res, err, opts.query);
        } else {
          this.getArticlesCallback(res, err);
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

  getArticlesCallback(res, err) {
    const {
      pageSlug
    } = this.props;

    const pageState = {
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

  render() {

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
    const pageOptions = this.pageOptions();

    return (
      <div className='gbx3Org'>
        <ScrollTop elementID={isAdmin ? 'stageContainer' : 'gbx3Layout'} />
        <div className='gbx3OrgHeader'>
          <div className={'gbx3OrgLogoContainer'} onClick={() => console.log('logo clicked!')}>
            <Image size='thumb' maxSize={35} url={'https://givebox.s3-us-west-1.amazonaws.com/public/gb-logo5.png'} alt='Givebox' />
          </div>
          { cameFromNonprofitAdmin ?
            <div className='gbx3OrgBackToDashboard orgAdminOnly'>
              <GBLink key={'exit'} style={{ fontSize: '14px' }} className='link' onClick={() => this.props.exitAdmin()}><Icon><GoDashboard /></Icon>{ isMobile ? 'Dashboard' : `Back to Dashboard` }</GBLink>
            </div>
          : null }
        </div>
        <div className='gbx3OrgContentContainer'>
          <Header
            saveGlobal={this.saveGlobal}
          />
          <div className='gbx3OrgSubHeader gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <div className='nameSection'>
                <ModalLink
                  id='orgEditTitle'
                  type='div'
                  className='nameSectionContainer orgAdminEdit'
                  opts={{
                    saveGlobal: this.saveGlobal
                  }}
                >
                  <button className='tooltip blockEditButton' id='orgEditTitle'>
                    <span className='tooltipTop'><i />Click to EDIT Title</span>
                    <span className='icon icon-edit'></span>
                  </button>
                </ModalLink>
                <div className='nameSectionContainer'>
                  <div className='nameText'>
                    <div dangerouslySetInnerHTML={{ __html: util.cleanHtml(title) }} />
                  </div>
                </div>
              </div>
              { pageOptions.length > 1 || isAdmin ?
                <div className='navigation'>
                  <ModalLink
                    id='orgEditMenu'
                    type='div'
                    className='navigationContainer orgAdminEdit'
                    opts={{
                      saveGlobal: this.saveGlobal,
                      closeCallback: () => this.props.saveOrg(),
                      reloadGetArticles: this.reloadGetArticles,
                      getArticles: this.getArticles
                    }}
                  >
                    <button className='tooltip blockEditButton' id='orgEditMenu'>
                      <span className='tooltipTop'><i />Click to Manage Pages / Navigation Menu</span>
                      <span className='icon icon-edit'></span>
                    </button>
                  </ModalLink>
                  { pageOptions.length > 0 ?
                    <div className='navigationContainer'>
                    { !isMobile ?
                      this.pageLinks()
                    :
                      <div className='navigationDropdown'>
                        {this.pageDropdown(this.pageOptions())}
                      </div>
                    }
                    </div>
                  :
                    <div className='navigationContainer'>
                      Manage Navigation Menu
                    </div>
                  }
                </div>
              : null }
            </div>
          </div>
          <main className='gbx3OrgContent gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
                <Pages
                  isAdmin={isAdmin}
                  onClickArticle={this.onClickArticle}
                  onMouseOverArticle={this.onMouseOverArticle}
                  pageDropdown={this.pageDropdown}
                  reloadGetArticles={this.reloadGetArticles}
                  getArticles={this.getArticles}
                  setPageSearch={this.setPageSearch}
                  resetPageSearch={this.resetPageSearch}
                />
            </div>
          </main>
          <div className='gbx3OrgFooter gbx3OrgContentOuterContainer'>
            <div className='gbx3OrgContentInnerContainer'>
              <Footer
                showP2P={true}
                onClickVolunteerFundraiser={this.props.onClickVolunteerFundraiser}
              />
            </div>
          </div>
        </div>
        {breakpoint === 'mobile' ? <div className='bottomOffset'>&nbsp;</div> : <></>}
      </div>
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
  const pageList = util.getValue(state, `resource.${resourceName}`, {});
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
    resourceName,
    pageList,
    pageState,
    pageSearch,
    cameFromNonprofitAdmin
  }
}

export default connect(mapStateToProps, {
  updateOrgGlobal,
  updateData,
  updateInfo,
  setStyle,
  updateAdmin,
  saveOrg,
  getResource,
  setPageState,
  setPageSearch
})(Org);
