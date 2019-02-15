import React, { Component } from 'react';
import GooglePlacesField from './GooglePlacesField';
import {
  GBLink,
  selectOptions,
  util
} from '../';
import AnimateHeight from 'react-animate-height';

class WhereField extends Component {

  constructor(props) {
    super(props);
    this.toggleManual = this.toggleManual.bind(this);
    this.setWhereManualFields = this.setWhereManualFields.bind(this);
    this.state = {
      manual: false
    }
  }

  toggleManual() {
    if (!this.state.manual) {
      if (util.isEmpty(this.props.field.googleMaps)) {
        this.props.fieldProp(this.props.name, { value: '', error: null, readOnly: true });
      } else {
        this.props.fieldProp(this.props.name, { error: null, readOnly: true });
      }
    } else {
      this.props.fieldProp(this.props.name, { readOnly: false });
    }
    this.setState({ manual: this.state.manual ? false : true });
  }

  setWhereManualFields(data) {
    this.props.fieldProp('address', { value: data.address });
    this.props.fieldProp('city', { value: data.city });
    this.props.fieldProp('state', { value: data.state });
    this.props.fieldProp('zip', { value: data.zip });
  }

  render() {

    return (
        <div className={`where-group`}>
          <GooglePlacesField {...this.props } manual={this.state.manual} setWhereManualFields={this.setWhereManualFields} />
          <GBLink className='link manualLink' onClick={this.toggleManual}>Manually enter address <span className={`icon icon-${this.state.manual ? 'chevron-down' : 'chevron-right'}`}></span></GBLink>
          <AnimateHeight
            duration={500}
            height={this.state.manual ? 'auto' : 0}
          >
            <div className='where-manual-container'>
              {this.props.textField('address', { parent: 'where', label: 'Address', placeholder: 'Enter Address' })}
              <div className='cityStateZip'>
                <div className='part city'>{this.props.textField('city', { parent: 'where', label: 'City', placeholder: 'Enter City' })}</div>
                <div className='part state'>{this.props.dropdown('state', { parent: 'where', label: 'State', options: selectOptions.states })}</div>
                <div className='part zip'>{this.props.textField('zip', { parent: 'where', label: 'Zip', placeholder: 'Enter Zip', maxLength: 10 })}</div>
              </div>
            </div>
          </AnimateHeight>
        </div>
    );
  }
}

export default WhereField;
