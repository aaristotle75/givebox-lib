import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomTemplate from '../lib/gbx/CustomTemplate';
import {
  util
} from '../lib';

class GBXTest extends Component {

  render() {

    return (
      <div>
        <CustomTemplate

        />
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}

export default connect(mapStateToProps, {
})(GBXTest);
