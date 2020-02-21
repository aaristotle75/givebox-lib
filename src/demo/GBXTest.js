import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomTemplate from '../lib/gbx/CustomTemplate';
import {
  util,
  getResource,
  sendResource,
  Loader,
  types,
  Alert
} from '../lib';

class GBXTest extends Component {

  constructor(props) {
    super(props);
    this.saveCustomTemplate = this.saveCustomTemplate.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.state = {
      success: false,
      error: false,
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

  success() {
    this.setState({ success: true });
    this.timeout = setTimeout(() => {
      this.setState({ success: false });
      this.timeout = null;
    }, 2500);
  }

  error() {
    this.setState({ error: true });
    this.timeout = setTimeout(() => {
      this.setState({ error: false });
      this.timeout = null;
    }, 2500);
  }

  saveCustomTemplate(customTemplate) {
    const kind = util.getValue(this.props.article, 'kind');
    const kindID = util.getValue(this.props.article, 'kindID');

    if (kindID && kind) {
      const resource = `org${types.kind(kind).api.item}`;
      this.props.sendResource(resource, {
        id: [kindID],
        data: {
          giveboxSettings: {
            customTemplate
          }
        },
        method: 'patch',
        callback: (res, err) => {
          if (!err) {
            this.success();
          } else {
            this.error();
          }
        }
      });
    } else {
      console.error(`No kind or KindID ${kind} ${kindID}`);
    }
  }

  render() {

    if (util.isEmpty(this.props.article)) return <Loader msg='Loading article...' />

    return (
      <div>
        <Alert alert='error' display={this.state.error} msg={'Error saving, check console'} />
        <Alert alert='success' display={this.state.success} msg={'Custom Template Saved'} />
        <CustomTemplate
          article={this.props.article}
          save={this.saveCustomTemplate}
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
  sendResource,
  getResource
})(GBXTest);
