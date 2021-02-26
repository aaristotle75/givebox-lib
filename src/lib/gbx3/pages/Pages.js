import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import ModalLink from '../../modal/ModalLink';
import ArticleCard from './ArticleCard';
import Search from '../../table/Search';
import Dropdown from '../../form/Dropdown';
import CalendarField from '../../form/CalendarField';
import PageContentSection from './PageContentSection';
import {
  setPageState,
  setPageSearch
} from '../redux/gbx3actions';
import {
  getResource
} from '../../api/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import Moment from 'moment';
import Scroll from 'react-scroll';
import has from 'has';

class Pages extends Component {

  constructor(props) {
    super(props);
    this.pageOptions = this.pageOptions.bind(this);
    this.renderList = this.renderList.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.getArticlesCallback = this.getArticlesCallback.bind(this);
    this.getArticleSearchCallback = this.getArticleSearchCallback.bind(this);
    this.setPageState = this.setPageState.bind(this);
    this.setPageSearch = this.setPageSearch.bind(this);
    this.resetPageSearch = this.resetPageSearch.bind(this);
    this.renderKindSpecificFilters = this.renderKindSpecificFilters.bind(this);
    this.state = {
      pageSearch: {}
    }
  }

  componentDidMount() {
    this.getArticles();
  }

  componentDidUpdate(prevProps) {

    // Check for page switch and load articles - does not reload
    if (prevProps.pageSlug !== this.props.pageSlug) {
      this.getArticles();
    }
    if ((prevProps.pageSlug === this.props.pageSlug) && (prevProps.kind !== this.props.kind)) {
      this.setPageState({
        list: [],
        search: {},
        pageNumber: 1,
        total: 0
      }, () => this.getArticles({ reload: true, pageNumber: 1 }))
    }
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
      kind,
      pageSlug,
      orgID
    } = this.props;

    const pageState = {
      ...this.props.pageState[pageSlug]
    };
    const pageNumber = opts.pageNumber ? opts.pageNumber : opts.search ? util.getValue(pageState, 'search.pageNumber', 1) : util.getValue(pageState, 'pageNumber', 1);
    const kindFilter = kind === 'all' ? '' : `%3Bkind:"${kind}"`;
    const customListFilter = util.getValue(activePage, 'customList.filter', 'givebox:true');
    const filter = `${customListFilter}${kindFilter}${opts.filter ? `%3B${opts.filter}` : ''}`;

    this.props.getResource('orgArticles', {
      orgID,
      customName: `${pageSlug}List`,
      reload: opts.reload,
      search: {
        filter,
        query: opts.query,
        max: opts.max,
        page: pageNumber
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

  renderKindSpecificFilters() {
    const {
      pageSlug
    } = this.props;
    const filters = [];
    const pageSearch = util.getValue(this.props.pageSearch, pageSlug, {});

    switch (pageSlug) {
      case 'events': {
        filters.push(
          <CalendarField
            key={'calendarField'}
            utc={true}
            defaultValue={util.getValue(pageSearch, 'eventDate')}
            placeholder='Search By Date'
            onChangeCalendar={(ts) => {
              if (ts) {
                const eventDate = ts/1000;
                const beginningOfDay = Moment.utc(Moment.unix(eventDate)).startOf('day').valueOf()/1000;
                const endOfDay = parseInt(Moment.utc(Moment.unix(eventDate)).endOf('day').valueOf()/1000);
                const filter = `eventWhen:>d${beginningOfDay}%3BeventWhen:<d${endOfDay}`;
                this.setPageSearch({ filter, eventDate }, () => {
                  this.getArticles({
                    filter,
                    search: true,
                    reload: true,
                    pageNumber: 1
                  });
                });
              }
            }}
          />
        );
        break;
      }

      // no default
    }

    return filters;
  }

  renderList() {
    const {
      pages,
      pageSlug,
      activePage
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
          >
            <ArticleCard
              item={value}
              kind={kind}
              ID={ID}
              activePage={activePage}
            />
          </div>
        );
      })
    }

    return (
      !util.isEmpty(items) ?
        <InfiniteScroll
          className='listContainer'
          scrollableTarget='gbx3Layout'
          dataLength={items.length}
          next={() => this.getArticles({ reload: true, search, query: search })}
          hasMore={items.length < total ? true : false}
          loader={''}
          endMessage={<div className='endMessage'>Showing All {total} Result{total > 1 ? 's' : ''}</div>}
        >
          {items}
        </InfiniteScroll>
      :
        <span className='noRecords'>No Search Results</span>
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
    const hasCustomList = util.getValue(page, 'hasCustomList', false);
    const Element = Scroll.Element;

    return (
      <div className='gbx3OrgPages'>
        {util.isFetching(pageList) ? <Loader msg='Loading List...' /> : null }
        <div className='orgAdminDropdown managePageDropdown orgAdminOnly'>
          {this.props.pageDropdown(this.pageOptions(), 'Manage Page')}
        </div>
        <div style={{ marginTop: isAdmin ? 15 : 0 }} className='gbx3OrgPagesTop'>
          <ModalLink
            id='orgEditPage'
            type='div'
            className='gbx3orgPagesTopContainer orgAdminEdit'
            opts={{
              hasCustomList,
              pageSlug,
              tabToDisplay: 'editPage'
            }}
          >
            <button className='tooltip blockEditButton' id='orgEditPage'>
              <span className='tooltipTop'><i />Click Icon to EDIT Page</span>
              <span className='icon icon-edit'></span>
            </button>
          </ModalLink>
          <div className='gbx3orgPagesTopContainer'>
            <div className='gbx3OrgPagesTopLeft'>
              <h2>{pageTitle}</h2>
            </div>
            <div className='gbx3OrgPagesSearch'>
              <Search
                searchValue={util.getValue(pageSearch, 'query')}
                placeholder={`Search ${util.getValue(page, 'name')}`}
                getSearch={(value) => {
                  if (value) {
                    if (value !== util.getValue(pageSearch, 'query')) {
                      this.setPageSearch({ query: value }, () => {
                        this.getArticles({
                          search: true,
                          query: value,
                          reload: true,
                          pageNumber: 1
                        });
                      });
                    }
                  } else {
                    this.resetPageSearch();
                  }
                }}
                resetSearch={() => {
                  this.resetPageSearch();
                }}
              />
            </div>
          </div>
        </div>
        <div className='pageContentWrapper'>
          <PageContentSection section='top' />
          <Element name='gbx3OrgPages'  className='pageListWrapper'>
            {this.renderList()}
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
  const orgID = util.getValue(info, 'orgID');
  const stage = util.getValue(info, 'stage');
  const pageSlug = util.getValue(info, 'activePageSlug');
  const pages = util.getValue(gbx3, 'orgPages', {});
  const activePage = util.getValue(pages, pageSlug, {});
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
    orgID,
    stage,
    pageSlug,
    pages,
    activePage,
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
  getResource,
  setPageState,
  setPageSearch
})(Pages);
