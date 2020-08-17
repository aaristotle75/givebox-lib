import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types
} from '../../../';
import Social from '../../blocks/Social';

class Share extends React.Component {

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
			<div className='formSectionContainer'>
				<div className='formSection'>
					<Social
						shareIconSize={45}
						subText={
							<>
								<div className='subText'>
									Select Where You'd Like to Share Your {types.kind(kind).name}.
								</div>
							</>
						}
					/>
				</div>
			</div>
		)
	}
}

Share.defaultProps = {
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
})(Share);
