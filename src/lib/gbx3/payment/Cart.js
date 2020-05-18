import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	toggleModal,
	getResource,
	sendResource,
	Tabs,
	Tab,
	util
} from '../../';
import Checkout from './Checkout';

class Cart extends Component {

	constructor(props) {
		super(props);
		this.setTab = this.setTab.bind(this);
		this.state = {
			tab: props.tab
		};
		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	setTab(tab) {
		this.setState({ tab });
	}

	render() {

		const {
			primaryColor
		} = this.props;

		const {
			tab
		} = this.state;

		return (
			<div style={{ paddingTop: 20 }} className='modalWrapper'>
				<Tabs
					default={tab}
					className='statsTab'
					allowCustom={true}
					customColor={primaryColor}
				>
					<Tab id='cart' label={<span className='stepLabel'>Items in Cart</span>}>
						Items in Cart
					</Tab>
					<Tab id='checkout' label={<span className='stepLabel'>Checkout</span>}>
						<Checkout />
					</Tab>
				</Tabs>
			</div>
		)
	}
}

Cart.defaultProps = {
	tab: 'checkout'
};

function mapStateToProps(state, props) {
	const gbx3 = util.getValue(state, 'gbx3', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const primaryColor = util.getValue(gbxStyle, 'primaryColor');

	return {
		primaryColor
	}
}

export default connect(mapStateToProps, {
	toggleModal,
	sendResource,
	getResource
})(Cart);
