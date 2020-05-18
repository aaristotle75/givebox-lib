import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	getResource,
	sendResource
} from '../../';

class Checkout extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
		this.timeout = false;
	}

	componentDidMount() {
		this.timeout = true;
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	render() {

		return (
			<div>
				<h2>Checkout</h2>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
	sendResource,
	getResource
})(Checkout);
