import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
  getResource,
  sendResource,
  Loader
} from '../lib';
import GBX from '../lib/gbx3/gbx3';

class GBXTest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: 739
    };
    this.timeout = false;
  }

  componentDidMount() {
    this.timeout = true;
    this.props.getResource('article', {
      id: [this.state.id]
    });
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

	save(id, data, blocks) {
		console.log('execute save', id, data, blocks);
	}

  render() {

    if (util.isEmpty(this.props.article)) return <Loader msg='Loading article...' />

    return (
      <div>
        <GBX
					orgID={this.props.article.orgID}
					kindID={this.props.article.kindID}
					kind={this.props.article.kind}
          autoSave={true}
					save={this.save}
          access={util.getAuthorizedAccess(this.props.access, this.props.article.orgID)}
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
    article,
    access: util.getValue(state.resource, 'access', {})
  }
}

export default connect(mapStateToProps, {
  sendResource,
  getResource
})(GBXTest);
