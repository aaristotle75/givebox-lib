import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	ColorPicker,
	Dropdown,
	Collapse,
	MediaLibrary,
	ModalRoute,
	ModalLink,
	GBLink,
	Image
} from '../../';
import { toggleModal } from '../../api/actions';

class BackgroundsEdit extends Component {

	constructor(props) {
		super(props);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.handleSaveCallback = this.handleSaveCallback.bind(this);
		this.updateBackground = this.updateBackground.bind(this);
		this.removeImage = this.removeImage.bind(this);
		const background = props.background;
		const imageURL = util.getValue(background, 'imageURL');
		this.state = {
			imageURL,
			defaultImageURL: imageURL,
			hasBeenUpdated: false
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

	handleSaveCallback(url, justUploaded) {
		const imageURL= justUploaded ? url : util.imageUrlWithStyle(url, 'large');
		this.setState({
			imageURL,
			hasBeenUpdated: true
		}, () => this.closeEditModal('save'));
	}

	closeEditModal(type = 'save') {
		const {
			imageModalID
		} = this.props;

		const {
			imageURL,
			defaultImageURL
		} = this.state;

		if (type !== 'cancel') {
			this.updateBackground({
				imageURL
			});
		} else {
			this.setState({
				imageURL: defaultImageURL
			});
		}
		this.props.toggleModal(imageModalID, false);
	}

	updateBackground(background) {
		this.props.setBackground(background);
	}


	removeImage(closeModal) {
		const {
			imageModalID
		} = this.props;

		this.setState({ imageURL: '' }, () => {
			this.updateBackground({
				imageURL: ''
			});
		});
		if (closeModal) this.props.toggleModal(imageModalID, false);
	}

	render() {

		const {
			background,
			primaryColor,
			orgID,
			imageModalID
		} = this.props;

		const {
			imageURL
		} = this.state;

		const bgColor = util.getValue(background, 'bgColor', primaryColor);

		const extraColors = [
			primaryColor,
			bgColor
		];

		const opacity = +(util.getValue(background, 'opacity', 1) * 100);
		const blur = +util.getValue(background, 'blur', 0);

		const library = {
			saveMediaType: 'org',
			orgID,
			type: 'org',
			borderRadius: 0
		}

		return (
			<div className='modalWrapper'>
				<Collapse
					label={'Edit Page Background'}
					iconPrimary='edit'
					id={'gbx3-background-edit'}
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							<ColorPicker
								name='bgColor'
								fixedLabel={true}
								label='Page Background Color'
								onAccept={(name, value) => {
									this.updateBackground({
										bgColor: value
									});
								}}
								value={bgColor}
								modalID='backgroundsEdit-bgColor'
								opts={{
									customOverlay: {
										zIndex: 9999909
									}
								}}
								extraColors={extraColors}
							/>
							<Dropdown
								portalID={`backgroundsEdit-opacity`}
								portal={true}
								name='opacity'
								contentWidth={100}
								label={'Page Background Opacity'}
								fixedLabel={true}
								defaultValue={opacity}
								onChange={(name, value) => {
									const opacity = +(value / 100);
									this.updateBackground({
										opacity
									});
								}}
								options={util.opacityOptions()}
							/>
							<Dropdown
								portalID={`backgroundsEdit-blur`}
								portal={true}
								name='backgroundBlur'
								contentWidth={100}
								label={'Page Background Blur'}
								selectLabel='Select'
								fixedLabel={true}
								defaultValue={blur}
								onChange={(name, value) => {
									this.updateBackground({
										blur: +value
									});
								}}
								options={util.blurOptions()}
							/>
							<div className='input-group'>
								<div className='label'>Page Background Image</div>
								<ModalLink id={imageModalID}>
									{ imageURL ?
										<Image url={imageURL} size={'small'} maxSize={80} alt='Page Background Image' />
									: 'Upload Page Background Image' }
								</ModalLink>
								{ imageURL ? <GBLink onClick={this.removeImage} style={{ display: 'block', marginLeft: 5, fontSize: 12 }}>Remove Image</GBLink> : '' }
							</div>
							<ModalRoute
								className='gbx3'
								optsProps={{ closeCallback: this.onCloseUploadEditor, customOverlay: { zIndex: 10000000 } }}
								id={imageModalID}
								effect='3DFlipVert' style={{ width: '60%' }}
								draggable={true}
								draggableTitle={`Editing Page Background Panel Image`}
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
														modalID={imageModalID}
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
											<GBLink className='link remove' onClick={() => this.removeImage(true)}><span className='icon icon-trash-2'></span> <span className='buttonText'>Remove</span></GBLink>
											<GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
											<GBLink className='button' onClick={() => this.closeEditModal('save')}>Save</GBLink>
										</div>
									</div>
								}
							/>
						</div>
					</div>
				</Collapse>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const orgID = util.getValue(state, 'gbx3.info.orgID');
	const imageModalID = 'backgroundPanelImage';

	return {
		orgID,
		imageModalID
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(BackgroundsEdit);
