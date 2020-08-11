import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	ModalLink,
	ModalRoute,
	MediaLibrary,
	Collapse,
	GBLink,
	util
} from '../../../';
import { toggleModal } from '../../../api/actions';

class ArticleMenuStyleImage extends Component {

	constructor(props) {
		super(props);
		this.handleSaveCallback = this.handleSaveCallback.bind(this);
		this.closeModalAndSave = this.closeModalAndSave.bind(this);
		this.closeModalAndCancel = this.closeModalAndCancel.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);

		const imageURL = this.props.imageURL;
		this.state = {
			imageURL,
			defaultImage: util.deepClone(imageURL),
			hasBeenUpdated: false
		};
	}

	componentDidMount() {
	}

	componentWillUnmount() {
		//console.log('execute componentWillUnmount');
	}

	handleSaveCallback(url, justUploaded) {
		const imageURL= justUploaded ? url : util.imageUrlWithStyle(url, 'large');
		this.setState({
			imageURL,
			hasBeenUpdated: true
		}, () => this.closeEditModal('save'));
	}

	closeModalAndSave() {

		const {
			imageURL,
			hasBeenUpdated
		} = this.state;

		this.props.toggleModal(this.props.modalID, false);
		if (this.props.selectedCallback) this.props.selectedCallback(imageURL, hasBeenUpdated);
	}

	closeModalAndCancel() {
		const {
			defaultImage,
		} = this.state;

		this.setState({
			imageURL: util.deepClone(defaultImage)
		}, this.props.toggleModal(this.props.modalID, false));
	}

	closeEditModal(type = 'save') {
		this.setState({ loading: true });
		if (type !== 'cancel') {
			this.closeModalAndSave();
		} else {
			this.closeModalAndCancel();
		}
	}

	render() {

		const {
			modalID,
			articleID,
			orgID
		} = this.props;

		const {
			imageURL
		} = this.props;

		const library = {
			saveMediaType: 'article',
			articleID,
			orgID,
			type: 'article',
			borderRadius: 0
		}

		return (
			<>
				<ModalLink type='li' className='stylePanel' id={modalID}>
					Background Image
					<div className='stylePanelBackgroundImageIndicator'>{ imageURL ? 'Uploaded' : 'None' }</div>
				</ModalLink>
				<ModalRoute
					className='gbx3'
					optsProps={{ closeCallback: this.onCloseUploadEditor, customOverlay: { zIndex: 10000000 } }}
					id={modalID}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Editing Background Image`}
					closeCallback={this.closeEditModal}
					disallowBgClose={true}
					component={() =>
						<div className='modalWrapper'>
							<Collapse
								label={'Image'}
								iconPrimary='image'
								id={'gbx3-mediaLibrary'}
							>
								<div className='formSectionContainer'>
									<div className='formSection'>
										<MediaLibrary
											modalID={modalID}
											image={imageURL}
											preview={imageURL}
											handleSaveCallback={this.handleSaveCallback}
											handleSave={util.handleFile}
											library={library}
											closeModalAndCancel={() => this.closeEditModal('cancel')}
											closeModalAndSave={() => this.closeEditModal('save')}
											showBtns={'hide'}
											saveLabel={'close'}
										/>
									</div>
								</div>
							</Collapse>
							<div style={{ margin: 0 }} className='button-group center'>
								<GBLink className='link remove' onClick={this.props.removeImage}><span className='icon icon-trash-2'></span> <span className='buttonText'>Remove</span></GBLink>
								<GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={() => this.closeEditModal('save')}>Save</GBLink>
							</div>
						</div>
					}
				/>
			</>
		)
	}
}

function mapStateToProps(state, props) {

	const modalID = `designMenuStyleBackgroundImage`;
	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const articleID = util.getValue(info, 'articleID');
	const orgID = util.getValue(info, 'orgID');

	return {
		modalID,
		articleID,
		orgID
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(ArticleMenuStyleImage);
