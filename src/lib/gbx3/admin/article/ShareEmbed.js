import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types
} from '../../../';
import {
	updateInfo
} from '../../redux/gbx3actions';

class ShareEmbed extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {

		const {
			kind
		} = this.props;

		return (
			<div className='gbx3Centered'>
				<div className='intro'>
					<h2 style={{ marginBottom: 10 }}>Embed Your {types.kind(kind).name} On Your Website</h2>
					Widget Code
				</div>
			</div>
		)
	}
}

ShareEmbed.defaultProps = {
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const kind = util.getValue(info, 'kind');

	return {
		kind
	}
}

export default connect(mapStateToProps, {
	updateInfo
})(ShareEmbed);
