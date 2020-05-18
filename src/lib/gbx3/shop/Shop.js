import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	getResource,
	sendResource
} from '../../';

class Shop extends Component {

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
			<div style={{ paddingTop: 20 }} className='modalWrapper'>
				<h2>Shop More Items</h2>
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
})(Shop);
