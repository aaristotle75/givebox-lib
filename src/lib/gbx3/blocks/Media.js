import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	GBLink,
	Image,
	MediaLibrary,
	ModalRoute,
	toggleModal,
	Popup
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
		this.blockRef = this.props.blockRef.current;
		if (this.blockRef) {
			this.maxWidth = this.blockRef.clientWidth;
			this.maxHeight = this.blockRef.clientHeight;
		}

		const size = util.getValue(props.defaultFormat, 'size', 'large');
		const defaultContent = util.imageUrlWithStyle(props.fieldValue, size);
		const content = util.getValue(this.props.info, 'content', defaultContent);

    this.state = {
			content,
			defaultContent: content,
			edit: false,
			maxWidth: this.maxWidth || 550,
			maxHeight: this.maxHeight || 550
    };
  }

	componentDidMount() {
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
				this.props.updateBlock(this.props.name, { content: this.state.content });
				this.props.toggleModal(this.props.modalID, false);
			});
		}, 0);
	}

	closeModalAndCancel() {
		this.props.toggleModal(this.props.modalID, false);
		this.setState({ content: this.state.defaultContent, edit: false });
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
		const size = util.getValue(this.props.defaultFormat, 'size', 'large');
		this.setState({ loading: true, content: util.imageUrlWithStyle(url, size) }, () => this.closeModalAndSave());
	}

  render() {

		const {
			title,
			noRemove,
			article,
			modalID,
			defaultFormat
		} = this.props;

		const {
			edit,
			content,
			maxWidth,
			maxHeight
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
					optsProps={{ closeCallback: this.onCloseUploadEditor, customOverlay: { zIndex: 10000000 } }}
					id={modalID}
					component={() =>
						<div className='modalWrapper'>
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
							<div style={{ margin: 0 }} className='button-group center'>
								<GBLink className='button' onClick={this.closeModalAndSave}>Close</GBLink>
							</div>
						</div>
					}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeModalCallback}
					disallowBgClose={true}
				/>
				<Image url={content} size={util.getValue(defaultFormat, 'size', 'large')} minHeight={0} maxWidth={maxWidth} maxHeight={maxHeight} alt={`${util.getValue(article, 'title')}`} />
      </div>
    )
  }
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
