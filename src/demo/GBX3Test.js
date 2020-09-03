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

		const {
			queryParams,
			routeParams
		} = this.props;

		// 383102 // 1130 // 383064; // 13; // 739; // 4; //651; //735; //383071;
		const articleID = +util.getValue(routeParams, 'articleID', null);

		return (
			<div>
				<GBX
					blockType={'article'}
					orgID={185}
					articleID={articleID}
					saveCallback={this.saveCallback}
					queryParams={queryParams}
					public={false}
					project={'admin'}
					exitCallback={() => console.log('exit callback')}
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
