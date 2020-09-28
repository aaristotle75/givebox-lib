import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
	util
} from '../../';
import {
	getResource
} from '../../api/helpers';

class CampaignsEdit extends Component{
	constructor(props){
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {

		const {
			name
		} = this.props;

		return (
			<div className='modalWrapper'>
				<h2>Campaigns Edit {name}</h2>
			</div>
		)
	}
};

CampaignsEdit.defaultProps = {
}

function mapStateToProps(state, props) {

	const articles = util.getValue(state, 'resource.articles.data', true);

	return {
		articles
	}
}

export default connect(mapStateToProps, {
	getResource
})(CampaignsEdit);
