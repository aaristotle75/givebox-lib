import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as types from '../../../common/types';
import Image from '../../../common/Image';
import Choice from '../../../form/Choice';
import Search from '../../../table/Search';
import Paginate from '../../../table/Paginate';
import MaxRecords from '../../../table/MaxRecords';
import Filter from '../../../table/Filter';
import {
  getResource
} from '../../../api/helpers';

class EditCustomList extends React.Component {

  constructor(props) {
    super(props);
    this.getArticles = this.getArticles.bind(this);
    this.renderList = this.renderList.bind(this);
    this.selectArticle = this.selectArticle.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    this.getArticles();
  }

  selectArticle(ID) {
    console.log('execute selectArticle -> ', ID);
  }

  getArticles(options= {}) {
    const opts = {
      max: 10,
      reload: false,
      filter: '',
      query: '',
      ...options
    };

    const {
      orgID,
      pageSlug,
      page,
      kind,
      customName,
      kindFilter
    } = this.props;

    const filter = `${kindFilter}${opts.filter ? `%3B${opts.filter}` : ''}`;

    this.props.getResource('orgArticles', {
      orgID,
      customName,
      reload: opts.reload,
      search: {
        filter,
        query: opts.query,
        max: opts.max
      },
      callback: (res, err) => {

      }
    });
  }

  renderList() {

    const articles = util.getValue(this.props.articles, 'data', []);
    const items = [];

    Object.entries(articles).forEach(([key, value]) => {
      items.push(
        <div
          className='articleItem sortableListItem'
          key={key}
          onClick={() => this.selectArticle(value.ID)}
        >
          <div className='editableRowMenu'>
            <Choice
              type='checkbox'
              name='enable'
              label={''}
              onChange={(name, value) => {
                console.log('execute onChange -> ', name, value);
                this.selectArticle(value.ID);
              }}
              checked={false}
              value={false}
              toggle={true}
            />
          </div>
          <div className='articleImage'>
            <Image url={value.imageURL} maxSize={50} size={'thumb'} alt={value.title} />
          </div>
          <div className='articleText'>
            <span>
              {value.title}
              <span className='gray smallText'>{types.kind(value.kind).name}</span>
            </span>
          </div>
        </div>
      );
    });

    return (
      <div className='articleGroupList campaignsEdit'>
        <div className='articleGroup'>
          {items}
        </div>
      </div>
    )
  }

  render() {

    const {
      customName,
      kind
    } = this.props;

    const {
      searchQuery
    } = this.state;

    return (
      <div className='orgPageCustomList gbx3Shop'>
        <div className='articleGroupTopContainer'>
          <div className='articleGroupTop'>
            <div className='articleGroupTitle'>Selected Custom List ( {types.kind(kind, 'All Types').namePlural} )</div>
            <div className='gbx3OrgPagesSearch'>
              <Search
                searchValue={searchQuery}
                placeholder={`Search`}
                getSearch={(value) => {
                  if (value && (value !== searchQuery)) {
                    this.setState({ searchQuery: value }, () => {
                      this.getArticles({
                        query: value,
                        reload: true
                      });
                    });
                  }
                }}
                resetSearch={() => {
                  this.getArticles({
                    reload: true
                  });
                }}
              />
            </div>
          </div>
          <Filter
            customName={customName}
            options={[]}
          />
        </div>
        {this.renderList()}
        <Paginate
          customName={customName}
        />
        <MaxRecords
          customName={customName}
          records={[10, 20, 50, 100]}
        />
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const pageSlug = props.pageSlug;
  const orgID = util.getValue(state, 'gbx3.info.orgID');
  const pages = util.getValue(state, 'gbx3.orgPages', {});
  const page = util.getValue(pages, pageSlug);
  const kind = util.getValue(page, 'kind');
  const customName = `${kind}CustomPool`;
  const articles = util.getValue(state, `resource.${customName}`, {});
  const kindFilter = kind === 'all' ? '' : `%3Bkind:"${kind}"`;

  return {
    orgID,
    page,
    kind,
    customName,
    articles,
    kindFilter
  }
}

export default connect(mapStateToProps, {
  getResource
})(EditCustomList);
