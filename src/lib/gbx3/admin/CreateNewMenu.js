import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	types,
	updateInfo
} from '../../';

class CreateNewMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	renderTypes() {
		const items= [];

		types.kinds().forEach((value) => {
			items.push(
				<GBLink
					key={value}
					onClick={() => this.props.updateInfo({ kind: value })}
					className='link show'
				>
					{types.kind(value).name}
				</GBLink>
			);
		});

		return (
			<div className='button-group linkBar'>
				{items}
			</div>
		)
	}

	render() {

		return (
			<div className='createNewMenu'>
				<div className='adminSectionTitle'>Step 1: Create</div>
				{this.renderTypes()}
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	//const gbx3 = util.getValue(state, 'gbx3', {});

	return {
	}
}

export default connect(mapStateToProps, {
	updateInfo
})(CreateNewMenu);
