import React, { Component } from 'react';
import {
	util,
	GBLink,
	Image,
	MediaLibrary,
	ModalRoute,
	Collapse,
	Tabs,
	Tab,
	TextField,
	Choice,
	_v,
	Video
} from '../../';
import AnimateHeight from 'react-animate-height';
import has from 'has';

export default class Media extends Component {

	constructor(props) {
		super(props);
		this.handleSaveCallback = this.handleSaveCallback.bind(this);
		this.closeModalAndSave = this.closeModalAndSave.bind(this);
		this.closeModalAndCancel = this.closeModalAndCancel.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.handleBorderRadius = this.handleBorderRadius.bind(this);
		this.updateImage = this.updateImage.bind(this);
		this.onChangeVideo = this.onChangeVideo.bind(this);
		this.videoOnReady = this.videoOnReady.bind(this);
		this.renderVideo = this.renderVideo.bind(this);
		this.setRadius = this.setRadius.bind(this);
		this.blockRef = this.props.blockRef.current;
		if (this.blockRef) {
			this.maxWidth = this.blockRef.clientWidth;
			this.maxHeight = this.blockRef.clientHeight;
		}

		const {
			options,
			blockContent
		} = props;

		const mediaType = util.getValue(options, 'mediaType', 'image');
		const imageDefault = util.getValue(options, 'image', {});
		const videoDefault = util.getValue(options, 'video', {});

		const image = {
			...imageDefault,
			...util.getValue(blockContent, 'image', {})
		};

		const video = {
			...videoDefault,
			...util.getValue(blockContent, 'video', {})
		};

		if (!has(image, 'URL')) image.URL = props.fieldValue;

		this.state = {
			mediaType,
			image,
			video,
			defaultImage: util.deepClone(image),
			defaultVideo: util.deepClone(video),
			defaultMediaType: mediaType,
			maxWidth: this.maxWidth || 550,
			maxHeight: this.maxHeight || 550
		};
	}

	componentDidMount() {
	}

	componentWillUnmount() {
		//console.log('execute componentWillUnmount');
	}

	closeModalAndSave() {
		const {
			image,
			video,
			mediaType
		} = this.state;

		if (mediaType === 'video' && !video.validatedURL) {
			this.closeModalAndCancel();
		} else {
			this.timeout = setTimeout(() => {
				this.setState({ loading: false, edit: false }, () => {
					this.props.saveBlock(
						{
							image,
							video
						},
						{
							mediaType
						}
					);
				});
			}, 0);
		}
	}

	closeModalAndCancel() {
		const {
			defaultMediaType,
			defaultImage,
			defaultVideo
		} = this.state;

		this.setState({
			mediaType: defaultMediaType,
			image: util.deepClone(defaultImage),
			video: util.deepClone(defaultVideo)
		}, this.props.closeEditModal);
	}

	closeEditModal(type = 'save') {
		this.setState({ loading: true });
		if (type !== 'cancel') {
			this.closeModalAndSave();
		} else {
			this.closeModalAndCancel();
		}
	}

	handleSaveCallback(url) {
		const image = this.state.image;
		image.URL = util.imageUrlWithStyle(url, image.size);
		this.setState({
			image,
			mediaType: 'image',
			loading: true
		}, () => this.closeEditModal('save'));
	}

	updateImage(key, value) {
		const image = this.state.image;
		image[key] = value;
		this.setState({ image });
	}

	handleBorderRadius(e) {
		this.updateImage('borderRadius', +e.target.value);
	}

	setRadius(borderRadius) {
		this.updateImage('borderRadius', borderRadius);
	}

	onChangeVideo(e) {
		const URL = e.currentTarget.value;
		const video = this.state.video;
		video.validatedURL = _v.validateURL(URL) ? URL : video.validatedURL;
		video.URL = URL;
		if (video.error) video.error = false;
		this.setState({ video });
	}

	videoOnReady() {
		//console.log('execute videoOnReady');
		//this.setState({ content: this.state.video });
	}

	renderVideo(preview = false) {
		const {
			video,
			maxWidth,
			maxHeight
		} = this.state;

		return (
			<Video
				playing={util.getValue(video, 'auto', false)}
				url={util.getValue(video, 'validatedURL')}
				onReady={this.videoOnReady}
				style={{
					maxWidth,
					maxHeight
				}}
				preview={preview}
			/>
		)
	}

	render() {

		const {
			title,
			orgID,
			articleID,
			modalID,
			maxRadius,
			minRadius
		} = this.props;

		const {
			maxWidth,
			maxHeight,
			image,
			video,
			mediaType
		} = this.state;

		const library = {
			articleID,
			orgID,
			type: 'article',
			borderRadius: 0
		}

		return (
			<div className='mediaBlock'>
				<ModalRoute
					className='gbx3'
					optsProps={{ closeCallback: this.onCloseUploadEditor, customOverlay: { zIndex: 10000000 } }}
					id={modalID}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeEditModal}
					disallowBgClose={true}
					component={() =>
						<div className='modalWrapper'>
							<Tabs
								default={mediaType}
								className='statsTab'
								callbackAfter={(tab) => {
									this.setState({ mediaType: tab });
								}}
							>
								{!util.isEmpty(image) ?
								<Tab
									id='image'
									label={<span className='stepLabel'>Image</span>}
								>
									<Collapse
										label={'Image'}
										iconPrimary='image'
										id={'gbx3-mediaLibrary'}
									>
										<div className='formSectionContainer'>
											<div className='formSection'>
												<MediaLibrary
													modalID={modalID}
													image={mediaType === 'image' ? util.getValue(image, 'URL') : null}
													preview={mediaType === 'image' ? util.getValue(image, 'URL') : null}
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
									<Collapse
										label={'Image Options'}
										iconPrimary='sliders'
										id={'gbx3-imageProperties'}
									>
										<div className='formSectionContainer'>
											<div className='formSection'>
												<div className='input-group'>
													<label className='label'>Image Roundness</label>
													<div className='scale'>
														<GBLink onClick={() => this.setRadius(minRadius)}><span className='icon icon-square'></span></GBLink>
														<input
															name="borderRadius"
															type="range"
															onChange={this.handleBorderRadius}
															min={minRadius}
															max={maxRadius}
															step="0"
															value={util.getValue(image, 'borderRadius')}
														/>
														<GBLink onClick={() => this.setRadius(maxRadius)}><span className='icon icon-circle'></span></GBLink>
													</div>
												</div>
											</div>
										</div>
									</Collapse>
								</Tab> : <></> }
								{ !util.isEmpty(video) ?
								<Tab
									id='video'
									label={<span className='stepLabel'>Video</span>}
								>
									<Collapse
										label={'Video'}
										iconPrimary='video'
										id={'gbx3-embedvideo'}
									>
										<div className='formSectionContainer'>
											<div className='formSection'>
												<TextField
													name='video'
													label='Embed Video URL'
													fixedLabel={true}
													placeholder='Enter Embed Video URL'
													onChange={this.onChangeVideo}
													value={util.getValue(video, 'URL')}
												/>
												<Choice
													name='auto'
													label='Play Video Automatically to Users'
													checked={util.getValue(video, 'auto', false)}
													onChange={() => {
														const video = this.state.video;
														video.auto = video.auto ? false : true;
														this.setState({ video });
													}}
												/>
												{util.getValue(video, 'validatedURL') ?
												<div className='fieldContext'>
													<span className='smallText flexStart centerItems'><span style={{ fontWeight: 300 }}>Video will not auto-play in preview.</span></span>
												</div> : <></>}
												<AnimateHeight
													duration={200}
													height={util.getValue(video, 'validatedURL') ? 'auto' : 0}
												>
													<div className='input-group'>
														<label className='label'>Video Preview</label>
														<div style={{ marginTop: 10 }} className='flexCenter'>
															{mediaType === 'video' ? this.renderVideo(true) : <></>}
														</div>
													</div>
												</AnimateHeight>
											</div>
										</div>
									</Collapse>
								</Tab> : <></> }
							</Tabs>
							<div style={{ margin: 0 }} className='button-group center'>
								<GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={() => this.closeEditModal('save')}>Save</GBLink>
							</div>
						</div>
					}
				/>
				{ mediaType === 'image' ?
					<Image imgStyle={{ borderRadius: `${util.getValue(image, 'borderRadius')}%` }} url={util.getValue(image, 'URL')} size={util.getValue(image, 'size')} minHeight={0} maxWidth={maxWidth} maxHeight={maxHeight} alt={title} />
				:
					this.renderVideo()
				}
			</div>
		)
	}
}

Media.defaultProps = {
	minRadius: 0,
	maxRadius: 50
}
