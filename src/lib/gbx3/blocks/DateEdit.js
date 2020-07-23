import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	Form,
	Collapse
} from '../../';
import { toggleModal } from '../../api/actions';

class DateForm extends Component {

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onChangeLabel = this.onChangeLabel.bind(this);
		this.state = {
		}
	}

	onChange(name, value, field) {
		const {
			content
		} = this.props;

		const enableTime = util.getValue(field, 'enableTime');
		let ts = value;
		if (name === 'range1') {
			ts = value >= content.range2 ? content.range2 - 1 : value;
		}

		if (name === 'range2') {
			ts = value <= content.range1 ? content.range1 + 1 : value;
		}

		this.props.contentUpdated({
			[name]: ts,
			[`${name}Time`]: enableTime
		});
	}

	onChangeLabel(name, value) {
		this.props.contentUpdated({
			[name]: value
		});
	}

	render() {

		const {
			content,
			options,
			title
		} = this.props;

		const hasRange = util.getValue(options, 'range');

		return (
			<div className='modalWrapper'>
				<Collapse
					label={`Edit ${title}`}
					iconPrimary='edit'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							{ hasRange ?
								this.props.calendarRange('event range', {
									rangeRequired: false,
									enableTimeOption: util.getValue(options, 'enableTimeOption'),
									enableTimeOptionLabel: 'Show Date & Time',
									range1Name: 'range1',
									range1Label: util.getValue(options, 'range1Label'),
									range1EnableTime: util.getValue(content, 'range1Time'),
									range1Value: util.getValue(content, 'range1'),
									range1OnChange: this.onChange,
									range2Label: util.getValue(options, 'range2Label'),
									range2Name: 'range2',
									range2EnableTime: util.getValue(content, 'range2Time'),
									range2Value: util.getValue(content, 'range2'),
									range2OnChange: this.onChange,
								})
							:
								this.props.calendarField('range1', {
									label: util.getValue(options, 'range1Label'),
									fixedLabel: true,
									enableTime: util.getValue(content, 'range1Time'),
									enableTimeOption: util.getValue(options, 'enableTimeOption'),
									enableTimeOptionLabel: 'Show Date & Time',
									onChange: this.onChange
								})
							}
							<div className='col' style={{ width: hasRange ? '50%' : '100%' }}>
								{this.props.textField('range1Label', {
									value: util.getValue(content, 'range1Label'),
									label: `${util.getValue(options, 'range1Label')} Label`,
									fixedLabel: true,
									placeholder: 'Enter Label',
									onChange: this.onChangeLabel
								})}
							</div>
							{ hasRange ?
								<div className='col' style={{ width: '50%' }}>
									{this.props.textField('range2Label', {
										value: util.getValue(content, 'range2Label'),
										label: `${util.getValue(options, 'range2Label')} Label`,
										fixedLabel: true,
										placeholder: 'Enter Label',
										onChange: this.onChangeLabel
									})}
								</div>
							: <></> }
						</div>
					</div>
				</Collapse>
			</div>
		)
	}
}

class DateEdit extends Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {

		const {
			modalID
		} = this.props;

		return (
			<Form id={`${modalID}-form`}>
				<DateForm {...this.props} />
			</Form>
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
})(DateEdit);
