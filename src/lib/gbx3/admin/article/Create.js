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
	loadGBX3,
	updateInfo
} from '../../redux/gbx3actions';
import {
	getResource
} from '../../../api/helpers';

const WALLET_URL = process.env.REACT_APP_WALLET_URL;
const GBX_URL = process.env.REACT_APP_GBX_URL;

class Create extends React.Component {

	constructor(props) {
		super(props);
		this.onChangeKind = this.onChangeKind.bind(this);
		this.kindOptions = this.kindOptions.bind(this);
		this.createFundraiser = this.createFundraiser.bind(this);
		this.createFundraiserCallback = this.createFundraiserCallback.bind(this);
		this.handleVolunteerAlreadyCreatedFundraiserKind = this.handleVolunteerAlreadyCreatedFundraiserKind.bind(this);
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

	createFundraiser() {
		const {
			kind
		} = this.props;

		this.props.createFundraiser(kind, this.createFundraiserCallback);
	}

	createFundraiserCallback(res, err) {
		const {
			isVolunteer,
			volunteerID,
			userFundraisers
		} = this.props;

		if (err) {
			// If an error check if volunteer fundraiser kind was already created
			if (isVolunteer && volunteerID) {
				if (userFundraisers) {
					this.handleVolunteerAlreadyCreatedFundraiserKind();
				} else {
					this.props.getResource('userFundraisers', {
						user: volunteerID,
						callback: (res, err) => {
							this.handleVolunteerAlreadyCreatedFundraiserKind();
						}
					});
				}
			}
		}
	}

	handleVolunteerAlreadyCreatedFundraiserKind() {
		const {
			kind,
			userFundraisers,
			orgID
		} = this.props;

		const fundraisersCreatedByKind = util.getValue(userFundraisers, 'data', {}).filter(function(item) {
			if (item.orgID === orgID && item.kind === kind) {
				return true;
			}
			return false;
		});
		const alreadyCreatedKind = util.getValue(fundraisersCreatedByKind, 0, {});
		const alreadyCreatedArticleID = util.getValue(alreadyCreatedKind, 'ID');
		if (alreadyCreatedArticleID) {
			this.props.loadGBX3(alreadyCreatedArticleID);
			window.location.href = `${GBX_URL}/${alreadyCreatedArticleID}`;
		} else {
			window.location.href = WALLET_URL;
		}
	}

	render() {

		const {
			openAdmin: open,
			hasAccessToEdit,
			hasAccessToCreate,
			kind,
			isVolunteer,
			orgName
		} = this.props;


		if (!hasAccessToEdit && !hasAccessToCreate) {
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
									<GBLink className='button' onClick={this.createFundraiser}>Create {types.kind(kind).name}</GBLink>
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
	const orgID = util.getValue(info, 'orgID');
	const kind = util.getValue(info, 'kind');
	const orgName = util.getValue(info, 'orgName');
	const globals = util.getValue(gbx3, 'globals', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const isVolunteer = util.getValue(admin, 'isVolunteer');
	const volunteerID = util.getValue(admin, 'volunteerID');
	const openAdmin = util.getValue(admin, 'open');
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const hasAccessToCreate = util.getValue(admin, 'hasAccessToCreate');
	const userFundraisers = util.getValue(state, 'resource.userFundraisers');

	return {
		kind,
		orgID,
		orgName,
		globals,
		isVolunteer,
		volunteerID,
		openAdmin,
		hasAccessToEdit,
		hasAccessToCreate,
		userFundraisers
	}
}

export default connect(mapStateToProps, {
	createFundraiser,
	loadGBX3,
	updateInfo,
	getResource
})(Create);
