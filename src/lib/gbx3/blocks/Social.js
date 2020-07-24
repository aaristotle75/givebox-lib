import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util,
	types
} from '../../';
import {
	FacebookShareButton,
	TwitterShareButton,
	PinterestShareButton,
	LinkedinShareButton
} from 'react-share';

const GBX_SHARE = process.env.REACT_APP_GBX_SHARE;

class Social extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	render() {

		const {
			data: article,
			subText,
			shareIconSize
		} = this.props;

		const shareLink = `${GBX_SHARE}/${util.getValue(article, 'articleID')}`;
		const title = util.getValue(article, 'title');
		const image = util.imageUrlWithStyle(article.imageURL, 'medium');
		const description = util.getValue(article, 'summary');

		return (
			<div className='share'>
				{subText}
				<ul className="center">
					<li>
						<FacebookShareButton
							url={shareLink}
							quote={title}
							onShareWindowClose={() => this.linkClicked('facebook')}
						>
							{types.socialIcons('facebook', shareIconSize)}
						</FacebookShareButton>
					</li>
					<li>
						<TwitterShareButton
							url={shareLink}
							title={title}
							onShareWindowClose={() => this.linkClicked('twitter')}
						>
							{types.socialIcons('twitter', shareIconSize)}
						</TwitterShareButton>
					</li>
					{image ?
					<li>
						<PinterestShareButton
							url={shareLink}
							media={image}
							windowWidth={700}
							windowHeight={600}
							onShareWindowClose={() => this.linkClicked('pinterest')}
						>
							{types.socialIcons('pinterest', shareIconSize)}
						</PinterestShareButton>
					</li> : ''}
					<li>
						<LinkedinShareButton
							url={shareLink}
							title={title}
							description={description}
							onShareWindowClose={() => this.linkClicked('linkedin')}
						>
							{types.socialIcons('linkedin', shareIconSize)}
						</LinkedinShareButton>
					</li>
				</ul>
			</div>
		)
	}
};

Social.defaultProps = {
	shareIconSize: 35
}

function mapStateToProps(state, props) {
	const data = util.getValue(state, 'gbx3.data', {});

	return {
		data
	}
}

export default connect(mapStateToProps, {
})(Social);
