import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	GBLink,
	updateInfo,
	toggleAdminLeftPanel,
	createFundraiser
} from '../../';

class CreateMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	renderTypes() {
		const items= [];

		types.kinds().forEach((value) => {
			items.push(
				<li
					key={value}
					onClick={() => this.props.createFundraiser(value)}
					className='link show'
				>
					<span style={{ marginRight: 5 }} className={`icon icon-${types.kind(value).icon}`}></span> {types.kind(value).name}
				</li>
			);
		});

		return (
			<ul>
				{items}
			</ul>
		)
	}

	render() {

		const {
			openAdmin: open
		} = this.props;

		return (
			<div className='leftPanelContainer'>
				<div className='leftPanelTop'>
					<div className='leftPanelHeader'>
						Create Menu
						<GBLink onClick={this.props.toggleAdminLeftPanel} className={`link leftPanelClose ${open ? 'open' : 'close'}`}><span className='icon icon-x'></span></GBLink>
					</div>
					<div className='middle centerAlign adminPanelTabs'>
					</div>
				</div>
				<div className={`leftPanelScroller`}>
					{this.renderTypes()}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const openAdmin = util.getValue(admin, 'open');
	const editable = util.getValue(admin, 'editable');

	return {
		editable,
		openAdmin
	}
}

export default connect(mapStateToProps, {
	updateInfo,
	toggleAdminLeftPanel,
	createFundraiser
})(CreateMenu);
