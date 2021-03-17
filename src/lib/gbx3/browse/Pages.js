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
    this.renderList = this.renderList.bind(this);
    this.reloadGetArticles = this.reloadGetArticles.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.getArticlesCallback = this.getArticlesCallback.bind(this);
    this.getArticleSearchCallback = this.getArticleSearchCallback.bind(this);
    this.setPageState = this.setPageState.bind(this);
    this.setPageSearch = this.setPageSearch.bind(this);
    this.resetPageSearch = this.resetPageSearch.bind(this);
    this.onMouseOverArticle = this.onMouseOverArticle.bind(this);
    this.onMouseLeaveArticle = this.onMouseLeaveArticle.bind(this);
    this.state = {
      pageSearch: {},
      playPreview: null
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
      this.reloadGetArticles();
    }
  }

  onMouseOverArticle(ID) {
    const {
      stage,
      preview
    } = this.props;

    if (stage === 'admin' && !preview) {
      console.log('execute onClickArticle do admin stuff -> ', ID);
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
      console.log('execute onClickArticle do admin stuff -> ', ID);
    } else {
      this.setState({ playPreview: null });
    }
  }

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

  makeBaseFilter() {
    let defaultTitlesFilter = ``;
    Object.entries(types.defaultArticleTitles).forEach(([key, value]) => {
      defaultTitlesFilter = defaultTitlesFilter + `%3Btitle:!"${value}"`;
    });
    const kindFilter = `%3Bkind:!"invoice"%3Bkind:!"membership"`;
    const defaultImageFilter = `%3BimageURL:!"${types.defaultArticleImageURL}"`;
    return `landing:true%3Bvolunteer:false%3Bviews:>1${kindFilter}${defaultTitlesFilter}${defaultImageFilter}`;
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
      kind,
      pageSlug
    } = this.props;

    const pageState = {
      ...this.props.pageState[pageSlug]
    };
    const pageNumber = opts.pageNumber ? opts.pageNumber : opts.search ? util.getValue(pageState, 'search.pageNumber', 1) : util.getValue(pageState, 'pageNumber', 1);
    const baseFilter = this.makeBaseFilter();
    const filter = `${baseFilter}${opts.filter ? `%3B${opts.filter}` : ''}`;

    this.props.getResource('articles', {
      customName: `${pageSlug}List`,
      reload: opts.reload,
      search: {
        filter,
        query: opts.query,
        max: opts.max,
        page: pageNumber,
        sort: 'views',
        order: 'desc'
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

  renderList() {
    const {
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
              reloadGetArticles={this.reloadGetArticles}
              playPreview={this.state.playPreview === ID ? true : false}
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
      resourceName,
      pages,
      pageSlug,
      isAdmin
    } = this.props;

    if (util.isLoading(pageList)) return <Loader msg='Loading List...' />
    const pageSearch = util.getValue(this.props.pageSearch, pageSlug, {});
    const Element = Scroll.Element;

    return (
      <div className='gbx3OrgPages'>
        {util.isFetching(pageList) ? <Loader msg='Loading List...' /> : null }
        <div style={{ marginTop: isAdmin ? 15 : 0 }} className='gbx3OrgPagesTop'>
          <div className='gbx3orgPagesTopContainer'>
            <div className='gbx3OrgPagesTopLeft hideMobile'>
              <h2>Browse Fundraisers</h2>
            </div>
            <div className='gbx3OrgPagesSearch'>
              <Search
                searchValue={util.getValue(pageSearch, 'query')}
                placeholder={`Search Fundraisers`}
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
          <Element name='gbx3OrgPages'  className='pageListWrapper'>
            {this.renderList()}
          </Element>
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
  const stage = util.getValue(info, 'stage');
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const breakpoint = util.getValue(info, 'breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;
  const resourceName = `browseList`;
  const pageList = util.getValue(state, `resource.${resourceName}`, {});
  const pageSlug = 'browse';
  const pageState = util.getValue(gbx3, 'pageState', {});
  const pageSearch = util.getValue(gbx3, 'pageSearch', {});

  return {
    orgID: null,
    stage,
    hasAccessToEdit,
    editable,
    breakpoint,
    isMobile,
    resourceName,
    pageSlug,
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
