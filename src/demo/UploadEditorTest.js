/* eslint-disable */
import React, { Component } from 'react';
import * as util from '../lib/common/utility';
import MediaLibrary from '../lib/form/MediaLibrary';

export default class UploadEditorTest extends Component {

  constructor(props) {
    super(props);
    this.closeModalAndSave = this.closeModalAndSave.bind(this);
    this.handleSaveCallback = this.handleSaveCallback.bind(this);
    this.state = {
      url: 'https://givebox-staging.s3.amazonaws.com/gbx%2F9b28b33157275cf5c8fa036633a3b33d%2F2018-11-09%2Fwesome1-jpg-original-jpg%2Foriginal'
    };
  }

  closeModalAndSave() {
    console.log('execute closeModalAndSave');
  }

  handleSaveCallback(url) {
    console.log('execute handleSaveCallback', url);
  }

  render() {

    const {
      url
    } = this.state;

    const library = {
      orgID: 185,
      articleID: 4,
      type: 'article',
      borderRadius: 0
    }

    return (
      <div className='block'>
        <MediaLibrary
          image={url}
          preview={url}
          handleSaveCallback={this.handleSaveCallback}
          handleSave={util.handleFile}
          library={library}
          closeModalAndSave={this.closeModalAndSave}
        />
      </div>
    )
  }
}
