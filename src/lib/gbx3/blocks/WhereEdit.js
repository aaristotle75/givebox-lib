import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util,
	Collapse,
	Dropdown,
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

		return (
			<div className='modalWrapper'>
				<Collapse
					label={`Edit ${title}`}
					iconPrimary='edit'
				>
					<div className='formSectionContainer'>
						<div className='formSection'>
							{this.props.whereField('where', { where, label: 'Event Location', modalLabel: 'Add Event Location', whereCallback: this.whereCallback })}
							<div style={{ marginTop: 10 }} className='helperText'>
								<div style={{ fontWeight: 500 }} className='line'>Style Editor</div>
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
