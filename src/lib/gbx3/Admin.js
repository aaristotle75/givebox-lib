import React from 'react';
import { connect } from 'react-redux';

class Admin extends React.Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {

		return (
			<div>
				Admin
			</div>
		)
	}

}

Admin.defaultProps = {
}

function mapStateToProps(state, props) {
	return {
	}
}

export default connect(mapStateToProps, {
})(Admin);
