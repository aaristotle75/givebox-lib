import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	GBLink,
	updateInfo
} from '../../';

class CreateMenuLayout extends React.Component {

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
			editable,
			openAdmin: open
		} = this.props;

		return (
			<div className='layoutMenu'>
				<div className='leftPanelHeader'>
					Create New
					<GBLink onClick={this.props.toggleAdminLeftPanel} className={`link leftPanelClose ${open ? 'open' : 'close'}`}><span className='icon icon-x'></span></GBLink>
				</div>
				<div className='middle centerAlign adminPanelTabs'>
				</div>
				<div className={`adminCustomArea ${editable ? 'editable' : ''}`}>
					<div className='adminSectionContainer'>
						{this.renderTypes()}
					</div>
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
	updateInfo
})(CreateMenuLayout);
