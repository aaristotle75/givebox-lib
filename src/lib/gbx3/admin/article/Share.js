import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	updateInfo
} from '../../../';
import ShareMenu from './ShareMenu';

class Share extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {

		const {
			openAdmin: open,
			hasAccessToEdit,
			kind
		} = this.props;


		if (!hasAccessToEdit) {
			return (
				<div className='flexCenter flexColumn centeritems'>You do not have access.</div>
			)
		}

		return (
			<>
				<div className={`leftPanel ${open ? 'open' : 'close'}`}>
					<ShareMenu />
				</div>
				<div className={`stageContainer ${open ? 'open' : 'close'}`}>
					<div className='stageAligner'>
						<div className='gbx3CreateNew'>
							<div className='intro'>
								<h2 style={{ marginBottom: 10 }}>Share {types.kind(kind).name}</h2>
								Share to social and send an email blast.
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}
}

Share.defaultProps = {
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const kind = util.getValue(info, 'kind');
	const globals = util.getValue(gbx3, 'globals', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const openAdmin = util.getValue(admin, 'open');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');

	return {
		kind,
		globals,
		openAdmin,
		hasAccessToEdit
	}
}

export default connect(mapStateToProps, {
	updateInfo
})(Share);
