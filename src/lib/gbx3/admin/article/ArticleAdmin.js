import React from 'react';
import Design from './Design';
import Create from './Create';

class ArticleAdmin extends React.Component {

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
			case 'create': {
				return (
					<Create />
				)
			}

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

export default ArticleAdmin;
