import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getResource, sendResource, util } from '../lib';

class ItemForm extends Component {

  constructor(props) {
    super(props);
    this.processForm = this.processForm.bind(this);
    this.formSavedCallback = this.formSavedCallback.bind(this);
  }

  componentDidMount() {
    this.props.getResource(this.props.name, {id: ['org', this.props.id]});
  }

  componentWillUnmount() {
  }

  formSavedCallback() {
    console.log('formSavedCallback', this.props.responseData);
    return;
  }

  processCallback(res, err) {
    if (!err) {
      this.props.formSaved(this.formSavedCallback);
    } else {
      if (!this.props.getErrors(err)) this.props.formProp({error: this.props.savingErrorMsg});
    }
    return;
  }

  processForm(fields) {
    let data = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.autoReturn) data[key] = value.value;
    });
    this.props.sendResource(
      'bankAccount',
      {
        id: ['org', this.props.id],
        method: 'patch',
        data: data,
        callback: this.processCallback.bind(this)
      });
  }

  render() {

    const {
      routeProps,
      item
    } = this.props;

    if (util.isLoading(item, this.props.id)) {
      return this.props.loader(`trying to load customer resource from ${routeProps.match.url}`);
    }

    const data = item.data;

    return (
      <div>
        <h2>Form {this.props.id}</h2>
        {this.props.textField('bankAccountID', {type: 'hidden', value: data.ID})}
        {this.props.textField('name', {placeholder: 'Enter Account Name', required: true, value: data.name})}
        {this.props.textField('last4', {placeholder: 'Account Number', required: true, value: data.last4})}
        {this.props.textField('routingNumber', {placeholder: 'Routing Number', required: true, value: data.routingNumber, maxLength: 9})}
        {this.props.saveButton(this.processForm)}
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    item: state.resource[props.name] ? state.resource[props.name] : {}
  }
}


export default connect(mapStateToProps, {
  getResource,
  sendResource
})(ItemForm)
