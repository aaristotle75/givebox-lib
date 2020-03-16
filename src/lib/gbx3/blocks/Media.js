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

		const defaultContent = props.fieldValue;
		const content = this.props.content || defaultContent;

    this.state = {
			content,
			defaultContent: content,
			edit: false
    };
		this.editor = null;
  }

	componentDidMount() {
	}

  onBlur(content) {
    this.setState({ content });
		//this.props.updateBlock(this.props.name, { content });
  }

  onChange(content) {
    this.setState({ content });
    if (this.props.onChange) this.props.onChange(this.props.name, content);
  }

	edit() {
		this.props.toggleModal(this.props.modalID, true, { closeCallback: this.closeModalAndSave} );
		this.setState({ edit: true });
	}

	remove() {
		console.log('execute remove');
	}

	editorInit(editor) {
		this.editor = editor;
		this.editor.editing.view.focus();
	}

	handleSaveCallback(url, callback = null) {
		this.setState({ content: url });
	}

	closeModalAndSave() {
		this.props.toggleModal(this.props.modalID, false);
		this.setState({ edit: false });
	}

	closeModalAndCancel() {
		this.props.toggleModal(this.props.modalID, false);
		this.setState({ content: this.state.defaultContent, edit: false });
	}

  render() {

		const {
			editable,
			noRemove,
			defaultFormat,
			article,
			modalID
		} = this.props;

		const {
			edit,
			defaultContent,
			content
		} = this.state;


		const articleID = util.getValue(article, 'articleID', null);
    const defaultStyle = {
      borderRadius: '15%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    	, ...util.getValue(defaultFormat, 'imgStyle', {}) };

		const library = {
			type: 'article',
			borderRadius: 20,
			articleID: articleID
		}

    return (
      <div className='block'>
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
				<BlockOption
					edit={edit}
					noRemove={noRemove}
					editOnClick={this.edit}
					removeOnClick={this.remove}
				/>
				<Image imgStyle={defaultStyle} url={content} maxSize={util.getValue(defaultFormat, 'maxSize', '55px')} />
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
