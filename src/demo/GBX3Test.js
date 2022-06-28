import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as util from '../lib/common/utility';
import GBX3 from '../lib/gbx3/GBX3';
import has from 'has';

class GBXTest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //id: 587,
      id: 383060,
      //id: 4
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  saveCallback(id, data, blocks) {
    console.log('execute saveCallback', id, data, blocks);
  }

  backToOrgCallback(template) {
    console.log('execute backToOrgCallback', template);
  }

  render() {

    const {
      queryParams,
      routeParams
    } = this.props;

    // 383102 // 1130 // 383064; // 13; // 739; // 4; //651; //735; //383071;
    let articleID = +util.getValue(routeParams, 'articleID', null);
    if (isNaN(articleID)) articleID = 4;
    const orgID = util.getValue(queryParams, 'orgID', null); //185; //391217; //185;
    const blockType = 'org';
    const browse = true;
    const autoCreate = util.getValue(queryParams, 'autoCreate', null);
    const step = autoCreate ? 'create' : null;
    const admin = has(queryParams, 'admin') ? true : false;
    /*
    console.log('execute blockType -> ', blockType);
    console.log('execute orgID -> ', orgID);
    console.log('execute articleID -> ', articleID, isNaN(articleID), !isNaN(articleID));
    console.log('execute browse -> ', browse);
    */

    if ( (orgID && blockType === 'org' && !isNaN(articleID)) || (articleID && blockType === 'article' && !isNaN(articleID)) || (browse && !isNaN(articleID)) ) {

      return (
        <div>
          <GBX3
            step={step}
            signup={false}
            browse={false}
            blockType={'article'}
            orgID={orgID}
            articleID={articleID}
            saveCallback={this.saveCallback}
            queryParams={queryParams}
            public={false}
            project={admin ? 'admin' : 'share'}
            exitCallback={() => console.log('exit callback')}
            isVolunteer={false}
          />
        </div>
      )
    } else {
      return (
        <div>Error loading...</div>
      )
    }
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(GBXTest);
