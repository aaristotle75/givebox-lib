import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import ArticleCard from './ArticleCard';
import Search from '../../table/Search';
import {
  setPageState
} from '../redux/gbx3actions';
import {
  getResource
} from '../../api/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import has from 'has';

class Pages extends Component{
  constructor(props){
    super(props);
    this.getActivePage = this.getActivePage.bind(this);
    this.renderList = this.renderList.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.getArticlesCallback = this.getArticlesCallback.bind(this);
    this.setPageState = this.setPageState.bind(this);
  }

  componentDidMount() {
    this.getArticles();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.getArticles();
    }
  }

  async setPageState(page, newState = {}, callback) {
    const stateUpdated = await this.props.setPageState(page, newState);
    if (stateUpdated && callback) {
      callback();
    }
  }

  getArticles(options = {}) {
    const opts = {
      max: 12,
      getDefault: false,
      reload: false,
      filter: '',
      query: '',
      search: false,
      showFetching: true,
      ...options
    };

    const {
      page,
      orgID
    } = this.props;

    const pageState = {
      ...this.props.pageState[page]
    };
    const activePage = this.getActivePage();
    const kind = util.getValue(activePage, 'kind', 'all');
    const pageNumber = opts.search ? util.getValue(pageState, 'search.pageNumber', 1) : util.getValue(pageState, 'pageNumber', 1);
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
        this.getArticlesCallback(res, err, opts.getDefault, opts.search, opts.query);
      }
    });
  }

  getArticlesCallback(res, err, getDefault, search, query) {
    const {
      page
    } = this.props;

    const pageState = {
      ...this.props.pageState[page]
    };

    const data = util.getValue(res, 'data', []);

    if (search) console.log('execute article callback search -> ', search, query, data);

    let pageNumber = util.getValue(pageState, 'pageNumber', 1);
    let list = util.getValue(pageState, 'list', []);

    if (search) {
      pageNumber = util.getValue(pageState, 'search.pageNumber', 1);
      list = util.getValue(pageState, 'search.list', []);
    }

    if (!util.isEmpty(data)) {
      if (search) {
        if (!has(pageState, 'search')) pageState.search = {};
        pageState.search.pageNumber = pageNumber + 1;
        pageState.search.list = [...list, ...data];
        pageState.search.total = +util.getValue(res, 'total', 0);
      } else {
        pageState.pageNumber = pageNumber + 1;
        pageState.list = [...list, ...data];
        pageState.total = +util.getValue(res, 'total', 0);
        pageState.search = {};
      }
      this.setPageState(page, pageState);
    } else {
      if (!getDefault) this.getArticles({ getDefault: true, reload: true });
      console.log('search but no query and no data -> ', search, query, data);
    }
  }

  getActivePage() {
    const {
      pages
    } = this.props;

    return pages.find(p => p.slug === this.props.page);
  }

  renderList() {
    const {
      page
    } = this.props;

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
          next={() => this.getArticles({ reload: true })}
          hasMore={items.length < total ? true : false}
          loader={''}
          endMessage={<div className='endMessage'>Showing All {total} Results</div>}
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

    return (
      <div className='gbx3OrgPages'>
        {util.isFetching(pageList) ? <Loader msg='Loading List...' /> : null }
        <div className='gbx3OrgPagesTop'>
          <h2>{util.getValue(page, 'name')}</h2>
          <div className='gbx3OrgPagesSearch'>
            <Search
              placeholder={`Search ${util.getValue(page, 'name')}`}
              getSearch={(value) => {
                this.getArticles({
                  search: true,
                  query: value,
                  reload: true
                });
              }}
              resetSearch={() => {
                console.log('execute reset search');
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
    pageState
  }
}

export default connect(mapStateToProps, {
  getResource,
  setPageState
})(Pages);
