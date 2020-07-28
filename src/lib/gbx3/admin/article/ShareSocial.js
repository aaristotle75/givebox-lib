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
			<div className='gbx3Centered'>
				<div className='intro'>
					<h2 style={{ marginBottom: 10 }}>Share Your {types.kind(kind).name} On Social Media</h2>
					<Social
						shareIconSize={45}
						subText={
							<>
								<div className='subText'>
									The biggest audience is on social media and sharing is one of the best ways<br /> to quickly gain visitors and raise money.
								</div>
								<div className='subText'>
									Click one of the icons below to share now.
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
