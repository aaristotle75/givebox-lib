/* eslint-disable */

import React from 'react';
import { connect } from 'react-redux';
import {
	util
} from '../../../';
import Moment from 'moment';
import ReceiptEmailLayout from './ReceiptEmailLayout';

const emailTemplate = require('html-loader!./receiptEmailTemplate.html');
const defaultContent = require('html-loader!./receiptEmailDefaultContent.html');
const GBX_SHARE = process.env.REACT_APP_GBX_SHARE;

class ReceiptEmailEdit extends React.Component {

	constructor(props) {
		super(props);
		this.setPreviewHTML = this.setPreviewHTML.bind(this);
		this.iframePreviewRef = React.createRef();
	}

	componentDidMount() {
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	setPreviewHTML() {
		const {
			receiptHTML
		} = this.props;

		const content = receiptHTML;
		const tokens = {
			'{{content}}': content
		};

		const html = util.replaceAll(emailTemplate, tokens);

		const iframeRef = util.getValue(this.iframePreviewRef, 'current', {});
		if (iframeRef) {
			iframeRef.contentDocument.write(html);
		}
	}


	render() {

		const {
			info,
			previewMode
		} = this.props;

		return (
			<div className='gbx3ReceiptLayout'>
				<div className='gbx3ReceiptContainer'>
					<div className='block'>
						<iframe id='emailIframePreview' className='emailIframe' style={{ height: previewMode ? '100vh' : 0 }} ref={this.iframePreviewRef}></iframe>
						{previewMode ?
							this.setPreviewHTML()
						:
							<div className='flexCenter'>
								<ReceiptEmailLayout />
							</div>
						}
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const previewMode = util.getValue(admin, 'previewMode');
	const receiptHTML = util.getValue(gbx3, 'data.receiptHTML');

	return {
		previewMode,
		receiptHTML
	}
}

export default connect(mapStateToProps, {
})(ReceiptEmailEdit);
