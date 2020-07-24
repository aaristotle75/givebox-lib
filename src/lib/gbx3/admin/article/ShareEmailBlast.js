import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types
} from '../../../';
import {
	updateInfo
} from '../../redux/gbx3actions';

class ShareEmailBlast extends React.Component {

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
					<h2 style={{ marginBottom: 10 }}>Email Blast Your {types.kind(kind).name}</h2>
					<div className='subText'>
						Sending an email blast to your contacts is a great way to re-engage your audience.
					</div>
					Email Blast
				</div>
			</div>
		)
	}
}

ShareEmailBlast.defaultProps = {
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
})(ShareEmailBlast);
