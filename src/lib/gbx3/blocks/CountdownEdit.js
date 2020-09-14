import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	Form,
	Collapse
} from '../../';
import { toggleModal } from '../../api/actions';
import Moment from 'moment';

class CoundownEditForm extends Component {

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = {
			tab: 'edit'
		}
	}

	onChange(name, value, field) {
		this.props.fieldProp('endsAt', { error: false });
		const enableTime = util.getValue(field, 'enableTime');
		const current = Date.now() / 1000;

		let ts = value;
		let status = null;
		if (ts > current) {
			status = 'open';
		} else {
			status = 'closed';
		}
		/*
		if (value >= content.range2) {
			ts = content.range2;
			this.props.fieldProp('range1', { error: 'Date should be less than the end date.' });
		} else {
			ts = value;
		}
		*/
		this.props.contentUpdated({
			status,
			[name]: ts,
			[`${name}Time`]: enableTime
		});
	}

	render() {

		const {
			content
		} = this.props;

		const {
			endsAt,
			endsAtTime
		} = content;

		return (
			<div className='modalWrapper'>
			<Collapse
				label={`When Does the Sweepstakes End`}
				iconPrimary='edit'
			>
				<div className='formSectionContainer'>
					<div className='formSection'>
						{this.props.calendarField('endsAt', {
							label: 'Sweepstakes End Date',
							fixedLabel: true,
							enableTime: endsAtTime,
							enableTimeOption: true,
							enableTimeOptionLabel: 'Show Time',
							onChange: this.onChange,
							value: endsAt,
							validate: 'date'
						})}
					</div>
				</div>
			</Collapse>
			</div>
		)
	}
}

class CountdownEdit extends Component {

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
				<CoundownEditForm {...this.props} />
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
})(CountdownEdit);
