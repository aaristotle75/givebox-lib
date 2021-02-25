import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../../common/utility';
import {
  getResource
} from '../../../api/helpers';

class EditCustomList extends React.Component {

  constructor(props) {
    super(props);
    this.getArticles = this.getArticles.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  getArticles() {
    const {
      orgID,
      pageSlug,
      page,
      kind
    } = this.props;

    this.props.getResource('', {
      orgID,
      customName: ``
    })
  }

  render() {

    const {
    } = this.props;

    return (
      <div className='modalWrapper'>
        Edit Custom List....
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

  return {
    orgID,
    page,
    kind
  }
}

export default connect(mapStateToProps, {
  getResource
})(EditCustomList);
