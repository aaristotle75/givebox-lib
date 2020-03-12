import React, { Component } from 'react';
import {
  util,
  RichTextField
} from '../lib';
import Editor from '../lib/gbx3/tools/Editor';

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

		const dirty = `<a href='http://buddyteal.com' target="_blank" onClick="alert('hello')">Test link</a>`;

		const clean = util.cleanHtml(dirty);

    return (
      <>
        <Editor
          label=''
          placeholder='Enter title...'
          onChange={this.onChange}
          onBlur={this.onBlur}
					orgID={185}
					content='test'
        />
				<div dangerouslySetInnerHTML={{ __html: clean}} />
      </>
    )
  }
}
