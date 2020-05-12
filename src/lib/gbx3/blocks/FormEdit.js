import React, { Component } from 'react';
import { connect } from 'react-redux';

class FormEdit extends Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	render() {

		return (
			<>
				Form Edit
			</>
		)
	}
}

FormEdit.defaultProps = {
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
})(FormEdit);
