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
    fields.forEach(function(value, key) {
      if (value.autoReturn) data[key] = value.value;
    });
    this.props.sendResource({name: 'customers', id: fields.cusID.value, method: 'patch'}, data, this.processCallback.bind(this));
    return;
  }

  render() {

    const {
      routeProps,
      item
    } = this.props;

    if (util.isLoading(item, true)) {
      return this.props.loader(`trying to load customer resource from ${routeProps.match.url}`);
    }

    const data = item.data;

    return (
      <div>
        <h2>Customer Form</h2>
        {this.props.textField('cusID', {type: 'hidden', value: data.ID})}
        {this.props.textField('firstName', {placeholder: 'Enter First Name', required: true, value: data.firstName})}
        {this.props.textField('lastName', {placeholder: 'Enter Last Name', required: true, value: data.lastName})}
        {this.props.textField('email', {placeholder: 'Enter Email', required: true, value: data.email})}
        {this.props.textField('notes', {placeholder: 'Enter Notes', maxLength: 255, value: data.notes})}
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
