import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	GBLink,
	types
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
					onClick={() => console.log('onClick createNew', value)}
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
				<div className='adminSectionTitle'>Create New</div>
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
})(CreateNewMenu);
