import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import * as types from '../../../common/types';
import Image from '../../../common/Image';
import GBLink from '../../../common/GBLink';
import Dropdown from '../../../form/Dropdown';
import Choice from '../../../form/Choice';
import Search from '../../../table/Search';
import Paginate from '../../../table/Paginate';
import MaxRecords from '../../../table/MaxRecords';
import Filter from '../../../table/Filter';
import {
  getResource
} from '../../../api/helpers';
import {
  updateOrgPage
} from '../../redux/gbx3actions';
import AnimateHeight from 'react-animate-height';

class EditCustomList extends React.Component {

  constructor(props) {
    super(props);
    this.getArticles = this.getArticles.bind(this);
    this.renderList = this.renderList.bind(this);
    this.selectArticle = this.selectArticle.bind(this);
    this.onChangeEnabledFilter = this.onChangeEnabledFilter.bind(this);
    this.state = {
      showFilter: false,
      enabledFilter: ''
    };
  }

  componentDidMount() {
    this.getArticles();
  }

  selectArticle(ID) {
    const {
      page,
      pageSlug
    } = this.props;

    const customList = [ ...util.getValue(page, 'customList', []) ];
    if (customList.includes(ID)) customList.splice(customList.findIndex(l => l === ID), 1);
    else customList.push(ID);

    this.props.updateOrgPage(pageSlug, { customList });
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

    const {
      enabledFilter
    } = this.state;

    const filter = `${kindFilter}${opts.filter ? `%3B${opts.filter}` : ''}${enabledFilter ? `%3B${enabledFilter}` : ''}`;

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

    const {
      page
    } = this.props;

    const customList = util.getValue(page, 'customList', []);
    const articles = util.getValue(this.props.articles, 'data', []);
    const items = [];

    Object.entries(articles).forEach(([key, value]) => {
      const enabled = customList.includes(value.ID);
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
                this.selectArticle(value.ID);
              }}
              checked={enabled}
              value={enabled}
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

  customListFilter(filterDisabled) {
    const {
      page
    } = this.props;

    const disabled = filterDisabled ? '!' : '';
    const customList = util.getValue(page, 'customList', []);
    let filter = '';
    if (!util.isEmpty(customList)) {
      customList.forEach((value, key) => {
        if (key === 0) filter = `ID:${disabled}${value}`;
        else filter = filter + `%2CID:${disabled}${value}`;
      });
    }
    return filter;
  }

  onChangeEnabledFilter(name, value) {
    let enabledFilter = '';
    switch (value) {
      case 'enabled': {
        enabledFilter = this.customListFilter();
        break;
      }

      case 'disabled': {
        enabledFilter = this.customListFilter(true);
        break;
      }

      // no default
    }
    this.setState({ enabledFilter }, () => {
      this.getArticles({ reload: true });
    });
  }

  render() {

    const {
      page,
      customName,
      kind
    } = this.props;

    const {
      searchQuery,
      showFilter
    } = this.state;

    const customList = util.getValue(page, 'customList', []);

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
          { !util.isEmpty(customList) ?
            <div className='filterWrapper'>
              <GBLink
                className='link'
                onClick={() => this.setState({ showFilter: showFilter ? false : true })}
              >
                Advanced Search <span className={`icon icon-${showFilter ? 'minus' : 'plus'}`}></span>
              </GBLink>
              <AnimateHeight height={showFilter ? 'auto' : 0}>
                <div className={`filter-content flexCenter`}>
                  <Dropdown
                    name='filterEnabled'
                    label=''
                    defaultValue='all'
                    onChange={this.onChangeEnabledFilter}
                    style={{ width: 300 }}
                    options={[
                      { primaryText: 'All', value: 'all' },
                      { primaryText: 'Enabled', value: 'enabled' },
                      { primaryText: 'Disabled', value: 'disabled' }
                    ]}
                  />
                  {/*
                  <div className='clear'></div>
                  <div className='button-group'>
                    <GBLink className='button' onClick={this.ignoreFilters}>Ignore Filters</GBLink>
                    <GBLink className='button' onClick={this.applyFilters}>Apply Filters</GBLink>
                  </div>
                  */}
                </div>
              </AnimateHeight>
            </div>
          : null }
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
  getResource,
  updateOrgPage
})(EditCustomList);
