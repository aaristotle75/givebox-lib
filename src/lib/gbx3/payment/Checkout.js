import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	getResource,
	sendResource
} from '../../';
import Block from '../blocks/Block';
import Form from '../blocks/Form';

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
			<div className='formSectionContainer'>
				<div className='formSection'>
					<Block
						name='paymentForm'
						blockRef={React.createRef()}
					>
						<Form />
					</Block>
				</div>
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
