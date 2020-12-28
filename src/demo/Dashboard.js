import React, { Component } from 'react';
import { connect } from 'react-redux';
import TestForm from './TestForm';
import Form from '../lib/form/Form';
import MediaLibrary from '../lib/form/MediaLibrary';
import { setCustomProp } from '../lib/api/actions';
import { getResource } from '../lib/api/helpers';
import CircularProgress from '../lib/common/CircularProgress';
import has from 'has';
import {
  util
} from '../lib/'

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  handleSaveCallback(url) {
    console.log('execute handleSaveCallback', url);
  }

  render() {

    const library = {
      saveMediaType: 'org',
      articleID: 651,
      orgID: 185,
      type: 'article',
      borderRadius: 0
    };

    return (
      <div>
        <h2>Dashboard</h2>
        <MediaLibrary
          blockType={'article'}
          image={null}
          preview={null}
          handleSaveCallback={this.handleSaveCallback}
          handleSave={util.handleFile}
          library={library}
          showBtns={'hide'}
          saveLabel={'close'}
          mobile={false}
          uploadOnly={true}
        />
        {/*
        <CircularProgress
          progress={100}
          startDegree={0}
          progressWidth={5}
          trackWidth={5}
          cornersWidth={1}
          size={90}
          fillColor="transparent"
          trackColor={'#e8ebed'}
          progressColor={'#e83b2e'}
          progressColor2={'#29eee6'}
          gradient={true}
        />
        <Form
          name='testForm'
          options={{
            color: '#ecab1f'
          }}>
          <TestForm {...this.props} />
        </Form>
        */}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

  return {
  }
}


export default connect(mapStateToProps, {
  setCustomProp,
  getResource
})(Dashboard)
