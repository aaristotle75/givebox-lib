import React, { Component } from 'react';
import {
  util,
	GBLink
} from '../../';
import Editor from '../tools/Editor';
import { BlockOption } from './Block';

export default class Text extends Component {

  constructor(props) {
    super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.edit = this.edit.bind(this);
		this.editorInit = this.editorInit.bind(this);

		const defaultContent = props.defaultFormat && props.fieldValue ? props.defaultFormat.replace('{{TOKEN}}', props.fieldValue) : `<p>${props.fieldValue}</p>`;
		const content = this.props.content || defaultContent;

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
		console.log('execute onBlur');
    this.setState({ content });
		this.props.updateBlock(this.props.name, { content });
  }

  onChange(content) {
    this.setState({ content });
    if (this.props.onChange) this.props.onChange(this.props.name, content);
  }

	edit() {
		this.setState({ edit: true });
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
			editable,
			noRemove
		} = this.props;

		const {
			edit,
			defaultContent,
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
									'heading',
									'fontSize',
									'fontColor',
									'alignment',
									'|',
									'bold',
									'italic',
									'underline',
									'|',
									'undo',
									'redo'
								]
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
