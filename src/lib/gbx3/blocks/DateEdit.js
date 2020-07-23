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
		this.state = {
		}
	}

	onChange(name, date) {
		console.log('execute onChange', name, date);
		if (this.props.onChange) this.props.onChange(name, date);
	}

	render() {

		const {
			date,
			options,
			title
		} = this.props;

		console.log('execute date options', date, options);

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
									range1Name: util.getValue(options, 'range1Name'),
									range1Label: 'Event Start Date',
									range1EnableTime: util.getValue(options, 'range1Time'),
									range1Value: util.getValue(date, 'range1'),
									range1OnChange: this.onChange,
									range2Label: 'Event End Date',
									range2Name: util.getValue(options, 'range2Name'),
									range2EnableTime: util.getValue(options, 'range2Time'),
									range2Value: util.getValue(date, 'range2'),
									range2OnChange: this.onChange,
								})
							:
								this.props.calendarField('range1', {
									label: util.getValue(options, 'range1Label'),
									fixedLabel: true,
									enableTime: util.getValue(options, 'range1Time'),
									enableTimeOption: util.getValue(options, 'enableTimeOption'),
									enableTimeOptionLabel: 'Show Date & Time',
									onChange: this.onChange
								})
							}
							<div className='col' style={{ width: hasRange ? '50%' : '100%' }}>
								{this.props.textField('range1Label', {
									value: util.getValue(date, 'range1Label'),
									label: `${util.getValue(options, 'range1Label')} Label`,
									fixedLabel: true,
									placeholder: 'Enter Label'
								})}
							</div>
							{ hasRange ?
								<div className='col' style={{ width: '50%' }}>
									{this.props.textField('range2Label', {
										value: util.getValue(date, 'range2Label'),
										label: `${util.getValue(options, 'range2Label')} Label`,
										fixedLabel: true,
										placeholder: 'Enter Label'
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
