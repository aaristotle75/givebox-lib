import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import ArticleCard from './ArticleCard';
import Search from '../../table/Search';
import Dropdown from '../../form/Dropdown';
import CalendarField from '../../form/CalendarField';
import {
  setPageState,
  setPageSearch
} from '../redux/gbx3actions';
import {
  getResource
} from '../../api/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import Moment from 'moment';
import has from 'has';

class Pages extends Component {

  constructor(props) {
    super(props);
    this.getActivePage = this.getActivePage.bind(this);
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
    if (prevProps.page !== this.props.page) {
      this.getArticles();
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
      page
    } = this.props;

    const stateUpdated = await this.props.setPageSearch(page, search);
    if (stateUpdated && callback) {
      callback();
    }
  }

  async setPageState(newState = {}, callback) {
    const {
      page
    } = this.props;

    const stateUpdated = await this.props.setPageState(page, newState);
    if (stateUpdated && callback) {
      callback();
    }
  }

  getArticles(options = {}) {
    const opts = {
      max: 50,
      getDefault: false,
      reload: false,
      filter: '',
      query: '',
      search: false,
      showFetching: true,
      pageNumber: null,
      ...options
    };

    const {
      page,
      orgID
    } = this.props;

    const pageState = {
      ...this.props.pageState[page]
    };
    const pageNumber = opts.pageNumber ? opts.pageNumber : opts.search ? util.getValue(pageState, 'search.pageNumber', 1) : util.getValue(pageState, 'pageNumber', 1);
    const activePage = this.getActivePage();
    const kind = util.getValue(activePage, 'kind', 'all');
    const kindFilter = kind === 'all' ? '' : `%3Bkind:"${kind}"`;
    const filter = `${opts.getDefault || opts.search ? 'givebox:true' : 'landing:true'}${kindFilter}${opts.filter ? `%3B${opts.filter}` : ''}`;

    this.props.getResource('orgArticles', {
      orgID,
      customName: `${page}List`,
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
          this.getArticlesCallback(res, err, opts.getDefault);
        }
      }
    });
  }

  getArticleSearchCallback(res, err, query) {
    const {
      page
    } = this.props;

    const pageState = {
      ...this.props.pageState[page]
    };

    const pageSearch = util.getValue(this.state.pageSearch, page);
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

  getArticlesCallback(res, err, getDefault) {
    const {
      page
    } = this.props;

    const pageState = {
      ...this.props.pageState[page]
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
    } else {
      if (!getDefault) this.getArticles({ getDefault: true, reload: true });
    }
  }

  getActivePage() {
    const {
      pages
    } = this.props;

    return pages.find(p => p.slug === this.props.page);
  }

  renderKindSpecificFilters() {
    const {
      page
    } = this.props;
    const filters = [];
    const pageSearch = util.getValue(this.props.pageSearch, page, {});

    switch (page) {
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
      page
    } = this.props;

    const activePage = this.getActivePage();
    const search = util.getValue(this.props.pageSearch, page);
    const pageState = util.getValue(this.props.pageState, page, {});
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

  render() {

    const {
      pageList,
      resourceName
    } = this.props;

    if (util.isLoading(pageList)) return <Loader msg='Loading List...' />
    const page = this.getActivePage();
    const pageSearch = util.getValue(this.props.pageSearch, this.props.page, {});

    return (
      <div className='gbx3OrgPages'>
        {util.isFetching(pageList) ? <Loader msg='Loading List...' /> : null }
        <div className='gbx3OrgPagesTop'>
          <div className='gbx3OrgPagesTopLeft'>
            <h2>{util.getValue(page, 'name')}</h2>
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
        <div className='listWrapper'>
          {this.renderList()}
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
  const page = util.getValue(info, 'page');
  const pages = util.getValue(gbx3, 'landing.pages', []);
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const breakpoint = util.getValue(info, 'breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;
  const resourceName = `${page}List`;
  const pageList = util.getValue(state, `resource.${resourceName}`, {});
  const pageState = util.getValue(gbx3, 'pageState', {});
  const pageSearch = util.getValue(gbx3, 'pageSearch', {});

  return {
    orgID,
    stage,
    page,
    pages,
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
