/* eslint-disable */

import React, { Component } from 'react';
import {
  util,
  RichTextField
} from '../lib';
import CustomCKEditor from '../lib/editor/CustomCKEditor';
import CustomDraft from '../lib/editor/CustomDraft';
import CustomCKEditor4 from '../lib/editor/CustomCKEditor4';
import '../lib/styles/gbx3.scss';
const emailTemplate = require('html-loader!../lib/editor/emailTemplate.html');
const content = require('html-loader!../lib/editor/templateContent.html');
const footer = require('html-loader!../lib/editor/templateFooter.html');

export default class Test extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      content
    };
  }

  onBlur(content) {
    //console.log('execute onBlur', content);
    this.setState({ content });
  }

  onChange(content) {
    //console.log('execute onChange', content);
    this.setState({ content });
  }

	renderTemplate() {
		const content = this.state.content;
	}

  render() {

		const {
			content
		} = this.state;

		const dirty = `test`;
		const clean = util.cleanHtml(dirty);

    return (
      <div className='block'>
				{/*
				<CustomCKEditor
          label=''
          placeholder='Enter title...'
          onChange={this.onChange}
          onBlur={this.onBlur}
					orgID={185}
					content={content}
					width='500px'
					height='500px'
        />
        <CustomDraft
          label=''
          placeholder='Enter title...'
          onChange={this.onChange}
          onBlur={this.onBlur}
					orgID={185}
					content={content}
					width='500px'
        />
				*/}
				<CustomCKEditor4
					content={content}
					onBlur={this.onBlur}
					onChange={this.onChange}
				/>
				<div dangerouslySetInnerHTML={{ __html: emailTemplate }} />
      </div>
    )
  }
}
