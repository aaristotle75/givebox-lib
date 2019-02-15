/*global google*/
import React, { Component } from 'react';

class GooglePlacesField extends Component {

  constructor(props) {
    super(props);
    this.fillInAddress = this.fillInAddress.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.geolocate = this.geolocate.bind(this);
    this.resetValues = this.resetValues.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.onChange = this.onChange.bind(this);
    this.formatAddress = this.formatAddress.bind(this);
    this.inputRef = React.createRef();
		this.autocomplete = null;
    this.state = {
      status: 'idle',
      edit: true
    }
  }

  componentDidMount() {
    this.initAutocomplete();
    const params = Object.assign({}, this.props.params, { ref: this.inputRef });
    if (this.props.createField) this.props.createField(this.props.name, params);
  }

  initAutocomplete() {
		// Create the autocomplete object, restricting the search to geographical
		// location types.
		this.autocomplete = new google.maps.places.Autocomplete(
				/** @type {!HTMLInputElement} */(document.getElementById(this.props.id)),
				{types: ['geocode']});

		// When the user selects an address from the dropdown, populate the address
		// fields in the form.
		this.autocomplete.addListener('place_changed', this.fillInAddress);
	}

  editWhere() {
    document.getElementById(this.props.id).value = '';
    document.getElementById(this.props.id).placeholder = this.props.hintText;
    this.setState({edit: true});
  }

	geolocate() {
		var bindthis = this;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var geolocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				var circle = new google.maps.Circle({
					center: geolocation,
					radius: position.coords.accuracy
				});
				bindthis.autocomplete.setBounds(circle.getBounds());
			});
		}
	}

  onChange(e) {
    this.props.onChange(e);
  }

	fillInAddress() {
    const returned = [];
    const googleMaps = {};
		const place = this.autocomplete.getPlace();
		const componentForm = {
			street_number: 'short_name',
			route: 'long_name',
			locality: 'long_name',
			administrative_area_level_1: 'short_name',
			country: 'long_name',
			postal_code: 'short_name'
		};
		// Get each component of the address from the place details
		// and fill the corresponding field on the form.
		for (var i = 0; i < place.address_components.length; i++) {
			const addressType = place.address_components[i].types[0];
      returned.push(addressType);
			if (componentForm[addressType]) {
				var val = place.address_components[i][componentForm[addressType]];
        googleMaps[addressType] = val;
			}
		}
    googleMaps.lat = place.geometry.location.lat();
    googleMaps.long = place.geometry.location.lng();
    this.formatAddress(googleMaps);
    this.resetValues(returned, googleMaps);
    this.setState({edit: false});
	}


  formatAddress(data) {
		const address = data.street_number ? `${data.street_number} ${data.route}` : '';
		const city = data.locality;
		const state = data.administrative_area_level_1;
		const zip = data.postal_code;
		const country = data.country;

    let value = `${address}${city ? ` ${city},`: ''}${state ? ` ${state}` : ''}${zip ? ` ${zip}` : ''}${country ? ` ${country}` : ''}`;
    if (!data.locality && !this.state.edit) value = '';
    const where = {
      address: address,
      city: city,
      state: state,
      zip: zip,
      country: country,
      coordinates: {
        lat: data.lat,
        long: data.long
      }
    };
    this.props.fieldProp(this.props.name, { value, readOnly: true, googleMaps: data, where });
    this.props.setWhereManualFields(where);
    return value;
	}

  resetValues(array, data) {
    const googleMaps = { ...data };
    if (array.indexOf('street_number') === -1) {
      googleMaps.street_number = '';
    }
    if (array.indexOf('route') === -1) {
      googleMaps.route = '';
    }
    if (array.indexOf('locality') === -1) {
      googleMaps.locality = '';
    }
    if (array.indexOf('administrative_area_level_1') === -1) {
      googleMaps.administrative_area_level_1 = '';
    }
    if (array.indexOf('long_name') === -1) {
      googleMaps.long_name = '';
    }
    if (array.indexOf('postal_code') === -1) {
      googleMaps.postal_code = '';
    }
    this.props.fieldProp(this.props.name, { googleMaps });
  }

  clearInput() {
    this.props.fieldProp(this.props.name, { value: '', readOnly: false, googleMaps: {}, where: {} });
    this.setState({ edit: true });
  }

  onFocus(e) {
    e.preventDefault();
    this.setState({status: 'active'});
    this.geolocate();
    if (this.props.onFocus) this.props.onFocus(e);
  }

  onBlur(e) {
    e.preventDefault();
    this.setState({status: 'idle'});
    if (this.props.onBlur) this.props.onBlur(e);
  }

  render() {

    const {
      id,
      name,
      type,
      placeholder,
      autoFocus,
      required,
      readOnly,
      style,
      label,
      fixedLabel,
      className,
      error,
      errorType,
      maxLength,
      value,
      iconClear,
      manual
    } = this.props;

    return (
        <div style={style} className={`input-group ${className || ''} ${manual ? 'disabled' : ''} textfield-group ${error ? 'error tooltip' : ''} ${type === 'hidden' && 'hidden'}`}>
          <div className={`floating-label ${this.state.status} ${fixedLabel && 'fixed'}`}>
            <input
              autoFocus={autoFocus}
              id={id || name}
              ref={this.inputRef}
              name={name}
              type={type}
              placeholder={placeholder}
              required={type === 'hidden' ? false : required}
              readOnly={readOnly}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              autoComplete='new-password'
              value={value}
              maxLength={maxLength}
            />
            {label && <label htmlFor={name}>{label}</label>}
            <div className={`input-bottom ${error ? 'error' : this.state.status}`}></div>
            <div className='input-button'>
              <button className={`link ${this.state.edit && 'displayNone'}`} onClick={this.clearInput} type='button'>{iconClear}</button>
            </div>
          </div>
          <div className={`tooltipTop ${(errorType !=='tooltip') && 'displayNone'}`}>
            {error}
            <i></i>
          </div>
          <div className={`errorMsg ${(!error || errorType !== 'normal') && 'displayNone'}`}>{error}</div>
        </div>
    );
  }
}

GooglePlacesField.defaultProps = {
  name: 'defaultWhereField',
  type: 'text',
  maxlength: 128,
  iconClear: <span className='icon icon-x'></span>
}

export default GooglePlacesField;
