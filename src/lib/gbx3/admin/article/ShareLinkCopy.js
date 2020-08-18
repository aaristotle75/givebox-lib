import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	CodeBlock,
	types,
	Fade
} from '../../../';

class ShareLinkCopy extends Component {

	constructor(props) {
		super(props);
		this.copyCallback = this.copyCallback.bind(this);
		this.state = {
			copied: false
		};
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	copyCallback() {
		this.setState({ copied: true });
		this.timeout = setTimeout(() => {
			this.setState({ copied: false });
			this.timeout = null;
		}, 1000);
	}

	render() {

		const {
			slug,
			hasCustomSlug,
			articleID,
			kind
		} = this.props;

		const {
			copied
		} = this.state;

		const shareUrl = `${process.env.REACT_APP_GBX_SHARE}/${hasCustomSlug && slug ? slug : articleID}`;

		return (
			<div className='shareLink formSectionContainer'>
				<div className='formSection'>
					<div className='subText'>
						{shareUrl}
					</div>
					<CodeBlock copyCallback={this.copyCallback} style={{ marginTop: 10, fontSize: '1em' }} className='flexCenter flexColumn' type='javascript' regularText={''} text={shareUrl} name={<div className='copyButton'>Click Here to Copy Your Share Link</div>} nameIcon={false} nameStyle={{}} />
					<div className={`codeCopied ${copied ? 'copied' : ''}`}>
						<span className='icon icon-check-circle'></span>
						<span className='copiedText'>Copied</span>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const kind = util.getValue(state, 'gbx3.info.kind');
	const kindID = util.getValue(state, 'gbx3.info.kindID');
	const articleID = util.getValue(state, 'gbx3.info.articleID');
	const slug = util.getValue(state, 'gbx3.data.slug');
	const hasCustomSlug = util.getValue(state, 'gbx3.data.hasCustomSlug');


	return {
		kind,
		kindID,
		articleID,
		slug,
		hasCustomSlug
	}
}

export default connect(mapStateToProps, {
})(ShareLinkCopy);
