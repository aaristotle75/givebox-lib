import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	GBLink,
	Image,
	MediaLibrary,
	ModalRoute,
	toggleModal,
	Collapse
} from '../../';
import { BlockOption } from './Block';

class Media extends Component {

  constructor(props) {
    super(props);
		this.edit = this.edit.bind(this);
		this.handleSaveCallback = this.handleSaveCallback.bind(this);
		this.closeModalAndSave = this.closeModalAndSave.bind(this);
		this.closeModalAndCancel = this.closeModalAndCancel.bind(this);
		this.closeModalCallback = this.closeModalCallback.bind(this);
		this.handleBorderRadius = this.handleBorderRadius.bind(this);
		this.setRadius = this.setRadius.bind(this);
		this.blockRef = this.props.blockRef.current;
		if (this.blockRef) {
			this.maxWidth = this.blockRef.clientWidth;
			this.maxHeight = this.blockRef.clientHeight;
		}

		const size = util.getValue(props.options, 'size', 'large');
		const borderRadius = util.getValue(props.options, 'borderRadius', 5);
		const defaultContent = util.imageUrlWithStyle(props.fieldValue, size);
		const content = util.getValue(this.props.info, 'content', defaultContent);

    this.state = {
			content,
			borderRadius,
			defaultContent: content,
			edit: false,
			maxWidth: this.maxWidth || 550,
			maxHeight: this.maxHeight || 550
    };
  }

	componentDidMount() {
	}

	componentWillUnmount() {
		//console.log('execute componentWillUnmount');
	}

	edit() {
		this.props.toggleModal(this.props.modalID, true);
		this.setState({ edit: true });
	}

	remove() {
		console.log('execute remove');
	}

	closeModalAndSave() {
		this.timeout = setTimeout(() => {
			this.setState({ loading: false, edit: false }, () => {
				this.props.updateBlock(
					this.props.name,
					{
						content: this.state.content
					},
					{
						borderRadius: this.state.borderRadius
					}
				);
				this.props.toggleModal(this.props.modalID, false);
			});
		}, 0);
	}

	closeModalAndCancel() {
		this.setState({ content: this.state.defaultContent, borderRadius: this.state.borderRadius, edit: false }, () => {
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
		this.setState({ loading: true, content: util.imageUrlWithStyle(url, size) }, () => this.closeModalAndSave());
	}

  handleBorderRadius(e) {
    const borderRadius = parseInt(e.target.value)
    this.setState({ borderRadius })
  }

	setRadius(borderRadius) {
    this.setState({ borderRadius })
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
			borderRadius
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
							<Collapse
								label={'Media Library'}
								iconPrimary='image'
								id={'gbx3-mediaLibrary'}
							>
								<div className='formSectionContainer'>
									<div className='formSection'>
								    <MediaLibrary
											modalID={modalID}
											image={content}
											preview={content}
								      handleSaveCallback={this.handleSaveCallback}
								      handleSave={util.handleFile}
								      library={library}
								      closeModalAndSave={this.closeModalAndSave}
								      closeModalAndCancel={this.closeModalAndCancel}
											showBtns={'hide'}
											saveLabel={'close'}
								    />
									</div>
								</div>
							</Collapse>
							<Collapse
								label={'Image Properties'}
								iconPrimary='settings'
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
							<div style={{ margin: 0 }} className='button-group center'>
								<GBLink className='link' onClick={this.closeModalAndCancel}>Cancel</GBLink>
								<GBLink className='button' onClick={this.closeModalAndSave}>Save</GBLink>
							</div>
						</div>
					}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeModalCallback}
					disallowBgClose={true}
				/>
				<Image imgStyle={{ borderRadius: `${borderRadius}%` }} url={content} size={util.getValue(options, 'size', 'large')} minHeight={0} maxWidth={maxWidth} maxHeight={maxHeight} alt={`${util.getValue(article, 'title')}`} />
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
