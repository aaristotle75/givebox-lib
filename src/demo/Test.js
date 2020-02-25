import React, { Component } from 'react';
import {
  util,
  RichTextField
} from '../lib';

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

  onBlur(name, value, hasText) {
    const content = hasText ? value : '';
    console.log('execute onBlur', content, hasText);
    this.setState({ content });
  }

  onChange(name, value, hasText) {
    const content = hasText ? value : '';
    console.log('execute onChange', content, hasText);
    this.setState({ content });
  }

  render() {

    return (
      <>
        <RichTextField
          label=''
          placeholder='Enter title...'
          modal={false}
          required={false}
          onChange={this.onChange}
          onBlurEditor={this.onBlur}
          value={this.state.content}
          allowLink={true}
        />
        <div dangerouslySetInnerHTML={{ __html: this.state.content}} />
      </>
    )
  }
}
