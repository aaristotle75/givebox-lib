/* eslint-disable */

import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	Image,
	CustomCKEditor4
} from '../../';
import Moment from 'moment';

const emailTemplate = require('html-loader!./receiptEmailTemplate.html');
const defaultContent = require('html-loader!./receiptEmailDefaultContent.html');
const GBX_SHARE = process.env.REACT_APP_GBX_SHARE;

class ReceiptEmailEdit extends React.Component {

	constructor(props) {
		super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.setTemplate = this.setTemplate.bind(this);

		const info = props.info;
		const receiptConfig = props.receiptConfig;
		const data = props.data;

		const style = util.getValue(receiptConfig, 'receiptStyle', {});
		const link = `${GBX_SHARE}/${util.getValue(info, 'articleID')}`;
		const orgImage = util.getValue(info, 'orgImage');
		const orgName = util.getValue(info, 'orgName');
		const articleTitle = util.getValue(data, 'title');
		const articleImageURL = util.getValue(data, 'imageURL');

		const tokens = {
			'{{color}}': util.getValue(style, 'primaryColor', props.primaryColor),
			'{{link}}': link,
			'{{orgimage}}': util.imageUrlWithStyle(orgImage, 'small'),
			'{{orgname}}': orgName,
			'{{articletitle}}': articleTitle,
			'{{articleimage}}': util.imageUrlWithStyle(articleImageURL, 'medium'),
			'{{message}}': `Write your content for your audience...`
		};
		const content = util.getValue(receiptConfig, 'content', `${util.replaceAll(defaultContent, tokens)}`);

		this.state = {
		};
	}

	onBlur(value) {
		const content = util.cleanHtml(value);
		this.setState({ content },
			() => {
				this.setTemplate()
			}
		);
	}

	onChange(value) {
		const content = util.cleanHtml(value);
		this.setState({ content },
			() => {
				this.setTemplate()
			}
		);
	}

	setTemplate(display = false) {
		const {
			info
		} = this.props;

		const content = this.state.content;
		const tokens = {
			'{{orgname}}': util.getValue(info, 'orgName'),
			'{{content}}': content
		};

		const html = util.replaceAll(emailTemplate, tokens);

		/*
		this.props.setTemplateHTML(`${content}`);
		this.props.setTemplateConfig({
			content
		});
		*/

		if (display) {
			return (
				<div dangerouslySetInnerHTML={{ __html: html }} />
			);
		}
	}

	render() {

		const {
			info
		} = this.props;

		const {
			content
		} = this.state;

		return (
			<>
				{/*<CodeBlock className='alignCenter' type="javascript" regularText={<label style={{ display: 'block' }} className='label'>Share Link</label>} text={link} name='Click here to Copy Link' nameIcon={false} nameStyle={{}} />*/}
				<div style={{ paddingTop: 0 }} className='input-group'>
					<label className='label'>Email Content</label>
				</div>
				<div className='block flexCenter'>
					<CustomCKEditor4
						orgID={util.getValue(info, 'orgID', null)}
						articleID={util.getValue(info, 'articleID', null)}
						 onChange={this.onChange}
						onBlur={this.onBlur}
						content={content}
						width={600}
						height={400}
						type='classic'
					/>
				</div>
			</>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const data = util.getValue(gbx3, 'data', {});
	const receiptConfig = util.getValue(data, 'receiptConfig', {});
	const receiptStyle = util.getValue(receiptConfig, 'style', {});

	return {
		info,
		data,
		receiptStyle
	}
}

export default connect(mapStateToProps, {
})(ReceiptEmailEdit);
