import React, {Component} from 'react';

class Confirmation extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {

		return (
			<div className='confirmation'>
				<div className='successfulText'>
					<span className='icon icon-check green'></span> Your transaction has been processed successfully!
				</div>
				<div className='share'>
					Share
				</div>
			</div>
		)
	}
};

export default Confirmation;
