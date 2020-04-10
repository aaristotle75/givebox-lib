import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	GBLink,
	ModalRoute,
	toggleModal
} from '../../';
import CustomCKEditor4 from '../../editor/CustomCKEditor4';
import { BlockOption } from './Block';

class Content extends Component {

  constructor(props) {
    super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.edit = this.edit.bind(this);
		this.editorInit = this.editorInit.bind(this);
		this.closeModalCallback = this.closeModalCallback.bind(this);
		this.closeModalButtons = this.closeModalButtons.bind(this);

		const defaultContent = props.defaultFormat && props.fieldValue ? props.defaultFormat.replace('{{TOKEN}}', props.fieldValue) : `<p>${props.fieldValue}</p>`;
		const content = util.getValue(this.props.info, 'content', defaultContent);

    this.state = {
			content,
			defaultContent: content,
			edit: false
    };
		this.editor = null;
		this.blockRef = null;
		this.width = null;
		this.height = null;
  }

	componentDidMount() {
		this.blockRef = this.props.blockRef.current;
		if (this.blockRef) {
			this.width = this.blockRef.clientWidth;
			this.height = this.blockRef.clientHeight;
		}
	}

  onBlur(content) {
    this.setState({ content });
		if (this.props.onBlur) this.props.onBlur(this.props.name, content);
  }

  onChange(content) {
    this.setState({ content });
    if (this.props.onChange) this.props.onChange(this.props.name, content);
  }

	edit() {
		this.props.toggleModal(this.props.modalID, true);
		this.setState({ edit: true });
	}

	closeModalCallback() {
		this.props.updateBlock(this.props.name, { content: this.state.content });
		this.setState({ edit: false });
	}

	closeModalButtons(type = 'save') {
		if (type === 'save') {
			this.closeModalCallback();
		} else {
			this.setState({ content: this.state.defaultContent, edit: false });
		}
		this.props.toggleModal(this.props.modalID, false);
	}

	remove() {
		console.log('execute remove');
	}

	editorInit(editor) {
		this.editor = editor;
		this.editor.editing.view.focus();
	}

  render() {

		const {
			modalID,
			noRemove,
			title,
			article
		} = this.props;

		const {
			edit,
			content
		} = this.state;

		const cleanHtml = util.cleanHtml(content);

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
							<CustomCKEditor4
								orgID={util.getValue(article, 'orgID', null)}
								articleID={util.getValue(article, 'articleID', null)}
								content={content}
								onBlur={this.onBlur}
								onChange={this.onChange}
								width={'100%'}
								height={`${this.height + 50}px`}
								type='classic'
								initCallback={(editor) => {
									editor.focus();
									const CKEDITOR = window.CKEDITOR;
									const selection = editor.getSelection();
									const getRanges = selection ? selection.getRanges() : [];
									if (!util.isEmpty(getRanges)) {
										const range = getRanges[0];
										const pCon = range.startContainer.getAscendant('p',true);
										const newRange = new CKEDITOR.dom.range(range.document);
										newRange.moveToPosition(pCon, CKEDITOR.POSITION_AFTER_END);
										newRange.select();
									}
								}}
								contentCss='https://givebox.s3-us-west-1.amazonaws.com/public/css/gbx3contents.css'
							/>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								<GBLink className='link' onClick={() => this.closeModalButtons('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={this.closeModalButtons}>Save</GBLink>
							</div>
						</div>
					}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeModalCallback}
					disallowBgClose={true}
				/>
				<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
      </div>
    )
  }
}

function mapStateToProps(state, props) {

	const modalID = `contentBlock-${props.name}`;

  return {
		modalID
  }
}

export default connect(mapStateToProps, {
	toggleModal
})(Content);
