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

class Pages extends Component{
  constructor(props){
    super(props);
    this.getActivePage = this.getActivePage.bind(this);
    this.renderList = this.renderList.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.state = {
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

  getArticles(options = {}) {
    const opts = {
      getDefault: false,
      reload: false,
      filter: '',
      query: '',
      ...options
    };

    const {
      page
    } = this.props;

    const endpoint = `org${util.getValue(types.kind(page), 'api.list')}`;
    const filter = `${opts.getDefault ? 'givebox:true' : 'landing:true'}${opts.filter ? `%3B${opts.filter}` : ''}`;
    this.props.getResource(endpoint, {
      customName: `${page}List`,
      reload: opts.reload,
      search: {
        filter,
        query: opts.query
      },
      callback: (res, err) => {
        if (!util.getValue(res, 'data')) {
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
      pageList,
      page
    } = this.props;

    const data = util.getValue(pageList, 'data', []);
    const list = [];

    if (!util.isEmpty(data)) {
      Object.entries(data).forEach(([key, value]) => {
        const kind = page === 'featured' ? value.kind : page;
        const ID = page === 'featured' ? value.ID : value.articleID;
        list.push(
          <li
            key={key}
            onClick={() => this.props.onClickArticle(ID)}
          >
            <ArticleCard
              item={value}
              kind={kind}
              ID={ID}
            />
          </li>
        );
      })
    }

    return (
      <ul>
        { !util.isEmpty(list) ? list : <span className='noRecords'>No Search Results</span> }
      </ul>
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
  const stage = util.getValue(info, 'stage');
  const page = util.getValue(info, 'page');
  const pages = util.getValue(gbx3, 'landing.pages', []);
  const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
  const editable = util.getValue(admin, 'editable');
  const breakpoint = util.getValue(info, 'breakpoint');
  const isMobile = breakpoint === 'mobile' ? true : false;
  const pageList = util.getValue(state, `resource.${page}List`, {});

  return {
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
