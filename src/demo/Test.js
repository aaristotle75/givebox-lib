import React, { Component } from 'react';
import {
  util,
  RichTextField
} from '../lib';
import GBXEditor from '../lib/gbx/GBXEditor';

export default class Test extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    const content = `<h3>Test editor</h3>`;

    this.state = {
      content
    };
  }

  onBlur(content) {
    console.log('execute onBlur', content);
    this.setState({ content });
  }

  onChange(content) {
    //console.log('execute onChange', content);
    this.setState({ content });
  }

  render() {

    return (
      <>
        <GBXEditor
          label=''
          placeholder='Enter title...'
          onChange={this.onChange}
          onBlur={this.onBlur}
					orgID={185}
        />
      </>
    )
  }
}
