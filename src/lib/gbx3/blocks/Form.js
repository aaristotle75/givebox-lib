import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  util,
  GBLink,
	toggleModal
} from '../../';
import PaymentForm from '../payment/PaymentForm';
import { BlockOption } from './Block';

class Form extends Component {

  constructor(props) {
    super(props);
		this.edit = this.edit.bind(this);
    this.saveButton = this.saveButton.bind(this);
    this.state = {
			edit: false
    };
  }

  componentDidMount() {
  }

  saveButton() {
    const form = document.getElementById(`gbxForm-form-saveButton`);
    if (form) form.click();
  }

	edit() {
		//this.props.toggleModal(this.props.modalID, true);
		this.setState({ edit: true });
	}

	remove() {
		console.log('execute remove');
	}

  render() {

    const {
      article,
			noRemove,
			primaryColor
    } = this.props;

		const {
			edit
		} = this.state;

    return (
      <div className='block'>
				<BlockOption
					edit={edit}
					noRemove={noRemove}
					editOnClick={this.edit}
					removeOnClick={this.remove}
				/>
        <PaymentForm
          primaryColor={primaryColor}
          article={article}
          phone={{ enabled: true, required: false }}
          address={{ enabled: true, required: false }}
          work={{ enabled: true, required: false }}
          custom={{ enabled: true, required: false, placeholder: 'My custom note placeholder' }}
          editable={this.props.editable}
        />
        <div className='button-group'>
          <GBLink allowCustom={true} className='button' onClick={() => this.saveButton()}>Submit Form</GBLink>
          <GBLink allowCustom={true} onClick={() => console.log('onclick callback')}>No, thanks</GBLink>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {

	const modalID = `textBlock-${props.name}`;

  return {
		modalID
  }
}

export default connect(mapStateToProps, {
	toggleModal
})(Form);
