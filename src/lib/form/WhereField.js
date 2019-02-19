/*global google*/
import React, { Component } from 'react';
import GooglePlacesField from './GooglePlacesField';
import {
  GBLink,
  selectOptions,
  util,
  ModalRoute,
  ModalLink
} from '../';
import AnimateHeight from 'react-animate-height';
import has from 'has';

class WhereFieldForm extends Component {

  constructor(props) {
    super(props);
    this.toggleManual = this.toggleManual.bind(this);
    this.setWhereManualFields = this.setWhereManualFields.bind(this);
    this.geocodeCallback = this.geocodeCallback.bind(this);
    this.state = {
      manual: false
    }
  }

  componentDidMount() {
    //this.geocode = new google.maps.Geocoder();
  }

  componentWillUnmount() {
    if (this.state.manual) this.setWhereManualFields();
  }

  geocodeCallback(results, status) {
    let lat, lng;
    if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
      const location = results[0].geometry.location;
      lat = location.lat();
      lng = location.lng();
    }
    const where = this.props.field.where;
    if (!has(where, 'coordinate')) where.coordinates = {};
    where.coordinates.lat = lat;
    where.coordinates.lng = lng;
    this.props.fieldProp(this.props.name, { where });
  }

  toggleManual() {
    if (!this.state.manual) {
      this.props.fieldProp('googleMaps', { value: '', error: null });
    }
    this.setState({ manual: this.state.manual ? false : true });
  }

  setWhereManualFields(closeModal = false) {
    const fields = this.props.fields;
    const address = fields.address.value || '';
    const city = fields.city.value || '';
    const state = fields.state.value || '';
    const zip = fields.zip.value || '';
    const value = `${address}${city ? ` ${city},`: ''}${state ? ` ${state}` : ''}${zip ? ` ${zip}` : ''}`;
    const where = {
      address: address,
      city: city,
      state: state,
      zip: zip,
      country: 'USA'
    };
    if (address || city || state) {
      this.props.fieldProp(this.props.name, { value, where });
      this.geocode = new google.maps.Geocoder();
      this.geocode.geocode(
        { address: value },
        this.geocodeCallback
      );
    }
    if (closeModal) this.props.toggleModal(this.props.modalID, false);
  }

  render() {

    return (
        <div className={`modalFormContainer where-group`}>
          <h2 className='center'>{this.props.label}</h2>
          <GooglePlacesField {...this.props } id={'autocomplete'} manual={this.state.manual} />
          <div style={{ marginTop: 20 }}>
            <GBLink className='link manualLink' onClick={this.toggleManual}>Manually enter address <span className={`icon icon-${this.state.manual ? 'chevron-down' : 'chevron-right'}`}></span></GBLink>
            <AnimateHeight
              duration={500}
              height={this.state.manual ? 'auto' : 0}
            >
              <div className='where-manual-container'>
                {this.props.textField('address', { parent: 'where', label: 'Address', placeholder: 'Enter Address' })}
                <div className='cityStateZip'>
                  <div className='part city'>{this.props.textField('city', { parent: 'where', label: 'City', placeholder: 'Enter City' })}</div>
                  <div className='part state'>{this.props.dropdown('state', { parent: 'where', direction: 'top', label: 'State', options: selectOptions.states })}</div>
                  <div className='part zip'>{this.props.textField('zip', { parent: 'where', label: 'Zip', placeholder: 'Enter Zip', maxLength: 10 })}</div>
                </div>
                <div className='center button-group'>
                  <GBLink style={{ marginTop: 20 }} className='button' onClick={() => this.setWhereManualFields(true)}>{this.props.manualLabel}</GBLink>
                </div>
              </div>
            </AnimateHeight>
          </div>
        </div>
    );
  }
}


class WhereField extends Component {

  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.clearWhere = this.clearWhere.bind(this);
    this.state = {
      status: 'idle'
    }
  }

  componentDidMount() {
    if (this.props.createField) {
      this.props.createField(this.props.name, this.props.params);
    }
  }

  onMouseEnter(e) {
    e.preventDefault();
    if (!this.props.error) this.setState({status: 'active'});
  }

  onMouseLeave(e) {
    e.preventDefault();
    this.setState({status: 'idle'});
  }

  renderForm() {
    return (
      <WhereFieldForm {...this.props } />
    )
  }

  clearWhere() {
    this.props.fieldProp(this.props.name, { value: '', where: {} });
  }

  render() {

    const {
      name,
      style,
      label,
      fixedLabel,
      className,
      error,
      errorType,
      modalLabel,
      value,
      opts
    } = this.props;

    return (
      <div style={style} className={`input-group ${className || ''} richtext-group ${error ? 'error tooltip' : ''}`}>
        <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
        <div className={`floating-label ${this.state.status} ${fixedLabel && 'fixed'}`}>
          <div>
            <ModalRoute id={this.props.modalID} component={() => this.renderForm()} />
            <ModalLink className={`input ${value ? 'hasValue' : ''}`} id={this.props.modalID} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} opts={opts}>{value || modalLabel}</ModalLink>
          </div>
          {label && <label htmlFor={name}>{label}</label>}
          <div className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
        </div>
        <div className={`tooltipTop ${errorType !=='tooltip' && 'displayNone'}`}>
          {error}
          <i></i>
        </div>
        {value && <GBLink className='link clearWhere' onClick={() => this.clearWhere()}>Clear</GBLink>}
      </div>
    );
  }
}

WhereField.defaultProps = {
  name: 'defaultWhereField',
  modalLabel: 'Open Where Modal',
  manualLabel: 'Update'
}

export default WhereField;
