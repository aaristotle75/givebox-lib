import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	ModalRoute,
	ModalLink,
	TextField,
	GBLink,
	CodeBlock,
	types,
	Collapse,
	Alert,
	Loader
} from '../../../';
import { toggleModal } from '../../../api/actions';
import { sendResource } from '../../../api/helpers';
import { updateData } from '../../redux/gbx3actions';
import AnimateHeight from 'react-animate-height';

class ShareLink extends Component {

	constructor(props) {
		super(props);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.updateSlug = this.updateSlug.bind(this);
		const slug = props.slug;
		this.state = {
			saving: false,
			newSlug: slug,
			newSlugDefault: slug,
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
			<>
				<ModalRoute
					className='gbx3'
					id='editShareLink'
					effect='3DFlipVert'
					style={{ width: '70%' }}
					draggable={true}
					draggableTitle={`Share Link`}
					closeCallback={this.closeEditModal}
					component={() =>
						<div className='modalWrapper'>
							<div className='modalFormContainer shareAdmin'>
								{saving ? <Loader msg='Saving Custom Share Link...' /> : <></> }
								<CodeBlock style={{ marginTop: 10, fontSize: '1em' }} className='alignCenter' type='javascript' regularText={<div style={{ marginBottom: 5 }}>Use this link to share your {types.kind(kind).name}</div>} text={shareUrl} name={` Click Here to Copy Your Share Link`} nameIcon={false} nameStyle={{}} />
								<Collapse
									label={`Customize Your Share Link`}
									iconPrimary='customizeShareLink'
								>
									<div className='formSectionContainer'>
										<div className='formSection'>
											<TextField
												name='slug'
												fixedLabel={true}
												label='Custom Share Link Name ( URL Slug)'
												placeholder='Enter a Custom Share Link Name (URL Slug)'
												style={{ paddingBottom: 0, marginBottom: 5 }}
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
											/>
											<div style={{ margin: 5 }} className='fieldContext'>
												<span className='icon icon-arrow-right'></span> Please use only alphanumeric or !@#%*_+- characters.
											</div>
											<div style={{ margin: 5 }} className='fieldContext'>
												<span className='icon icon-arrow-right'></span> Do not include the domain. Enter just the name which comes after {process.env.REACT_APP_GBX_SHARE}/
											</div>
											<div style={{ margin: 5 }} className='fieldContext'>
												<span className='icon icon-arrow-right'></span> Changing the custom share link will make the old one no longer work.
											</div>
											<AnimateHeight
												duration={500}
												height={ (newSlug && (newSlug !== slug)) || (success) || (saving) ? 'auto' : 1}
											>
												<div style={{ marginTop: 20 }} className='center'>
													<div style={{ fontSize: 12, display: 'block' }}>Preview of Your New Custom Share Link:</div>
													{newShareUrl}
													<div style={{ marginTop: 10 }}>
														<Alert alert='error' display={errorUpdating} msg={`Unable to update: ${errorMsg}.`} />
														<Alert alert='success' display={success} msg={`${successMsg}.`} />
													</div>
													<div className='button-group center'>
														<GBLink className='button' onClick={this.updateSlug}>Check Availability / Update Share Link</GBLink>
													</div>
												</div>
											</AnimateHeight>
										</div>
									</div>
								</Collapse>
								<Collapse
									label={`Permanent Share Link (This Cannot be Changed)`}
									iconPrimary='permanentShareLink'
								>
									<div className='formSectionContainer'>
										<div className='formSection'>
											<TextField
												name='permaLink'
												fixedLabel={true}
												label='Permanent Share Link'
												placeholder='This Cannot Be Changed'
												style={{ paddingBottom: 0, marginBottom: 5 }}
												value={permShareUrl}
												errorType='tooltip'
												readOnly={true}
												readOnlyText='Permanent Share Link Cannot be Changed'
											/>
										</div>
									</div>
								</Collapse>
							</div>
						</div>
					}
					buttonGroup={
						<div className='gbx3'>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								<GBLink className='button' onClick={() => this.closeEditModal()}>Close</GBLink>
							</div>
						</div>
					}
				/>
				<ModalLink className='shareLink' id='editShareLink'>
					<div className='flexCenter flexColumn'>
						<div style={{ fontSize: 12, display: 'block' }}>Edit Share Link:</div>
						{shareUrl}
					</div>
				</ModalLink>
			</>
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
})(ShareLink);
