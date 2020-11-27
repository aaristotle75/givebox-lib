/*global google*/
import React, {Component} from 'react';
import * as util from '../../common/utility';

class Map extends Component{
  constructor(props){
    super(props);
    this.drawMap = this.drawMap.bind(this);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    this.drawMap();
  }

  drawMap() {

    const {
      where,
      markerTitle
    } = this.props;

    const {
      lat,
      long: lng
    } = util.getValue(where, 'coordinates', {});

    if (lat && lng) {
      this.timeout = setTimeout(() => {
        const address = util.makeAddress(where, true, false, 'horizontal', true);
        const myLatLng = new google.maps.LatLng(lat, lng);
        const map = new google.maps.Map(this.mapRef.current, {
          disableDefaultUI: true,
          zoom: 12,
          center: myLatLng
        });

        const marker = new google.maps.Marker({
          position: myLatLng,
          title: address || markerTitle
        });
        marker.setMap(map);

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <strong>${markerTitle}</strong><br />
            ${address}
          `
        });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map,marker);
        });

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
      <div style={{ paddingTop: 10 }} className='modalWrapper'>
        <div className='whereMap'>
          {util.makeAddress(where, true, false, 'horizontal')}
          <div className='theMap' ref={this.mapRef}></div>
        </div>
      </div>
    )
  }
};

Map.defaultProps = {
  markerTitle: 'Location (Approximate)'
};

export default Map;
