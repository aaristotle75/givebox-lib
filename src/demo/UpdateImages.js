import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCustomProp } from '../lib/api/actions';
import { getResource, sendResource } from '../lib/api/helpers';
import Loader from '../lib/common/Loader';
import {
  util,
  GBLink
} from '../lib/'
import { prodPerms } from './prodPerms';

const AWS_SEARCH_URL = {
  staging: 'https://givebox-staging.s3.amazonaws.com',
  prod: 'https://givebox.s3.amazonaws.com'
}

const REPLACE_URL = {
  staging: 'https://staging-cdn.givebox.com/givebox-staging',
  prod: 'https://cdn.givebox.com/givebox'
}

const ENV = 'staging';

class UpdateImages extends Component {

  constructor(props) {
    super(props);
    this.dfsTraverse = this.dfsTraverse.bind(this);
    this.filterURLs = this.filterURLs.bind(this);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    this.props.getResource('articles', {
      search: {
        filter: 'customTemplate:!null',
        max: 2000
      },
      reload: true,
      callback: (res, err) => {
        const data = util.getValue(res, 'data', {});
        if (!util.isEmpty(data)) {
          this.dfsTraverse(data, this.filterURLs);
        }
      }
    });
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  dfsTraverse(obj, filter) {
    if (typeof obj !== 'object' || obj === null) return;

    Object.entries(obj).forEach(([key, value]) => {
      if (filter(key, value)) this.dfsTraverse(value, filter);
    });
  }

  filterURLs(key, value) {
    //console.log('execute filterURLs -> ', key, value);
    const oldValue = value;
    if (typeof value === 'string') {
      if (value.includes(AWS_SEARCH_URL[ENV])) {
        const newValue = value.replace(AWS_SEARCH_URL[ENV], REPLACE_URL[ENV]);
        console.log('execute replace ', oldValue, ' -> ', newValue);
      }
    }
    /*
    if (value.includes(AWS_SEARCH_URL[ENV])) {
      const items = this.state.items.push(
        <div
          key={key}
          style={{
            display: 'block',
            margin: '5px 0',
            fontSize: 12
          }}
        >
          {value}
        </div>
      );
      this.setState({ items });
      return false;
    }
    */
    return true;
  }

  render() {

    const {
      items
    } = this.state;

    if (util.isLoading(this.props.articles)) return <Loader msg='Loading Articles...' />

    return (
      <div className='demoPageWrapper'>
        <h2>Staging Images to Update</h2>
        <div>
          <div style={{ width: '50%', display: 'inline-block', verticalAlign: 'top' }}>
            <GBLink onClick={() => console.log('execute update URLs')}>
              Update URLs
            </GBLink>
            {items}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
    articles: util.getValue(state, 'resource.articles', {})
  }
}


export default connect(mapStateToProps, {
  setCustomProp,
  getResource,
  sendResource
})(UpdateImages)
