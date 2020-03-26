/* eslint-disable */

import React, { Component } from 'react';
import {
  util,
  RichTextField,
	GBLink,
	Popup,
	ColorPicker
} from '../lib';
import CustomCKEditor from '../lib/editor/CustomCKEditor';
import CustomDraft from '../lib/editor/CustomDraft';
import CustomCKEditor4 from '../lib/editor/CustomCKEditor4';
import '../lib/styles/gbx3.scss';
import '../lib/styles/emailTemplate.scss';

const emailTemplate = require('html-loader!../lib/editor/emailTemplate.html');
const defaultContent = require('html-loader!../lib/editor/templateContent.html');

export default class Test extends Component {

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
		this.renderTemplate = this.renderTemplate.bind(this);
		this.buttonClick = this.buttonClick.bind(this);
    this.state = {
      content: defaultContent,
			editBtn: false
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
		const tokens = {
			'{{content}}': content
		};

	  const html = util.replaceAll(emailTemplate, tokens);
		return (
			<div dangerouslySetInnerHTML={{ __html: html }} />
		);
	}

	buttonClick(type, open) {
		switch (type) {
			case 'cancel': {
				break;
			}

			case 'ok': {
				break;
			}

			// no default
		}
		this.setState({ editBtn: open });
	}

  render() {

		const {
			content
		} = this.state;

		const dirty = `test`;
		const clean = util.cleanHtml(dirty);

    return (
      <div className='block emailTemplate'>
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
					width={645}
					height={600}
				/>
				<Popup
					title={'Test title'}
					buttonCallback={this.buttonClick}
					open={this.state.editBtn}
				>
					<h2>Test</h2>
					<ColorPicker
						name='bgColor'
						fixedLabel={true}
						label='Button Background Color'
						modalID='colorPickerBgColor'
						opts={{
							customOverlay: {
								zIndex: 9999909
							}
						}}
					/>
				</Popup>
				<GBLink onClick={() => this.buttonClick('open', true)}>Edit Button</GBLink>
				{this.renderTemplate()}
      </div>
    )
  }
}
