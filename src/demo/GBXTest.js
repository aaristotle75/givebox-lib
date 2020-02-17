import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomTemplate from '../lib/gbx/CustomTemplate';
import {
  util,
  getResource,
  Loader
} from '../lib';

class GBXTest extends Component {

  componentDidMount() {
    this.props.getResource('article', {
      id: [739]
    });
  }

  render() {

    if (util.isEmpty(this.props.article)) return <Loader msg='Loading article...' />

    return (
      <div>
        <CustomTemplate
          article={this.props.article}
        />
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  const resource = util.getValue(state.resource, 'article', {});
  const isFetching = util.getValue(resource, 'isFetching', false);
  const article = util.getValue(resource, 'data', {});

  return {
    resource,
    isFetching,
    article
  }
}

export default connect(mapStateToProps, {
  getResource
})(GBXTest);
