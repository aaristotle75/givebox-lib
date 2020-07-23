import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	ModalRoute
} from '../../';
import DateEdit from './DateEdit';
import { toggleModal } from '../../api/actions';

class Date extends Component {

	constructor(props) {
		super(props);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.closeEditModal = this.closeEditModal.bind(this);
		this.optionsUpdated = this.optionsUpdated.bind(this);
		this.contentUpdated = this.contentUpdated.bind(this);

		const data = props.data;
		const options = props.options;
		const content = {
			...util.getValue(props.block, 'content', {}),
			range1: util.getValue(data, util.getValue(options, 'range1DataField')),
			range2: util.getValue(data, util.getValue(options, 'range2DataField')),
			range1Time: util.getValue(data, util.getValue(options, 'range1TimeDataField')),
			range2Time: util.getValue(data, util.getValue(options, 'range2TimeDataField'))
		}

		this.state = {
			content,
			defaultContent: util.deepClone(content),
			options,
			hasBeenUpdated: false
		};
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

	onBlur(date) {
		this.setState({ date });
		if (this.props.onBlur) this.props.onBlur(this.props.name, date);
	}

	onChange(date) {
		this.setState({ date, hasBeenUpdated: true });
		if (this.props.onChange) this.props.onChange(this.props.name, date);
	}

	closeEditModal(type = 'save') {
		const {
			block
		} = this.props;

		const {
			content,
			defaultContent,
			options,
			hasBeenUpdated
		} = this.state;

		if (type !== 'cancel') {
			const data = {
				[options.range1DataField]: content.range1,
				[options.range2DataField]: content.range2,
				[options.range1TimeDataField]: content.range1Time,
				[options.range2TimeDataField]: content.range2Time
			};
			const updateOptions = util.getValue(block, 'updateOptions');

			this.props.saveBlock({
				data,
				hasBeenUpdated,
				content,
				options: {
				}
			});
		} else {
			this.setState({
				content: defaultContent
			}, this.props.closeEditModal);
		}
	}

	optionsUpdated(options) {
		this.setState({
			options: {
				...this.state.options,
				...options
			},
			hasBeenUpdated: true
		});
	}

	contentUpdated(content) {
		this.setState({
			content: {
				...this.state.content,
				...content
			},
			hasBeenUpdated: true
		});
	}

	setTab(tab) {
		this.setState({ tab });
	}

	render() {

		const {
			name,
			modalID,
			title,
			block,
			primaryColor
		} = this.props;

		const {
			content,
			options
		} = this.state;

		const nonremovable = util.getValue(block, 'nonremovable', false);

		return (
			<div className={`dateBlock`}>
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
						<DateEdit
							{...this.props}
							content={content}
							options={options}
							contentUpdated={this.contentUpdated}
							optionsUpdated={this.optionsUpdated}
						/>
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
				<div className='eventDate'>
					EVENT DATE
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const primaryColor = util.getValue(state, 'gbx3.globals.gbxStyle.primaryColor');

	return {
		primaryColor
	}
}

export default connect(mapStateToProps, {
	toggleModal
})(Date);
