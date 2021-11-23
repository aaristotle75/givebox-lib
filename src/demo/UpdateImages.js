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
import has from 'has';

const AWS_SEARCH_URL = {
  staging: 'https://cdn.givebox.com/givebox',
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
    this.traverseAndSearch = this.traverseAndSearch.bind(this);
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
            this.traverseAndSearch(value, '', value);
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
    console.log('execute -> ', articleID, orgID, id, endpoint, data);
    /*
    this.props.sendResource(``, {

    });
    */
  }

  filterURLs(key, value, rootObj, saveCallback, pathArr) {
    //console.log('execute filterURLs -> ', key, value);
    const oldValue = value;
    if (typeof value === 'string') {
      if (value.includes(AWS_SEARCH_URL[ENV])) {
        const newValue = value.replace(AWS_SEARCH_URL[ENV], REPLACE_URL[ENV]);
        //console.log('execute filterURLs pathArr -> ', pathArr);
        saveCallback(rootObj, {
          [key]: newValue
        });
      }
    }
    return true;
  }

  traverseAndSearch(obj = {}, head = '', rootObj = {}) {
    Object.entries(obj || {}).forEach(([key, value]) => {
      const fullPath = util.addDelimiter(head, key);
      if (util.isObject(value)) {
        this.traverseAndSearch(value, fullPath, rootObj);
      } else {
        const needle = obj[key];
        if (typeof needle === 'string') {
          if (needle.includes(AWS_SEARCH_URL[ENV])) {
            const newValue = value.replace(AWS_SEARCH_URL[ENV], REPLACE_URL[ENV]);
            util.mutateObject(rootObj, fullPath, newValue);
            const endpoint = `org${types.kind(util.getValue(rootObj, 'kind')).api.item}`;
            const articleID = util.getValue(rootObj, 'ID');
            const orgID = util.getValue(rootObj, 'orgID');
            const id = util.getValue(rootObj, 'kindID');
            console.log(fullPath, needle, rootObj);
            return `${fullPath}: ${needle}`;
          }
        }
      }
    });
  }

  traverseAndSearch2(obj = {}, head = '', rootObj = {}) {
    Object.entries(obj || {}).reduce((product, [key, value]) => {
      const fullPath = util.addDelimiter(head, key);
      if (util.isObject(value)) {
        this.traverseAndSearch(value, fullPath, rootObj);
      } else {
        const needle = obj[key];
        if (typeof needle === 'string') {
          if (needle.includes(AWS_SEARCH_URL[ENV])) {
            const newValue = value.replace(AWS_SEARCH_URL[ENV], REPLACE_URL[ENV]);
            rootObj[`${fullPath}`] = newValue;
            const endpoint = `org${types.kind(util.getValue(rootObj, 'kind')).api.item}`;
            const articleID = util.getValue(rootObj, 'ID');
            const orgID = util.getValue(rootObj, 'orgID');
            const id = util.getValue(rootObj, 'kindID');
            console.log(fullPath, needle, rootObj);
            return `${fullPath}: ${needle}`;
          }
        }
      }
    }, []);
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
