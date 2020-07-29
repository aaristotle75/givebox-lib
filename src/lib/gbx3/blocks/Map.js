import React, {Component} from 'react';
import {
	util
} from '../../';

class Map extends Component{
	constructor(props){
		super(props);
		this.initMap = this.initMap.bind(this);
		this.initCallback = this.initCallback.bind(this);
		this.initiated = false;
	}

	componentDidMount() {
		this.initMap(this.initCallback);
	}

	initMap(callback = null) {

		const {
			where
		} = this.props;

		const {
			lat,
			long: lng
		} = util.getValue(where, 'coordinates', {});

		const uluru = { lat, lng };
		const map = new window.google.maps.Map(document.getElementById('map'), {
			disableDefaultUI: true,
			zoom: 10,
			zoomControl: true,
			center: uluru
		});

		const marker = new window.google.maps.Marker({
			position: uluru,
			map: map,
			title: 'Givebox Map'
		});

		if (callback) callback();
	}

	initCallback() {
		window.google.maps.event.addDomListener(window, 'resize', this.initMap);
		window.google.maps.event.addDomListener(window, 'load', this.initMap);
	}

	render() {

		const {
			displayRef
		} = this.props;

		const current = displayRef.current;
		let height = 100;
		if (current) {
			height = current.clientHeight;
		}
		console.log('execute', height, current);
		return (
			<div className='modalWrapper'>
				<div ref="map" id="map"></div>
			</div>
		)
	}
};

export default Map;
