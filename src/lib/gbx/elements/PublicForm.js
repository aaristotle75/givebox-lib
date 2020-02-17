import React, {Component} from 'react';
import {
  util,
  GBLink
} from '../../';
import PaymentForm from '../PaymentForm';
import CustomBtn from '../CustomBtn';

export default class PublicForm extends Component {

  constructor(props) {
    super(props);
    this.saveButton = this.saveButton.bind(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  saveButton() {
    const form = document.getElementById(`gbxForm-form-saveButton`);
    if (form) form.click();
  }

  render() {

    const {
      article
    } = this.props;

    const settings = util.getValue(article, 'givebox', {});
    const color = util.getValue(settings, 'primaryColor');

    return (
      <>
        <PaymentForm
          primaryColor={color}
          article={article}
          phone={{ enabled: true, required: false }}
          address={{ enabled: true, required: false }}
          work={{ enabled: true, required: false }}
          custom={{ enabled: true, required: false, placeholder: 'My custom note placeholder' }}
        />
        <div className='button-group'>
          <CustomBtn color={this.props.primaryColor} className='gbxBtn' onClick={() => this.saveButton()}>Submit Form</CustomBtn>
          <GBLink onClick={() => console.log('onclick callback')}>No, thanks</GBLink>
        </div>
      </>
    )
  }
}
