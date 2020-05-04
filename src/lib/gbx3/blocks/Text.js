import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	ModalRoute,
	toggleModal,
	Collapse
} from '../../';
import CustomCKEditor4 from '../../editor/CustomCKEditor4';

class Text extends Component {

	constructor(props) {
		super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);

		const options = props.options;

		const defaultContent = options.defaultFormat && props.fieldValue ? options.defaultFormat.replace('{{TOKEN}}', props.fieldValue) : `<p>${props.fieldValue}</p>`;

		const content = util.getValue(props.blockContent, 'content', defaultContent);

		this.state = {
			content,
			defaultContent: content
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

	closeEditModal(type = 'save') {
		if (type !== 'cancel') {
			this.props.updateBlock({ content: this.state.content });
		} else {
			this.setState({ content: this.state.defaultContent }, this.props.closeEditModal);
		}
	}

	render() {

		const {
			modalID,
			title,
			articleID,
			orgID
		} = this.props;

		const {
			content
		} = this.state;

		const cleanHtml = util.cleanHtml(content);

		return (
			<div style={{ }} className={`textBlock`}>
				<ModalRoute
					className='gbx3'
					optsProps={{ closeCallback: this.onCloseUploadEditor }}
					id={modalID}
					component={() =>
						<div className='modalWrapper'>
							<Collapse
								label={`Edit ${title}`}
								iconPrimary='edit'
							>
								<div className='formSectionContainer'>
									<div className='formSection'>
										<CustomCKEditor4
											orgID={orgID}
											articleID={articleID}
											content={content}
											onBlur={this.onBlur}
											onChange={this.onChange}
											width={'100%'}
											height={`150px`}
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
									</div>
								</div>
							</Collapse>
							<div style={{ marginBottom: 0 }} className='button-group center'>
								<GBLink className='link' onClick={() => this.closeEditModal('cancel')}>Cancel</GBLink>
								<GBLink className='button' onClick={this.closeEditModal}>Save</GBLink>
							</div>
						</div>
					}
					effect='3DFlipVert' style={{ width: '60%' }}
					draggable={true}
					draggableTitle={`Editing ${title}`}
					closeCallback={this.closeEditModal}
					disallowBgClose={true}
				/>
				<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(Text);
