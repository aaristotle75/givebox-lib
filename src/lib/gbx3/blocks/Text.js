import React, { Component } from 'react';
import {
  util,
	GBLink,
	Popup
} from '../../';
import CustomCKEditor4 from '../../editor/CustomCKEditor4';
import Editor from '../tools/Editor';
import { BlockOption } from './Block';

export default class Text extends Component {

  constructor(props) {
    super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.edit = this.edit.bind(this);
		this.editorInit = this.editorInit.bind(this);
		this.buttonClick = this.buttonClick.bind(this);

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
		// this.props.updateBlock(this.props.name, { content });
  }

  onChange(content) {
    this.setState({ content });
    if (this.props.onChange) this.props.onChange(this.props.name, content);
  }

	edit(type, open = true) {
		this.setState({ edit: open });
	}

	buttonClick(type, open) {
		console.log('execute buttonClick', type, open);
		this.setState({ edit: false });
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
			noRemove,
			title
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
				<Popup
					title={`Editing ${title}`}
					buttonCallback={this.buttonClick}
					open={edit && editable ? true : false}
					showButtons='ok'
					style={{
						width: `${this.width + 100}px`,
						height: `${this.height + 200}px`,
						padding: '40px 20px'
					}}
				>
					<CustomCKEditor4
						orgID={185}
						articleID={587}
						content={content}
						onBlur={this.onBlur}
						onChange={this.onChange}
						width={'100%'}
						height={`${this.height + 50}px`}
						type='classic'
						toolbar={[
							[ 'Bold', 'Italic', '-', 'Font', '-', 'FontSize', 'TextColor', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight']
						]}
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
				</Popup>
				<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
      </div>
    )
  }
}
