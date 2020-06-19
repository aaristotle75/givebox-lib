import React from 'react';
import { connect } from 'react-redux';
import {
	util
} from '../../';

class ReceiptEdit extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {

		return (
			<div className='receiptEdit'>
				<h2>Thank You Receipt Editor</h2>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});

	return {
		gbx3
	}
}

export default connect(mapStateToProps, {
})(ReceiptEdit);
