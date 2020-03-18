import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	GBLink,
	Image,
	Upload,
	UploadLibrary,
	ModalRoute,
	toggleModal
} from '../../';
import Editor from '../tools/Editor';
import { handleFile } from '../tools/util';
import { BlockOption } from './Block';

class Media extends Component {

  constructor(props) {
    super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.edit = this.edit.bind(this);
		this.editorInit = this.editorInit.bind(this);
		this.handleSaveCallback = this.handleSaveCallback.bind(this);
		this.closeModalAndSave = this.closeModalAndSave.bind(this);
		this.closeModalAndCancel = this.closeModalAndCancel.bind(this);
		this.openMediaLibrary = this.openMediaLibrary.bind(this);

		this.blockRef = this.props.blockRef.current;
		if (this.blockRef) {
			this.width = this.blockRef.clientWidth;
			this.height = this.blockRef.clientHeight;
		}

		const defaultContent = `<img src="${util.imageUrlWithStyle(props.fieldValue, 'medium')}" alt="${props.name}" height="${this.height}" width="${this.width}" />`;
		const content = this.props.content || defaultContent;

    this.state = {
			content,
			defaultContent: content,
			edit: false
    };
		this.editor = null;
		this.uploadedUrl = null;
  }

	componentDidMount() {
	}

  onBlur(content) {
		console.log('execute onBlur');
    //this.setState({ content });
		//this.props.updateBlock(this.props.name, { content });
  }

  onChange(content) {
    this.setState({ content });
    if (this.props.onChange) this.props.onChange(this.props.name, content);
  }

	edit() {
		//this.props.toggleModal(this.props.modalID, true, { closeCallback: this.closeModalAndSave} );
		this.setState({ edit: true });
	}

	remove() {
		console.log('execute remove');
	}

	editorInit(editor) {
		this.editor = editor;
		this.editor.editing.view.focus();
	}

	closeModalAndSave() {
		this.props.toggleModal(this.props.modalID, false);
		this.setState({ edit: false });
	}

	closeModalAndCancel() {
		this.props.toggleModal(this.props.modalID, false);
		this.setState({ content: this.state.defaultContent, edit: false });
	}

	handleSaveCallback(url, callback = null) {
		console.log('execute', this.editor);
		this.editor.model.change( writer => {
		    const imageElement = writer.createElement( 'image', {
		        src: url
		    } );

		    // Insert the image in the current selection location.
		    this.editor.model.insertContent( imageElement, this.editor.model.document.selection );
		});
		this.props.toggleModal(this.props.modalID, false);
	}

	openMediaLibrary(editor) {
		this.props.toggleModal(this.props.modalID, true);
	}

  render() {

		const {
			editable,
			noRemove,
			article,
			modalID
		} = this.props;

		const {
			edit,
			defaultContent,
			content
		} = this.state;

		const cleanHtml = util.cleanHtml(content);
		const articleID = util.getValue(article, 'articleID', null);

		const library = {
			type: 'article',
			borderRadius: 20,
			articleID: articleID
		}

		console.log('execute', content, defaultContent, cleanHtml);
    return (
      <div className='block'>
				<BlockOption
					edit={edit}
					noRemove={noRemove}
					editOnClick={this.edit}
					removeOnClick={this.remove}
				/>
        <ModalRoute id={modalID} component={() =>
          <UploadLibrary
            image={content}
            preview={content}
            test='test'
            handleSaveCallback={this.handleSaveCallback}
            handleSave={handleFile}
            articleID={articleID}
            library={library}
            closeModalAndSave={this.closeModalAndSave}
						closeModalAndCancel={this.closeModalAndCancel}
          />}
				/>
				{edit && editable ?
	        <Editor
	          onChange={this.onChange}
	          onBlur={this.onBlur}
						content={defaultContent}
						editorInit={this.editorInit}
						width={this.width}
						height={this.height}
						config={{
							toolbar: {
								items: [
									'mediaLibrary',
									'mediaEmbed'
								]
							},
							mediaLibrary: {
								openMediaLibrary: this.openMediaLibrary
							}
						}}
	        />
				:
					<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
				}
      </div>
    )
  }
}

function mapStateToProps(state, props) {

	const modalID = `uploadLibrary-${props.name}`;

  return {
		modalID
  }
}

export default connect(mapStateToProps, {
	toggleModal
})(Media);
