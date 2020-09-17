import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	TextField,
	GBLink,
	types,
	Alert,
	Loader
} from '../../../';
import { toggleModal } from '../../../api/actions';
import { sendResource } from '../../../api/helpers';
import { updateData } from '../../redux/gbx3actions';

class ShareLinkEdit extends Component {

	constructor(props) {
		super(props);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.updateSlug = this.updateSlug.bind(this);
		const slug = props.slug;
		const hasCustomSlug = props.hasCustomSlug;
		const articleID = props.articleID;
		const newSlug = hasCustomSlug ? slug : articleID;

		this.state = {
			saving: false,
			newSlug,
			newSlugDefault: newSlug,
			error: false,
			errorMsg: 'Invalid characters in the share link name',
			errorUpdating: false,
			success: false,
			successMsg: 'Your Share Link has been updated successfully'
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

	updateSlug() {
		const {
			newSlug,
			error
		} = this.state;

		const {
			kind,
			kindID,
			orgID
		} = this.props;

		this.setState({ errorUpdating: false, saving: true });

		if (!error) {
			this.props.sendResource(`org${types.kind(kind).api.item}`, {
				orgID,
				id: [kindID],
				method: 'patch',
				data: {
					slug: newSlug
				},
				callback: (res, err) => {
					if (!util.isEmpty(res) && !err) {
						this.props.updateData(res);
						this.setState({ success: true });
						this.timeout = setTimeout(() => {
							this.setState({ success: false });
							this.timeout = null;
						}, 3000);
					} else {
						let errorMsg = 'An Error Occurred Saving';
						const errors = util.getValue(err, 'data.errors', []);
						const error = util.getValue(errors, 0, {});
						const code = util.getValue(error, 'code');
						if (code === 'duplicate') {
							errorMsg = 'Custom Share Name is Not Available. Please Choose Another Name'
						}
						this.setState({ errorMsg, errorUpdating: true });
					}
					this.setState({ saving: false });
				}
			});
		} else {
			this.setState({ errorUpdating: true, saving: false });
		}
	}

	closeEditModal() {
		this.props.toggleModal('editShareLink', false);
	}

	render() {

		const {
			newSlug,
			error,
			errorMsg,
			errorUpdating,
			success,
			successMsg,
			saving
		} = this.state;

		const {
			slug,
			hasCustomSlug,
			articleID,
			kind
		} = this.props;

		const shareUrl = `${process.env.REACT_APP_GBX_SHARE}/${hasCustomSlug && slug ? slug : articleID}`;
		const permShareUrl = `${process.env.REACT_APP_GBX_SHARE}/${articleID}`;
		const newShareUrl = `${process.env.REACT_APP_GBX_SHARE}/${newSlug}`;

		return (
			<div className='shareLink formSectionContainer'>
				<div className='formSection'>
					{saving ? <Loader msg='Saving Custom Share Link...' /> : <></> }
					<div className='flexCenter flexColumn'>
						<div className='shareLinkEditable'>
							<Alert alert='error' display={errorUpdating} msg={`Unable to update: ${errorMsg}.`} />
							<Alert alert='success' display={success} msg={`${successMsg}.`} />
							<div className='subText'>
								Customize How Customers See Your Link
							</div>
							<TextField
								name='slug'
								fixedLabel={true}
								label=''
								placeholder='enter-your-custom-url'
								style={{ width: '100%', paddingBottom: 0, marginBottom: 5 }}
								value={newSlug}
								error={error ? 'Share link name can only contain alphanumeric and !@#%*_+- characters.' : false}
								errorType={'tooltip'}
								onChange={(e) => {
									let error = false;
									const newSlug = e.currentTarget.value;
									const match = /^[a-zA-Z0-9!@#%*_+-]*$/
									if (!match.exec(newSlug)) {
										this.setState({ errorMsg: 'Invalid characters in the share link name' });
										error = true;
									} else {
										this.setState({ errorUpdating: false });
									}
									this.setState({ newSlug, error });
								}}
							>
								<div className='shareLinkPrefix'>https://givebox.com/</div>
							</TextField>
						</div>
						<div className='button-group center'>
							<GBLink className='button' onClick={this.updateSlug}>Check Availability / Update Share Link</GBLink>
						</div>
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
	toggleModal,
	updateData,
	sendResource
})(ShareLinkEdit);
