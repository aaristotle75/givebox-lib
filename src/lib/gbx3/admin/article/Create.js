import React from 'react';
import { connect } from 'react-redux';
import {
	util,
	types,
	Dropdown,
	GBLink,
	Image
} from '../../../';
import CreateMenu from './CreateMenu';
import {
	createFundraiser,
	updateInfo
} from '../../redux/gbx3actions';

class Create extends React.Component {

	constructor(props) {
		super(props);
		this.onChangeKind = this.onChangeKind.bind(this);
		this.kindOptions = this.kindOptions.bind(this);
		this.state = {
		};
	}

	onChangeKind(name, value) {
		this.props.updateInfo({ kind: value });
	}

	kindOptions() {
		const {
			isVolunteer
		} = this.props;

		const options = [];
		types.kinds().forEach((value) => {
			if (isVolunteer && (value === 'invoice' || value === 'membership')) return;
			options.push({
				value,
				primaryText: types.kind(value).name
			});
		});
		return options;
	}

	render() {

		const {
			openAdmin: open,
			hasAccessToEdit,
			kind,
			isVolunteer,
			orgName
		} = this.props;


		if (!hasAccessToEdit) {
			return (
				<div className='flexCenter flexColumn centeritems'>You do not have access.</div>
			)
		}

		return (
			<>
				<div className={`leftPanel ${open ? 'open' : 'close'}`}>
					<CreateMenu />
				</div>
				<div className={`stageContainer ${open ? 'open' : 'close'}`}>
					<div className='stageAligner'>
						<div className='gbx3Centered'>
							<div className='intro'>
								<h2 style={{ marginBottom: 10 }}>Create, Design & Share!</h2>
								{isVolunteer ?
									<span>
										Start raising money for<br />
										<strong>{orgName}</strong><br />
										in three easy steps.
									</span>
								:
									<span>Start raising money in three easy steps.</span>
								}
							</div>
							<Image url={`https://s3-us-west-1.amazonaws.com/givebox/public/images/backgrounds/raise-${kind}-lg.png`} maxSize={200} alt={types.kind(kind).namePlural} />
							<div style={{ marginTop: 20 }} className='step'>
								<h2><span style={{ fontWeight: 300 }}>Step 1:</span> Create</h2>
								What kind of fundraiser do you want to start?
								<Dropdown
									className='dropdown-button'
									style={{width: '210px' }}
									name='kind'
									value={kind}
									onChange={this.onChangeKind}
									options={this.kindOptions()}
								/>
								<div className='button-group'>
									<GBLink className='button' onClick={this.props.createFundraiser}>Create {types.kind(kind).name}</GBLink>
									<GBLink className='link smallText' onClick={() => console.log('Do this later')}>Do This Later</GBLink>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}
}

Create.defaultProps = {
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const info = util.getValue(gbx3, 'info', {});
	const kind = util.getValue(info, 'kind');
	const orgName = util.getValue(info, 'orgName');
	const globals = util.getValue(gbx3, 'globals', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const isVolunteer = util.getValue(admin, 'volunteer');
	const openAdmin = util.getValue(admin, 'open');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');

	return {
		kind,
		orgName,
		globals,
		isVolunteer,
		openAdmin,
		hasAccessToEdit
	}
}

export default connect(mapStateToProps, {
	createFundraiser,
	updateInfo
})(Create);
