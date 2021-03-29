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
import Tabs, { Tab } from '../../../common/Tabs';
import SortCustomList from './SortCustomList';
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
    this.onChangeEnabledFilter = this.onChangeEnabledFilter.bind(this);
    this.onChangeKindFilter = this.onChangeKindFilter.bind(this);
    this.state = {
      showFilter: false,
      enabledFilter: '',
      kindFilter: ''
    };
  }

  componentDidMount() {
    this.getArticles();
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
      customName
    } = this.props;

    const {
      enabledFilter,
      kindFilter
    } = this.state;

    const baseFilter = `givebox:true`;
    const filter = `${baseFilter}${kindFilter ? `%3B${kindFilter}` : ''}${opts.filter ? `%3B${opts.filter}` : ''}${enabledFilter ? `%3B${enabledFilter}` : ''}`;

    this.props.getResource('orgArticles', {
      orgID,
      customName,
      reload: opts.reload,
      search: {
        filter,
        query: opts.query,
        max: opts.max,
        sort: 'orderBy',
        order: 'desc'
      },
      callback: (res, err) => {

      }
    });
  }

  renderList() {

    const {
      customList
    } = this.props;

    const articles = util.getValue(this.props.articles, 'data', []);
    const items = [];

    Object.entries(articles).forEach(([key, value]) => {
      const enabled = customList.includes(value.ID);
      items.push(
        <div
          className='articleItem sortableListItem'
          key={key}
          onClick={() => this.props.updateCustomList(value.ID)}
        >
          <div className='editableRowMenu'>
            <Choice
              type='checkbox'
              name='enable'
              label={''}
              onChange={(name, value) => {
                this.props.updateCustomList(value.ID);
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
          {!util.isEmpty(items) ? items : <span className='noRecords flexCenter'>No Results Found</span>}
        </div>
      </div>
    )
  }

  onChangeEnabledFilter(name, value) {
    const {
      customList
    } = this.props;

    let enabledFilter = '';
    switch (value) {
      case 'enabled': {
        enabledFilter = util.customListFilter(customList);
        break;
      }

      case 'disabled': {
        enabledFilter = util.customListFilter(customList, { noInclude: true, operator: '%3B' });
        break;
      }

      // no default
    }
    this.setState({ enabledFilter }, () => {
      this.getArticles({ reload: true });
    });
  }

  onChangeKindFilter(name, value) {
    const kindFilter = value === 'all' ? '' : `kind:"${value}"`;
    this.setState({ kindFilter }, () => {
      this.getArticles({ reload: true });
    });
  }

  render() {

    const {
      page,
      customName,
      customList
    } = this.props;

    const {
      searchQuery,
      showFilter
    } = this.state;

    return (
      <div className='orgPageCustomList gbx3Shop'>
        <Tabs
          default={'selectCustomList'}
          className='statsTab'
        >
          <Tab id='selectCustomList' label={<span className='stepLabel'>Custom List</span>}>
            <div className='articleGroupTopContainer'>
              <div className='articleGroupTop'>
                <div className='articleGroupTitle'>&nbsp;</div>
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
                      className='column50'
                      direction='top'
                      options={[
                        { primaryText: 'Enabled and Disabled', value: 'all' },
                        { primaryText: 'Enabled Only', value: 'enabled' },
                        { primaryText: 'Disabled Only', value: 'disabled' }
                      ]}
                    />
                    <Dropdown
                      name='filterKind'
                      label=''
                      defaultValue='all'
                      onChange={this.onChangeKindFilter}
                      className='column50'
                      direction='top'
                      options={types.kindOptions(true, 'All Types')}
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
            </div>
            {this.renderList()}
            <Paginate
              customName={customName}
            />
            <MaxRecords
              customName={customName}
              records={[10, 20, 50, 100]}
            />
          </Tab>
          <Tab id='sortCustomList' label={<span className='stepLabel'>Sort List</span>}>
            <SortCustomList
              {...this.props}
            />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const pageSlug = props.pageSlug;
  const orgID = util.getValue(state, 'gbx3.info.orgID');
  const pages = util.getValue(state, 'gbx3.orgPages', {});
  const page = util.getValue(pages, pageSlug);
  const customName = `articleCustomPool`;
  const articles = util.getValue(state, `resource.${customName}`, {});

  return {
    orgID,
    page,
    customName,
    articles
  }
}

export default connect(mapStateToProps, {
  getResource,
  updateOrgPage
})(EditCustomList);
