import React, { Component } from 'react';
import {
	util,
	GBLink,
	ModalRoute,
	Collapse
} from '../../';
import Editor from './Editor';

export default class Text extends Component {

	constructor(props) {
		super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);

		const options = props.options;

		const defaultContent = options.defaultFormat && props.fieldValue ? options.defaultFormat.replace('{{TOKEN}}', props.fieldValue) : `<p>${props.fieldValue}</p>`;

		const content = util.getValue(props.blockContent, 'html', defaultContent);

		this.state = {
			content,
			defaultContent: content
		};
		this.editor = null;
		this.blockRef = null;
		this.width = null;
		this.height = null;
		this.displayRef = React.createRef();
	}

	componentDidMount() {
		this.blockRef = this.props.blockRef.current;
		if (this.blockRef) {
			this.width = this.blockRef.clientWidth;
			this.height = this.blockRef.clientHeight;
		}
	}

	componentDidUpdate() {
		this.props.setDisplayHeight(this.displayRef);
	}

	onBlur(content) {
		this.setState({ content });
		if (this.props.onBlur) this.props.onBlur(this.props.name, content);
	}

	onChange(content) {
		this.setState({ content });
		if (this.props.onChange) this.props.onChange(this.props.name, content);
	}

	closeEditModal(type = 'save') {
		if (type !== 'cancel') {
			this.props.saveBlock({ html: this.state.content }, null);
		} else {
			this.setState({ content: this.state.defaultContent }, this.props.closeEditModal);
		}
	}

	render() {

		const {
			modalID,
			title,
			articleID,
			orgID,
			block
		} = this.props;

		const {
			content
		} = this.state;

		const cleanHtml = util.cleanHtml(content);
		const subType = util.getValue(block, 'subType');

		return (
			<div className={`${subType === 'content' ? 'contentBlock' : 'textBlock'}`}>
				<ModalRoute
					className='gbx3'
					optsProps={{ closeCallback: this.onCloseUploadEditor }}
					id={modalID}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeEditModal}
					disallowBgClose={true}
					component={() =>
						<div className='modalWrapper'>
							<Collapse
								label={`Edit ${title}`}
								iconPrimary='edit'
							>
								<div className='formSectionContainer'>
									<div className='formSection'>
										<Editor
											orgID={orgID}
											articleID={articleID}
											content={content}
											onBlur={this.onBlur}
											onChange={this.onChange}
											subType={subType}
										/>
									</div>
								</div>
							</Collapse>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								<GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={this.closeEditModal}>Save</GBLink>
							</div>
						</div>
					}
				/>
				<div ref={this.displayRef} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
			</div>
		)
	}
}
