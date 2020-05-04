import React from 'react';
import { connect } from 'react-redux';
import Admin from './Admin';

class Layout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {

		return (
			<div>
				<Admin />
				Layout
			</div>
		)
	}

}

Layout.defaultProps = {
	breakpointWidth: 768
}

function mapStateToProps(state, props) {
	return {
	}
}

export default connect(mapStateToProps, {
})(Layout);
