import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import * as types from '../../common/types';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import ArticleCard from './ArticleCard';
import {
  getResource
} from '../../api/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';

class Pages extends Component{
  constructor(props){
    super(props);
    this.getActivePage = this.getActivePage.bind(this);
    this.renderList = this.renderList.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.setPageState = this.setPageState.bind(this);

    const pagesState = {};
    Object.entries(props.pages).forEach(([key, value]) => {
      pagesState[value.slug] = {
        total: 0,
        pageNumber: 1,
        list: []
      }
    })

    this.state = {
      pagesState
    };
  }

  componentDidMount() {
    this.getArticles();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.getArticles();
    }
  }

  setPageState(page, newState = {}, callback) {
    this.setState({
      pagesState: {
        ...this.state.pagesState,
        [page]: {
          ...this.state.pagesState[page],
          ...newState
        }
      }
    }, () => {
      if (callback) callback();
    })
  }

  getArticles(options = {}) {
    const opts = {
      max: 12,
      getDefault: false,
      reload: false,
      filter: '',
      query: '',
      showFetching: true,
      ...options
    };

    const {
      page,
      orgID
    } = this.props;
    const pageState = {
      ...this.state.pagesState[page]
    };
    const pageNumber = util.getValue(pageState, 'pageNumber', 1);
    const list = util.getValue(pageState, 'list', []);
    const endpoint = `org${util.getValue(types.kind(page), 'api.list')}`;
    const filter = `${opts.getDefault ? 'givebox:true' : 'landing:true'}${opts.filter ? `%3B${opts.filter}` : ''}`;
    this.props.getResource(endpoint, {
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
        const data = util.getValue(res, 'data', []);
        if (!util.isEmpty(data)) {
          pageState.pageNumber = pageNumber + 1;
          pageState.list = [...list, ...data];
          pageState.total = +util.getValue(res, 'total', 0);
          this.setPageState(page, pageState);
        } else {
          if (!opts.getDefault) this.getArticles({ getDefault: true, reload: true });
        }
      }
    });
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

    const {
      pagesState
    } = this.state;

    const pageState = util.getValue(pagesState, page, {});

    const pageList = util.getValue(pageState, `list`, []);
    const total = util.getValue(pageState, 'total', 0);
    const list = [];

    if (!util.isEmpty(pageList)) {
      Object.entries(pageList).forEach(([key, value]) => {
        const kind = page === 'featured' ? value.kind : page;
        const ID = page === 'featured' ? value.ID : value.articleID;
        list.push(
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
      <InfiniteScroll
        className='listContainer'
        scrollableTarget='gbx3Layout'
        dataLength={list.length}
        next={() => this.getArticles({ reload: true })}
        hasMore={list.length < total ? true : false}
        loader={''}
        endMessage={''}
      >
        { !util.isEmpty(list) ? list : <span className='noRecords'>No Search Results</span> }
      </InfiniteScroll>
    )
  }

  render() {

    const {
      pageList
    } = this.props;

    if (util.isLoading(pageList)) return <Loader msg='Loading List...' />
    const page = this.getActivePage();

    return (
      <div className='gbx3OrgPages'>
        {util.isFetching(pageList) ? <Loader msg='Loading List...' /> : null }
        <div className='gbx3OrgPagesTop'>
          <h2>{util.getValue(page, 'name')}</h2>
          <div className='gbx3OrgPagesSearch'>
            Search Input | Filters
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
  const pageList = util.getValue(state, `resource.${page}List`, {});

  return {
    orgID,
    stage,
    page,
    pages,
    hasAccessToEdit,
    editable,
    breakpoint,
    isMobile,
    pageList
  }
}

export default connect(mapStateToProps, {
  getResource
})(Pages);
