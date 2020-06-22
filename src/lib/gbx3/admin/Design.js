import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	updateAdmin
} from '../../';
import Layout from '../Layout';
import ReceiptEdit from './ReceiptEdit';
import DesignMenu from './DesignMenu';

class Design extends React.Component {

	constructor(props) {
		super(props);
		this.switchCreateType = this.switchCreateType.bind(this);
		this.state = {
		};
	}

	switchCreateType(createType) {
		this.props.updateAdmin({ createType });
	}

	render() {

		const {
			openAdmin: open,
			createType
		} = this.props;

		return (
			<>
				<div className={`leftPanel ${open ? 'open' : 'close'}`}>
					<DesignMenu />
				</div>
				<div className={`stageContainer hasBottom ${open ? 'open' : 'close'}`}>
					<div className='stageAligner'>
						{createType === 'form' ?
							<Layout
								loadGBX3={this.props.loadGBX3}
								reloadGBX3={this.props.reloadGBX3}
							/>
						:
							<ReceiptEdit

							/>
						}
					</div>
				</div>
				<div className={`bottomPanel ${open ? 'open' : 'close'}`}>
					<div className='centerAlign adminPanelTabs'>
						<div className='button-group'>
							<GBLink style={{ marginRight: 20 }} className={`ripple link ${createType === 'form' ? 'selected' : ''}`} onClick={() => this.switchCreateType('form')}>Payment Form</GBLink>
							<GBLink style={{ marginLeft: 20 }} className={`ripple link ${createType === 'receipt' ? 'selected' : ''}`} onClick={() => this.switchCreateType('receipt')}>Thank You Receipt</GBLink>
						</div>
					</div>
				</div>
			</>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const openAdmin = util.getValue(admin, 'open');
	const createType = util.getValue(admin, 'createType');

	return {
		openAdmin,
		createType
	}
}

export default connect(mapStateToProps, {
	updateAdmin
})(Design);
