import React from 'react';
import Design from './Design';

class OrgAdmin extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {

		const {
			step
		} = this.props;

		switch (step) {

			case 'design':
			default: {
				return (
					<Design
						reloadGBX3={this.props.reloadGBX3}
						loadGBX3={this.props.loadGBX3}
					/>
				)
			}
		}
	}
}

export default OrgAdmin;
