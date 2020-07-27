import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	ModalRoute,
	ModalLink,
	TextField,
	GBLink
} from '../../../';
import AnimateHeight from 'react-animate-height';

class ShareLink extends Component {

	constructor(props) {
		super(props);
		this.state = {
			slug: this.props.slug
		};
		this.mounted = false;
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
			slug
		} = this.state;

		const {
			hasCustomSlug,
			articleID
		} = this.props;

		console.log('execute slug', slug);

		const shareUrl = `${process.env.REACT_APP_GBX_SHARE}/${hasCustomSlug ? slug : articleID}`;
		const permShareUrl = `${process.env.REACT_APP_GBX_SHARE}/${articleID}`;

		return (
			<>
				<ModalRoute
					className='gbx3'
					id='editShareLink'
					effect='3DFlipVert'
					style={{ width: '70%' }}
					draggable={true}
					draggableTitle={`Editing Share Link`}
					closeCallback={this.closeEditModal}
					component={() =>
						<div className='modalWrapper'>
							<div className='modalFormContainer'>
								<TextField
									name='slug'
									label='Custom Share Link Name ( URL Slug)'
									placeholder='Enter a Custom Share Link Name (URL Slug)'
									required={true}
									value={slug}
									onChange={(e) => {
										const slug = e.currentTarget.value;
										console.log('execute onChange', slug);
										this.setState({ slug });
									}}
								/>
								<AnimateHeight
									duration={500}
									height={slug || hasCustomSlug ? 'auto' : 1}
								>
									<div className='input-group'>
										<label style={{ display: 'block' }} className='label'>Example of Your Custom Share Link</label>
										<GBLink style={{ textAlign: 'left' }} onClick={() => window.open(shareUrl)}>{shareUrl}</GBLink>
									</div>
								</AnimateHeight>
								<div className='input-group'>
									<label style={{ display: 'block' }} className='label'>Permanent Share Link</label>
									<GBLink style={{ textAlign: 'left' }} onClick={() => window.open(permShareUrl)}>{permShareUrl}</GBLink>
								</div>
							</div>
						</div>
					}
				/>
				<ModalLink id='editShareLink'>
					{shareUrl}
				</ModalLink>
			</>
		)
	}
}

function mapStateToProps(state, props) {

	const articleID = util.getValue(state, 'gbx3.info.articleID');
	const slug = util.getValue(state, 'gbx3.data.slug');
	const hasCustomSlug = util.getValue(state, 'gbx3.data.hasCustomSlug');


	return {
		articleID,
		slug,
		hasCustomSlug
	}
}

export default connect(mapStateToProps, {
})(ShareLink);
