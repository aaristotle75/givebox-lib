/*global google*/
import React, { Component } from 'react';

class GooglePlacesField extends Component {

  constructor(props) {
    super(props);
    this.fillInAddress = this.fillInAddress.bind(this);
    this.geolocate = this.geolocate.bind(this);
    this.resetValues = this.resetValues.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.formatAddress = this.formatAddress.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.autocomplete = null;
    this.state = {
      status: 'idle',
      edit: true
    }
  }

  componentDidMount() {
  }

  initAutocomplete(ref) {
    this.inputRef = ref;

    // Create the autocomplete object, restricting the search to geographical
    // location types.
    this.autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(this.inputRef.current),
        {types: ['geocode']});

    this.inputRef.current.setAttribute('autocomplete', 'new-password');
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
    //this.props.toggleModal(this.props.modalID, false);
  }


  formatAddress(data) {
    const address = data.street_number ? `${data.street_number} ${data.route}` : '';
    const city = data.locality;
    const state = data.administrative_area_level_1;
    const zip = data.postal_code;
    const country = data.country;
    const lat = data.lat;
    const long = data.long;

    let value = `${address}${city ? ` ${city},`: ''}${state ? ` ${state}` : ''}${zip ? ` ${zip}` : ''}`;
    if (!data.locality && !this.state.edit) value = '';
    const where = {
      address: address,
      city: city,
      state: state,
      zip: zip,
      country: country,
      coordinates: {
        lat: lat,
        long: long
      }
    };
    this.props.drawMap(lat, long);
    this.props.fieldProp('googleMaps', { value, googleMaps: data });
    this.props.fieldProp(this.props.name, { value, where });
    if (this.props.whereCallback) this.props.whereCallback(where);
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
    this.props.fieldProp('googleMaps', { googleMaps });
  }

  clearInput() {
    this.props.fieldProp('googleMaps', { value: '', readOnly: false, googleMaps: {} });
    this.setState({ edit: true });
  }

  onFocus(name, field) {
    this.props.toggleManual(false);
    this.initAutocomplete(field.ref);
    this.geolocate();
  }

  render() {

    return (
      <div className='googleMapFields'>
        {this.props.textField('googleMaps', { onFocus: this.onFocus, id: this.props.id, placeholder: 'Type Location', fixedLabel: true, label: 'Search Google Maps', maxLength: 128 })}
      </div>
    );
  }
}

GooglePlacesField.defaultProps = {
  id: 'autocomplete'
}

export default GooglePlacesField;
