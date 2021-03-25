import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import ModalLink from '../../modal/ModalLink';
import ArticleCard from './ArticleCard';
import CreateArticleCard from './CreateArticleCard';
import Search from '../../table/Search';
import Dropdown from '../../form/Dropdown';
import CalendarField from '../../form/CalendarField';
import PageContentSection from './PageContentSection';
import InfiniteScroll from 'react-infinite-scroll-component';
import Moment from 'moment';
import Scroll from 'react-scroll';
import has from 'has';
import {
  toggleModal
} from '../../api/actions';
import {
  updateOrgPage,
  saveOrg
} from '../redux/gbx3actions';

class Pages extends Component {

  constructor(props) {
    super(props);
    this.createCallback = this.createCallback.bind(this);
    this.pageOptions = this.pageOptions.bind(this);
    this.renderList = this.renderList.bind(this);
    this.onMouseOverArticle = this.onMouseOverArticle.bind(this);
    this.onMouseLeaveArticle = this.onMouseLeaveArticle.bind(this);
    this.state = {
      playPreview: null
    }
  }

  componentDidMount() {
    this.props.getArticles();
  }

  componentDidUpdate(prevProps) {

    // Check for page switch and load articles - does not reload
    if (prevProps.pageSlug !== this.props.pageSlug) {
      this.props.getArticles();
    }

    /*
    if ((prevProps.pageSlug === this.props.pageSlug) && (prevProps.kind !== this.props.kind)) {
      this.props.reloadGetArticles();
    }

    if (((prevProps.customList !== this.props.customList) && this.props.useCustomList) || (prevProps.useCustomList !== this.props.useCustomList)) {
      this.props.reloadGetArticles();
    }
    */

    if (Object.keys(prevProps.pages).length !== Object.keys(this.props.pages).length) {
      this.props.reloadGetArticles();
    }
    if (prevProps.display !== this.props.display) {
      this.props.reloadGetArticles();
    }
  }

  async createCallback(res, err) {
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
                isSending: false,
                orgUpdated: true,
                showSaving: false,
                callback: (res, err) => {
                  this.props.reloadGetArticles();
                }
              });
            }
          }
        } else {
          this.props.reloadGetArticles();
        }
      }
    }
  }

  onMouseOverArticle(ID) {
    const {
      stage,
      preview
    } = this.props;

    if (stage === 'admin' && !preview) {
      //console.log('execute onClickArticle do admin stuff -> ', ID);
    } else {
      this.setState({ playPreview: ID });
    }
  }

  onMouseLeaveArticle(ID) {
    const {
      stage,
      preview
    } = this.props;

    if (stage === 'admin' && !preview) {
      //console.log('execute onClickArticle do admin stuff -> ', ID);
    } else {
      this.setState({ playPreview: null });
    }
  }

  renderList() {
    const {
      orgID,
      stage,
      pages,
      pageSlug,
      activePage,
      resourceName
    } = this.props;

    const search = util.getValue(this.props.pageSearch, pageSlug);
    const pageState = util.getValue(this.props.pageState, pageSlug, {});
    const pageList = util.getValue(pageState, 'search.list', util.getValue(pageState, 'list', []));
    const total = util.getValue(pageState, 'search.total', util.getValue(pageState, 'total', 0));
    const items = [];

    if (!util.isEmpty(pageList)) {
      Object.entries(pageList).forEach(([key, value]) => {
        const kind = value.kind;
        const ID = value.ID ;
        items.push(
          <div
            className='listItem'
            key={key}
            onClick={() => this.props.onClickArticle(ID)}
            onMouseEnter={() => this.onMouseOverArticle(ID)}
            onMouseLeave={() => this.onMouseLeaveArticle(ID)}
          >
            <ArticleCard
              item={value}
              kind={kind}
              ID={ID}
              activePage={activePage}
              pageSlug={pageSlug}
              resourcesToLoad={[resourceName]}
              onClickArticle={this.props.onClickArticle}
              reloadGetArticles={this.props.reloadGetArticles}
              playPreview={this.state.playPreview === ID ? true : false}
            />
          </div>
        );
      })
    }

    return (
      !util.isEmpty(items) ?
        <div className='infinite-scroll'>
          <InfiniteScroll
            className='listContainer'
            scrollableTarget='gbx3Layout'
            dataLength={items.length}
            next={() => this.props.getArticles({ reload: true, search, query: search })}
            hasMore={items.length < total ? true : false}
            loader={''}
            endMessage={<div className='endMessage'>Showing All {total} Result{total > 1 ? 's' : ''}</div>}
          >
            <CreateArticleCard
              hideCard={false}
              hideNoResults={true}
              kind={this.props.kind}
              createCallback={this.createCallback}
            />
            {items}
          </InfiniteScroll>
        </div>
      :
        <CreateArticleCard
          hideCard={false}
          kind={this.props.kind}
          createCallback={this.createCallback}
        />
    )
  }

  pageOptions() {
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

  render() {

    const {
      pageList,
      resourceName,
      pages,
      pageSlug,
      isAdmin
    } = this.props;

    if (util.isLoading(pageList)) return <Loader msg='Loading List...' />
    const page = pages[pageSlug];
    const pageSearch = util.getValue(this.props.pageSearch, pageSlug, {});
    const pageName = util.getValue(page, 'name');
    const pageTitle = util.getValue(page, 'pageTitle', pageName);
    const useCustomList = util.getValue(page, 'useCustomList', false);
    const hideList = util.getValue(page, 'hideList', false);
    const Element = Scroll.Element;

    return (
      <div className='gbx3OrgPages'>
        {util.isFetching(pageList) ? <Loader msg='Loading List...' /> : null }
        <div className='orgAdminDropdown managePageDropdown orgAdminOnly'>
          {this.props.pageDropdown(this.pageOptions(), 'Change Page')}
        </div>
        <div style={{ marginTop: isAdmin ? 15 : 0 }} className='gbx3OrgPagesTop'>
          <ModalLink
            id='orgEditPage'
            type='div'
            className='gbx3orgPagesTopContainer orgAdminEdit'
            opts={{
              pageSlug,
              resourceName,
              reloadGetArticles: this.props.reloadGetArticles,
              tabToDisplay: 'editPage'
            }}
          >
            <button className='tooltip blockEditButton' id='orgEditPage'>
              <span className='tooltipTop'><i />Click to Edit Page Details</span>
              <span className='icon icon-edit'></span>
            </button>
          </ModalLink>
          <div className='gbx3orgPagesTopContainer'>
            <div className='gbx3OrgPagesTopLeft'>
              <h2>{pageName}</h2>
            </div>
            <div className='gbx3OrgPagesSearch'>
              <Search
                searchValue={util.getValue(pageSearch, 'query')}
                placeholder={`Search ${!hideList ? util.getValue(page, 'name') : ''}`}
                getSearch={(value) => {
                  if (value) {
                    if (value !== util.getValue(pageSearch, 'query')) {
                      this.props.setPageSearch({ query: value }, () => {
                        this.props.getArticles({
                          search: true,
                          query: value,
                          reload: true,
                          pageNumber: 1
                        });
                      });
                    }
                  } else {
                    this.props.resetPageSearch();
                  }
                }}
                resetSearch={() => {
                  this.props.resetPageSearch();
                }}
              />
            </div>
          </div>
        </div>
        <div className='pageContentWrapper'>
          <PageContentSection section='top' />
          <Element name='gbx3OrgPages'  className='pageListWrapper'>
            { !hideList || !util.isEmpty(pageSearch) ? this.renderList() : null }
          </Element>
          <PageContentSection section='bottom' />
        </div>
      </div>
    )
  }
};

Pages.defaultProps = {
};

function mapStateToProps(state, props) {

  const gbx3 = util.getValue(state, 'gbx3', {});
  const admin = util.getValue(gbx3, 'admin', {});
  const info = util.getValue(gbx3, 'info', {});
  const display = util.getValue(info, 'display');
  const orgID = util.getValue(info, 'orgID');
  const stage = util.getValue(info, 'stage');
  const pageSlug = util.getValue(info, 'activePageSlug');
  const pages = util.getValue(gbx3, 'orgPages', {});
  const activePage = util.getValue(pages, pageSlug, {});
  const customList = util.getValue(activePage, 'customList', []);
  const useCustomList = util.getValue(activePage, 'useCustomList', false);
  const kind = util.getValue(activePage, 'kind');
  const pagesEnabled = util.getValue(gbx3, 'orgGlobals.pagesEnabled', []);
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const breakpoint = util.getValue(info, 'breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;
  const resourceName = `${pageSlug}List`;
  const pageList = util.getValue(state, `resource.${resourceName}`, {});
  const pageState = util.getValue(gbx3, 'pageState', {});
  const pageSearch = util.getValue(gbx3, 'pageSearch', {});

  return {
    display,
    orgID,
    stage,
    pageSlug,
    pages,
    activePage,
    customList,
    useCustomList,
    kind,
    pagesEnabled,
    hasAccessToEdit,
    editable,
    breakpoint,
    isMobile,
    resourceName,
    pageList,
    pageState,
    pageSearch
  }
}

export default connect(mapStateToProps, {
  updateOrgPage,
  saveOrg,
  toggleModal
})(Pages);
