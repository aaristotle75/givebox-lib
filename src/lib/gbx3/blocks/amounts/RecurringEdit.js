import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  util,
	Dropdown
} from '../../../';

class RecurringEdit extends Component {

  constructor(props) {
    super(props);
		this.renderRecurringByKind = this.renderRecurringByKind.bind(this);

    this.state = {
			recurring: this.props.recurring
    };
  }

	componentDidMount() {
	}

	renderRecurringByKind() {

		const {
			article,
			kind
		} = this.props;

		switch (kind) {
			case 'membership': {
				return (
					<>

					</>
				)
			}

			case 'fundraiser':
			case 'invoice': {
				const recurring = { enabled: util.getValue(article, 'allowRecurring', true), ...this.state.recurring };
				return (
					<>
		        <Dropdown
							label='Allow Recurring Option'
							fixedLabel={true}
		          name='allowRecurring'
		          defaultValue={util.getValue(recurring, 'enabled', true) ? 'yes' : 'no'}
		          onChange={(name, value) => {
								const allowRecurring = value === 'yes' ? true : false;
								const data = {
									allowRecurring
								};
								const recurring = this.state.recurring;
								recurring.enabled = allowRecurring;
								this.setState({ recurring }, () => {
									this.props.optionsUpdated('recurring', recurring);
									this.props.updateData(data);
								});
							}}
					    options={[
					      { primaryText: 'Yes', value: 'yes' },
					      { primaryText: 'No', value: 'no' }
					    ]}
		        />
					</>
				)
			}

			default: {
				return (
					<div className='flexCenter error'>No Recurring Options Available.</div>
				)
			}
		}
	}

  render() {

		const {
			article
		} = this.props;

    return this.renderRecurringByKind();
  }
}

RecurringEdit.defaultProps = {
}

function mapStateToProps(state, props) {

  return {
	}
}

export default connect(mapStateToProps, {
})(RecurringEdit);
