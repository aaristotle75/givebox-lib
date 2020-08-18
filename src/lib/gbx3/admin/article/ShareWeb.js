import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	Tabs,
	Tab
} from '../../../';
import ShareWebPop from './ShareWebPop';
import ShareWebIframe from './ShareWebIframe';

class ShareWeb extends Component {

	constructor(props) {
		super(props);
		this.state = {
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

	render() {

		const {
			slug,
			hasCustomSlug,
			articleID,
			kind
		} = this.props;

		const shareUrl = `${process.env.REACT_APP_GBX_SHARE}/${hasCustomSlug && slug ? slug : articleID}`;

		return (
			<div className='formSectionContainer'>
				<div className='formSection'>
					<Tabs
						default={'pop'}
						className='subTabs'
					>
						<Tab id='pop' label={<span className='stepLabel'>Embed Popup Widget</span>}>
							<ShareWebPop />
						</Tab>
						<Tab id='iframe' label={<span className='stepLabel'>Embed iFrame</span>}>
							<ShareWebIframe />
						</Tab>
					</Tabs>
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
})(ShareWeb);
