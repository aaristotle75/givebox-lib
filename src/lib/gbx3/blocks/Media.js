import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	GBLink,
	Image,
	MediaLibrary,
	ModalRoute,
	toggleModal,
	Collapse,
	Tabs,
	Tab,
	TextField,
	Choice,
	_v,
	Video
} from '../../';
import { BlockOption } from './Block';
import AnimateHeight from 'react-animate-height';

class Media extends Component {

  constructor(props) {
    super(props);
		this.edit = this.edit.bind(this);
		this.handleSaveCallback = this.handleSaveCallback.bind(this);
		this.closeModalAndSave = this.closeModalAndSave.bind(this);
		this.closeModalAndCancel = this.closeModalAndCancel.bind(this);
		this.closeModalCallback = this.closeModalCallback.bind(this);
		this.handleBorderRadius = this.handleBorderRadius.bind(this);
		this.onChangeVideo = this.onChangeVideo.bind(this);
		this.videoOnReady = this.videoOnReady.bind(this);
		this.renderVideo = this.renderVideo.bind(this);
		this.setRadius = this.setRadius.bind(this);
		this.setStep = this.setStep.bind(this);
		this.blockRef = this.props.blockRef.current;
		if (this.blockRef) {
			this.maxWidth = this.blockRef.clientWidth;
			this.maxHeight = this.blockRef.clientHeight;
		}

		const size = util.getValue(props.options, 'size', 'large');
		const borderRadius = util.getValue(props.options, 'borderRadius', 5);
		const mediaType = util.getValue(props.options, 'mediaType', 'image');
		const defaultContent = mediaType === 'image' ? util.imageUrlWithStyle(props.fieldValue, size) : {};
		const content = util.getValue(this.props.info, mediaType, defaultContent);

    this.state = {
			content,
			borderRadius,
			mediaType,
			defaultMediaType: mediaType,
			defaultContent: content,
			edit: false,
			maxWidth: this.maxWidth || 550,
			maxHeight: this.maxHeight || 550,
			video: {
				URL: util.getValue(content, 'URL', null),
				auto: util.getValue(content, 'auto', true),
				error: false,
				validatedURL: util.getValue(content, 'validatedURL', null)
			}
    };
  }

	componentDidMount() {
	}

	componentWillUnmount() {
		//console.log('execute componentWillUnmount');
	}

	setStep(step) {
		this.setState({ step });
	}

	edit() {
		this.props.toggleModal(this.props.modalID, true);
		this.setState({ edit: true });
	}

	remove() {
		console.log('execute remove');
	}

	closeModalAndSave() {
		const {
			content,
			borderRadius,
			mediaType
		} = this.state;

		this.timeout = setTimeout(() => {
			this.setState({ loading: false, edit: false }, () => {
				this.props.updateBlock(
					this.props.name,
					{
						[mediaType]: content
					},
					{
						borderRadius,
						mediaType
					}
				);
				this.props.toggleModal(this.props.modalID, false);
			});
		}, 0);
	}

	closeModalAndCancel() {

		const {
			defaultMediaType,
			defaultContent,
			borderRadius
		} = this.state;

		this.setState({
			mediaType: defaultMediaType,
			content: defaultContent,
			borderRadius,
			video: {
				URL: util.getValue(defaultContent, 'URL', null),
				validatedURL: util.getValue(defaultContent, 'validatedURL', null),
				auto: util.getValue(defaultContent, 'auto', true),
				error: false
			},
			edit: false
		}, () => {
			this.props.toggleModal(this.props.modalID, false);
		});
	}

	closeModalCallback(type) {
		this.setState({ loading: true });
		if (type === 'ok') {
			this.closeModalAndSave();
		} else {
			this.closeModalAndCancel();
		}
	}

	handleSaveCallback(url) {
		const size = util.getValue(this.props.options, 'size', 'large');
		this.setState({
			loading: true,
			mediaType: 'image',
			content: util.imageUrlWithStyle(url, size)
		}, () => this.closeModalCallback('ok'));
	}

  handleBorderRadius(e) {
    const borderRadius = parseInt(e.target.value)
    this.setState({ borderRadius })
  }

	setRadius(borderRadius) {
    this.setState({ borderRadius })
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
		this.setState({ mediaType: 'video', content: this.state.video });
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
			noRemove,
			article,
			modalID,
			options,
			maxRadius,
			minRadius
		} = this.props;

		const {
			edit,
			content,
			maxWidth,
			maxHeight,
			borderRadius,
			video,
			mediaType
		} = this.state;

		const articleID = util.getValue(article, 'articleID', null);
		const orgID = util.getValue(article, 'orgID', null);

		const library = {
			articleID,
			orgID,
			type: 'article',
			borderRadius: 0
		}

    return (
      <div className='block'>
				<BlockOption
					edit={edit}
					noRemove={noRemove}
					editOnClick={this.edit}
					removeOnClick={this.remove}
				/>
        <ModalRoute
					className='gbx3'
					optsProps={{ closeCallback: this.onCloseUploadEditor, customOverlay: { zIndex: 10000000 } }}
					id={modalID}
					component={() =>
						<div className='modalWrapper'>
							<Tabs
								default={mediaType}
								className='statsTab'
							>
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
													image={mediaType === 'image' ? content : null}
													preview={mediaType === 'image' ? content : null}
										      handleSaveCallback={this.handleSaveCallback}
										      handleSave={util.handleFile}
										      library={library}
										      closeModalAndCancel={this.closeModalCallback}
										      closeModalAndSave={() => this.closeModalCallback('ok')}
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
								              value={borderRadius}
								            />
								            <GBLink onClick={() => this.setRadius(maxRadius)}><span className='icon icon-circle'></span></GBLink>
								          </div>
												</div>
											</div>
										</div>
									</Collapse>
								</Tab>
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
													placeholder='Enter Embed Vidoe URL'
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
															{this.renderVideo(true)}
														</div>
													</div>
												</AnimateHeight>
											</div>
										</div>
									</Collapse>
								</Tab>
							</Tabs>
							<div style={{ margin: 0 }} className='button-group center'>
								<GBLink className='link' onClick={this.closeModalCallback}>Cancel</GBLink>
								<GBLink className='button' onClick={() => this.closeModalCallback('ok')}>Save</GBLink>
							</div>
						</div>
					}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeModalCallback}
					disallowBgClose={true}
				/>
				{ mediaType === 'image' ?
					<Image imgStyle={{ borderRadius: `${borderRadius}%` }} url={content} size={util.getValue(options, 'size', 'large')} minHeight={0} maxWidth={maxWidth} maxHeight={maxHeight} alt={`${util.getValue(article, 'title')}`} />
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

function mapStateToProps(state, props) {

	const modalID = `mediaBlock-${props.name}`;

  return {
		modalID
  }
}

export default connect(mapStateToProps, {
	toggleModal
})(Media);
