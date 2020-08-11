import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	GBLink
} from '../../../';
import {
	updateInfo,
	toggleAdminLeftPanel,
	createFundraiser
} from '../../redux/gbx3actions';

class CreateMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	renderTypes() {
		const {
			isVolunteer
		} = this.props;

		const items= [];

		types.kinds().forEach((value) => {
			if (isVolunteer && (value === 'invoice' || value === 'membership')) return;
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

		return (
			<div className='leftPanelContainer'>
				<div className='leftPanelTop'>
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
	const isVolunteer = util.getValue(admin, 'volunteer');

	return {
		editable,
		openAdmin,
		isVolunteer
	}
}

export default connect(mapStateToProps, {
	updateInfo,
	toggleAdminLeftPanel,
	createFundraiser
})(CreateMenu);
