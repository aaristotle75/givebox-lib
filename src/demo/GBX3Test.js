import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	util
} from '../lib';
import GBX from '../lib/gbx3/GBX3';

class GBXTest extends Component {

	constructor(props) {
		super(props);
		this.state = {
			//id: 587,
			id: 383060,
			//id: 4
		};
		this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	saveCallback(id, data, blocks) {
		console.log('execute saveCallback', id, data, blocks);
	}

	render() {

		const articleID = null; //383061;

		return (
			<div>
				<GBX
					articleID={articleID}
					saveCallback={this.saveCallback}
					queryParams={this.props.queryParams}
				/>
			</div>
		)
	}
}

function mapStateToProps(state, props) {

	return {
	}
}

export default connect(mapStateToProps, {
})(GBXTest);
