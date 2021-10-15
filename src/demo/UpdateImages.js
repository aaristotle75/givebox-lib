import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCustomProp } from '../lib/api/actions';
import { getResource, sendResource } from '../lib/api/helpers';
import Loader from '../lib/common/Loader';
import {
  util,
  GBLink,
  types
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
    this.saveArticle = this.saveArticle.bind(this);
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
          Object.entries(data).forEach(([key, value]) => {
            this.dfsTraverse(value, this.filterURLs, value, '/', this.saveArticle);
          });
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

  saveArticle(rootObj, data) {
    const endpoint = `org${types.kind(util.getValue(rootObj, 'kind')).api.item}`;
    const articleID = util.getValue(rootObj, 'ID');
    const orgID = util.getValue(rootObj, 'orgID');
    const id = util.getValue(rootObj, 'kindID');
    //console.log('execute -> ', articleID, orgID, id, endpoint, data);
    /*
    this.props.sendResource(``, {

    });
    */
  }

  dfsTraverse(obj, filter, rootObj = {}, path = '', saveCallback) {
    if (typeof obj !== 'object' || obj === null) return;

    Object.entries(obj).forEach(([key, value]) => {
      if (filter(key, value, rootObj, path, saveCallback)) {
        if (typeof value === 'object') {
          path = `${path}${path === '/' ? '' : '/'}${key}`;
        } else {
          path = path.substring(0, path.lastIndexOf('/'));
        }
        console.log('execute path -> ', path);
        this.dfsTraverse(value, filter, rootObj, path, saveCallback);
      }
    });
  }

  filterURLs(key, value, rootObj, path, saveCallback) {
    //console.log('execute filterURLs -> ', key, value);
    const oldValue = value;
    if (typeof value === 'string') {
      if (value.includes(AWS_SEARCH_URL[ENV])) {
        const newValue = value.replace(AWS_SEARCH_URL[ENV], REPLACE_URL[ENV]);
        //console.log('execute filterURLs path -> ', path);
        saveCallback(rootObj, {
          [key]: newValue
        });
      }
    }
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
