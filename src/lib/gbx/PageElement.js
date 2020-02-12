import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
  getResource,
  Loader
} from '../';
import Loadable from 'react-loadable';

class PageElement extends Component {

  constructor(props) {
    super(props);
    this.loadComponent = this.loadComponent.bind(this);
  }

  /**
  * Dynamically load components by module path
  * @param {string} element component to load
  */
  loadComponent() {

    const Component = Loadable({
      loader: () => import(`./elements/${this.props.element}`),
      loading: () => <></>
    });

    return (
      <Component
        {...this.props}
      />
    )
  }

  render() {

    return (
      <>
        {this.loadComponent()}
      </>
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
})(PageElement);
