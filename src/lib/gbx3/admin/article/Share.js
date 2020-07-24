import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types
} from '../../../';
import ShareMenu from './ShareMenu';
import {
	updateInfo
} from '../../redux/gbx3actions';
import ShareSocial from './ShareSocial';
import ShareEmbed from './ShareEmbed';
import ShareEmailBlast from './ShareEmailBlast';

class Share extends React.Component {

	constructor(props) {
		super(props);
		this.renderSubStep = this.renderSubStep.bind(this);
		this.state = {
		};
	}

	renderSubStep() {
		const {
			subStep
		} = this.props;

		const item = [];
		switch (subStep) {

			case 'emailBlast': {
				item.push(
					<ShareEmailBlast key='shareEmailBlast' />
				);
				break;
			}

			case 'embed': {
				item.push(
					<ShareEmbed key='shareEmbed' />
				);
				break;
			}

			case 'social':
			default: {
				item.push(
					<ShareSocial key='shareSocial' />
				);
				break;
			}

		}


		return (
			<div>
				{item}
			</div>
		)

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
						{this.renderSubStep()}
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
	const subStep = util.getValue(admin, 'subStep');
	const openAdmin = util.getValue(admin, 'open');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');

	return {
		kind,
		globals,
		subStep,
		openAdmin,
		hasAccessToEdit
	}
}

export default connect(mapStateToProps, {
	updateInfo
})(Share);
