/*global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import GooglePlacesField from './GooglePlacesField';
import {
  GBLink,
  selectOptions,
  util,
  ModalRoute,
  ModalLink,
  toggleModal
} from '../';
import AnimateHeight from 'react-animate-height';
import has from 'has';

class WhereFieldForm extends Component {

  constructor(props) {
    super(props);
    this.toggleManual = this.toggleManual.bind(this);
    this.setWhereManualFields = this.setWhereManualFields.bind(this);
    this.geocodeCallback = this.geocodeCallback.bind(this);
    this.drawMap = this.drawMap.bind(this);
    this.state = {
      manual: false,
      map: false
    }
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    if (!util.isEmpty(this.props.where)) {
      if (has(this.props.where, 'coordinates')) {
        if (!util.isEmpty(this.props.where.coordinates)) {
          this.drawMap(util.getValue(this.props.where.coordinates, 'lat'), util.getValue(this.props.where.coordinates, 'long'));
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (this.state.manual) this.setWhereManualFields();
  }

  toggleManual(open) {
    if (open) {
      this.props.fieldProp('googleMaps', { value: '', error: null });
    }
    this.setState({ manual: open ? true : false });
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
    //if (closeModal) this.props.toggleModal(this.props.modalID, false);
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
    where.coordinates.long = lng;
    this.props.fieldProp(this.props.name, { where });
    this.drawMap(lat, lng);
  }

  drawMap(lat, lng) {
    if (lat && lng) {
      this.timeout = setTimeout(() => {
        const myLatLng = new google.maps.LatLng(lat, lng);
        const map = new google.maps.Map(this.mapRef.current, {
          zoom: 12,
          center: myLatLng
        });
        const marker = new google.maps.Marker({
          position: myLatLng,
          title: 'Event Location (Approximate)'
        });
        marker.setMap(map);
        this.setState({ map: true });
        this.timeout = null;
      }, 0);
    }
  }

  render() {

    const {
      where
    } = this.props;

    return (
        <div className={`modalFormContainer where-group`}>
          <h2 className='center'>{this.props.label}</h2>
          {this.props.value && <h3 className='center'>{this.props.value}</h3>}
          <AnimateHeight
            duration={500}
            height={this.state.map ? 'auto' : 0}
          >
            <div className='flexCenter'>
              <div style={{ width: 300, height: 300 }} ref={this.mapRef}></div>
            </div>
          </AnimateHeight>
          <GooglePlacesField {...this.props } toggleManual={this.toggleManual} drawMap={this.drawMap} id={'autocomplete'} manual={this.state.manual} />
          <div style={{ marginTop: 20 }}>
            <GBLink className='link manualLink' onClick={() => this.toggleManual(this.state.manual ? false : true)}>Manually enter address <span className={`icon icon-${this.state.manual ? 'chevron-down' : 'chevron-right'}`}></span></GBLink>
            <AnimateHeight
              duration={500}
              height={this.state.manual ? 'auto' : 0}
            >
              <div className='where-manual-container'>
                {this.props.textField('address', { parent: 'where', label: 'Address', placeholder: 'Enter Address', value: util.getValue(where, 'address') })}
                <div className='cityStateZip'>
                  <div className='part city'>{this.props.textField('city', { parent: 'where', label: 'City', placeholder: 'Enter City', value: util.getValue(where, 'city')})}</div>
                  <div className='part state'>{this.props.dropdown('state', { parent: 'where', direction: 'top', label: 'State', options: selectOptions.states, value: util.getValue(where, 'state') })}</div>
                  <div className='part zip'>{this.props.textField('zip', { parent: 'where', label: 'Zip', placeholder: 'Enter Zip', maxLength: 10, value: util.getValue(where, 'zip') })}</div>
                </div>
                <div className='center button-group'>
                  <GBLink style={{ marginTop: 20 }} className='button' onClick={() => this.setWhereManualFields(true)}>{this.props.manualLabel}</GBLink>
                </div>
              </div>
            </AnimateHeight>
          </div>
          <div className='center button-group'>
            <GBLink className='button' onClick={() => this.props.toggleModal(this.props.modalID, false)}>Close</GBLink>
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
    const where = util.getValue(this.props.params, 'where', {});
    const address = util.getValue(where, 'address', '');
    const city = util.getValue(where, 'city', '');
    const state = util.getValue(where, 'state', '');
    const zip = util.getValue(where, 'zip', '');
    const whereValue = `${address}${city ? ` ${city},`: ''}${state ? ` ${state}` : ''}${zip ? ` ${zip}` : ''}`;
    if (this.props.createField) {
      let params = util.cloneObj(this.props.params);
      let value = whereValue || '';
      params = Object.assign(params, { value });
      this.props.createField(this.props.name, params);
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
    const where = this.props.field ? util.getValue(this.props.field, 'where', {}) : {};
    return (
      <WhereFieldForm {...this.props } where={where} />
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
  manualLabel: 'Update Map'
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
  toggleModal
})(WhereField);
