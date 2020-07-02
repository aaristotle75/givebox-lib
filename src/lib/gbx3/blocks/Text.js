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

		const defaultContent = options.defaultFormat && props.fieldValue ? options.defaultFormat.replace('{{TOKEN}}', props.fieldValue) : props.fieldValue ? `<p>${props.fieldValue}</p>` : `<p>${options.defaultFormat || `Please add ${props.title}`}</p>`;

		const content = util.getValue(props.blockContent, 'html', defaultContent);

		this.state = {
			hasBeenUpdated: false,
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
		this.setState({ content, hasBeenUpdated: true });
		if (this.props.onChange) this.props.onChange(this.props.name, content);
	}

	closeEditModal(type = 'save') {
		const {
			block
		} = this.props;

		const {
			content,
			hasBeenUpdated
		} = this.state;
		if (type !== 'cancel') {
			const data = {};
			const updateField = util.getValue(block, 'updateField');
			if (updateField) data[block.field] = updateField === 'string' ? util.stripHtml(content) : content;
			this.props.saveBlock({
				data,
				hasBeenUpdated,
				content: {
					html: content
				}
			});
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
			block,
			breakpoint
		} = this.props;

		const {
			content
		} = this.state;

		const cleanHtml = util.cleanHtml(content);
		const subType = util.getValue(block, 'subType');
		const nonremovable = util.getValue(block, 'nonremovable', false);

		return (
			<div className={`${subType === 'content' ? 'contentBlock' : 'textBlock'}`}>
				<ModalRoute
					className='gbx3'
					optsProps={{ closeCallback: this.onCloseUploadEditor }}
					id={modalID}
					effect='3DFlipVert' style={{ width: '70%' }}
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
											type={breakpoint === 'mobile' ? 'classic' : 'classic'}
										/>
									</div>
								</div>
							</Collapse>
						</div>
					}
					buttonGroup={
						<div className='gbx3'>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								{!nonremovable ? <GBLink className='link remove' onClick={this.props.onClickRemove}><span className='icon icon-trash-2'></span> <span className='buttonText'>Remove</span></GBLink> : <></>}
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
