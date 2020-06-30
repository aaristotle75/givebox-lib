/* eslint-disable */

import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	Image,
	CustomCKEditor4,
	saveGBX3,
	updateData
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
		this.setPreviewHTML = this.setPreviewHTML.bind(this);
		this.save = this.save.bind(this);

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

		console.log('execute', receiptConfig);

		const content = util.getValue(receiptConfig, 'content', `${util.replaceAll(defaultContent, tokens)}`);

		this.state = {
			content
		};
	}

	componentDidMount() {
		this.setPreviewHTML()
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	onBlur(value) {
		const content = util.cleanHtml(value);
		this.setState({ content },
			() => {
				this.save(true);
				this.setPreviewHTML()
			}
		);
	}

	onChange(value) {
		const content = util.cleanHtml(value);
		this.setState({ content },
			() => {
				this.save();
				this.setPreviewHTML()
			}
		);
	}

	setPreviewHTML() {
		const {
			info
		} = this.props;

		const content = this.state.content;
		const tokens = {
			'{{content}}': content
		};

		const html = util.replaceAll(emailTemplate, tokens);
	}

	async save(saveGBX3 = false) {
		const {
			content
		} = this.state;

		const obj = {
			receiptHTML: content,
			receiptConfig: {
				content
			}
		}
		const dataUpdated = await this.props.updateData(obj);
		if (dataUpdated && saveGBX3) this.props.saveGBX3(obj);
	}

	render() {

		const {
			info
		} = this.props;

		const {
			content
		} = this.state;

		return (
			<div className='gbx3Layout gbx3ReceiptLayout'>
				<div className='gbx3Container gbx3ReceiptContainer'>
					<div className='block flexCenter'>
						<CustomCKEditor4
							orgID={util.getValue(info, 'orgID', null)}
							articleID={util.getValue(info, 'articleID', null)}
							 onChange={this.onChange}
							onBlur={this.onBlur}
							content={content}
							width={600}
							height={'600'}
							type='classic'
						/>
					</div>
				</div>
			</div>
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
		receiptConfig,
		receiptStyle
	}
}

export default connect(mapStateToProps, {
	saveGBX3,
	updateData
})(ReceiptEmailEdit);
