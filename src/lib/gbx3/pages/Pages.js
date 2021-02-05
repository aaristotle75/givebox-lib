import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import GBLink from '../../common/GBLink';
import Loader from '../../common/Loader';
import ListItem from './ListItem';
import {
  getResource
} from '../../api/helpers';

class Pages extends Component{
  constructor(props){
    super(props);
    this.getActivePage = this.getActivePage.bind(this);
    this.renderList = this.renderList.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.getResource('orgArticles', {
      search: {
        filter: 'givebox:true',
        sort: 'raised',
        order: 'desc',
        max: 100
      }
    })
  }

  getActivePage() {
    const {
      page,
      pages
    } = this.props;

    return pages.find(p => p.slug === page);
  }

  renderList() {
    const {
      orgArticles
    } = this.props;

    const data = util.getValue(orgArticles, 'data', []);
    const list = [];

    if (!util.isEmpty(data)) {
      Object.entries(data).forEach(([key, value]) => {
        list.push(
          <ListItem
            key={key}
            item={value}
          />
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
    } = this.props;

    if (util.isLoading(this.props.orgArticles)) return <Loader msg='Loading List...' />
    const page = this.getActivePage();

    return (
      <div className='gbx3OrgPages'>
        <h2>{util.getValue(page, 'name')}</h2>
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
  const orgArticles = util.getValue(state, 'resource.orgArticles', {});

  return {
    stage,
    page,
    pages,
    hasAccessToEdit,
    editable,
    breakpoint,
    isMobile,
    orgArticles
  }
}

export default connect(mapStateToProps, {
  getResource
})(Pages);
