import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	Collapse,
	Choice,
	Form
} from '../../';
import { toggleModal } from '../../api/actions';
import Editor from './Editor';
import Moment from 'moment';

class WhereEditForm extends Component {
	constructor(props) {
		super(props);
		this.onChangeHTML = this.onChangeHTML.bind(this);
		this.onBlurHTML = this.onBlurHTML.bind(this);
		this.whereCallback = this.whereCallback.bind(this);
		this.state = {

		};
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

	whereCallback(where) {
		const {
			coordinates
		} = where;

		const {
			lat,
			long
		} = coordinates;

		if (!lat || !long) {
			this.props.optionsUpdated({ mapLink: false });
		}

		this.props.contentUpdated({
			where
		});
	}

	render() {

		const {
			title,
			content,
			options,
			html,
			htmlEditable,
			articleID,
			orgID
		} = this.props;

		const {
			where
		} = content;

		const {
			address,
			city,
			state,
			zip,
			country
		} = where

		const mapLink = util.getValue(options, 'mapLink');

		return (
			<div className='modalWrapper'>
				<Collapse
					label={`Edit ${title}`}
					iconPrimary='edit'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							{this.props.whereField('where', { where, label: 'Event Location', modalLabel: 'Add Event Location', whereCallback: this.whereCallback })}
							<Choice
								type='checkbox'
								name='mapLink'
								label={'Show a Link to View Map'}
								onChange={(name, value) => {
									this.props.optionsUpdated({ mapLink: mapLink ? false : true });
								}}
								checked={mapLink}
								value={mapLink}
							/>
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
							{ address || city || state || zip || country ?
							<div style={{ marginTop: 10 }} className='helperText'>
								<div className='line label'>Tokens</div>
								{ address ? <div className='line'>{`{{streetaddress}}`} = {address}</div> : '' }
								{ city ? <div className='line'>{`{{city}}`} = {city}</div> : '' }
								{ state ? <div className='line'>{`{{state}}`} = {state}</div> : '' }
								{ zip ? <div className='line'>{`{{zip}}`} = {zip}</div> : '' }
								{ country ? <div className='line'>{`{{country}}`} = {country}</div> : '' }
								<div className='line'>Do not change the token value directly in the editor. If you want to change the Location use the input field.</div>
							</div> : '' }
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

class WhereEdit extends Component {

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
				<WhereEditForm {...this.props} />
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
})(WhereEdit);
