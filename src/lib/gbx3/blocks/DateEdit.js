import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	Form,
	Collapse,
	Dropdown
} from '../../';
import { toggleModal } from '../../api/actions';
import Editor from './Editor';
import Moment from 'moment';

class DateForm extends Component {

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onChangeLabel = this.onChangeLabel.bind(this);
		this.onChangeHTML = this.onChangeHTML.bind(this);
		this.onBlurHTML = this.onBlurHTML.bind(this);
		this.state = {
			tab: 'edit'
		}
	}

	onChange(name, value, field) {
		const {
			content
		} = this.props;

		this.props.fieldProp('range1', { error: false });
		this.props.fieldProp('range2', { error: false });

		const enableTime = util.getValue(field, 'enableTime');
		let ts = value;
		if (name === 'range1') {
			if (value >= content.range2) {
				ts = content.range2;
				this.props.fieldProp('range1', { error: 'Date should be less than the end date.' });
			} else {
				ts = value;
			}
		}

		if (name === 'range2') {
			if (value <= content.range1) {
				ts = content.range1;
				this.props.fieldProp('range2', { error: 'Date should be greater than the start date.' });
			} else {
				ts = value;
			}
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

	onChangeHTML(html) {
		this.props.contentUpdated({
			htmlTemplate: html
		});
	}

	onBlurHTML(html) {
		this.props.contentUpdated({
			htmlTemplate: html
		});
	}

	formatOptions() {
		const {
			content
		} = this.props;

		const value = util.getValue(content, 'range1', Moment.unix());
		const time = util.getValue(content, `range1Time`);
		const timeFormat = 'h:mmA';
		const formatA = 'MMMM Do, YYYY';
		const formatB = 'MMM. Do, YYYY';
		const formatC = 'M/DD/YYYY';

		const options = [
			{ primaryText: util.getDate(value, `${formatA}${time ? `  ${timeFormat}` : ''}`), value: formatA },
			{ primaryText: util.getDate(value, `${formatB}${time ? `  ${timeFormat}` : ''}`), value: formatB },
			{ primaryText: util.getDate(value, `${formatC}${time ? `  ${timeFormat}` : ''}`), value: formatC },
		];

		return options;

	}

	render() {

		const {
			content,
			options,
			html,
			htmlEditable,
			articleID,
			orgID
		} = this.props;

		const {
			range1,
			range1Time,
			range2,
			range2Time,
			dateFormat
		} = content;

		const {
			enableTimeOption,
			range1Label,
			range2Label,
			range1Token,
			range2Token
		} = options;

		const hasRange = util.getValue(options, 'range');

		return (
			<div className='modalWrapper'>
			<Collapse
				label={`Set Date & Time`}
				iconPrimary='edit'
			>
				<div className='formSectionContainer'>
					<div className='formSection'>
						{ hasRange ?
							this.props.calendarRange('event range', {
								rangeRequired: false,
								enableTimeOption,
								enableTimeOptionLabel: 'Show Time',
								range1Name: 'range1',
								range1Label,
								range1EnableTime: range1Time,
								range1Value: range1,
								range1OnChange: this.onChange,
								range2Label,
								range2Name: 'range2',
								range2EnableTime: range2Time,
								range2Value: range2,
								range2OnChange: this.onChange,
							})
						:
							this.props.calendarField('range1', {
								label: util.getValue(options, 'range1Label'),
								fixedLabel: true,
								enableTime: range1Time,
								enableTimeOption,
								enableTimeOptionLabel: 'Show Time',
								onChange: this.onChange,
								value: range1
							})
						}
						<div style={{ marginTop: 10 }} className='helperText'>
							<div className='line label'>Style Editor</div>
							<Editor
								orgID={orgID}
								articleID={articleID}
								content={htmlEditable}
								onBlur={this.onBlurHTML}
								onChange={this.onChangeHTML}
								type={'classic'}
								acceptedMimes={['image']}
							/>
						</div>
						<div style={{ marginTop: 10 }} className='helperText'>
							<div className='line label'>Tokens</div>
							<div className='line'>{range1Token} = {this.props.dateFormat('range1')}</div>
							<div className='line'>{range2Token} = {this.props.dateFormat('range2')}</div>
							<div className='line'>Do not change the token values directly in the editor. If you want to change the Date/Time use the Calendar inputs.</div>
						</div>
						<div style={{ paddingBottom: 0 }} className='helperText'>
							<div style={{ marginBottom: 0 }} className='line label'>Date Format</div>
							{this.props.dropdown('dateFormat', {
								label: '',
								fixedLabel: false,
								value: dateFormat,
								selectLabel: 'Select Date Format',
								onChange: (name, value) => {
									this.props.contentUpdated({
										dateFormat: value
									});
								},
								options: this.formatOptions()
							})}
						</div>
						<div className='helperText'>
							<div style={{ marginBottom: 5 }} className='line label'>Preview</div>
							<div ref={this.displayRef} dangerouslySetInnerHTML={{ __html: html }} />
						</div>
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
