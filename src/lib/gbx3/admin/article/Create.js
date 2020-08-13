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
		this.renderKindDisplay = this.renderKindDisplay.bind(this);
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

	renderKindDisplay() {
		const {
			isVolunteer
		} = this.props;

		const items = [];
		types.kinds().forEach((value) => {
			if (isVolunteer && (value === 'invoice' || value === 'membership')) return;
			items.push(
				<div key={value} className='createKindItem'>
					<Image url={`https://s3-us-west-1.amazonaws.com/givebox/public/images/backgrounds/raise-${value}-lg.png`} maxSize={130} alt={types.kind(value).namePlural} />
					<span className='createKindItemText'>
						{types.kind(value).name}
					</span>
				</div>
			);
		});

		return (
			<div className='createKindSection'>
				<span className='intro'>What kind of payment form would you like to create?</span>
				<div className='createKindList'>
					{items}
				</div>
			</div>
		);
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
			<div className='createStep'>
				<div className={`leftPanel ${open ? 'open' : 'close'}`}>
					<CreateMenu />
				</div>
				<div className={`stageContainer ${open ? 'open' : 'close'}`}>
					<div className='stageAligner'>
						<div className='gbx3Centered'>
							<div className='stepSection'>
								<div className='intro'>
									{isVolunteer ?
										<span>
											Raise money for<br />
											<strong>{orgName}</strong><br />
											in three easy steps.
										</span>
									:
										<span>Collect money in three simple steps.</span>
									}
								</div>
								<div className='steps'>
									<div className='step'><span className='icon icon-check-circle'></span> Design Form</div>
									<div className='step'><span className='icon icon-check-circle'></span> Customize Receipt</div>
									<div className='step'><span className='icon icon-check-circle'></span> Share Form</div>
								</div>
								<div class="shapeBottom" data-negative="false">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
										<path class="shapeBottom-fill" d="M421.9,6.5c22.6-2.5,51.5,0.4,75.5,5.3c23.6,4.9,70.9,23.5,100.5,35.7c75.8,32.2,133.7,44.5,192.6,49.7
										c23.6,2.1,48.7,3.5,103.4-2.5c54.7-6,106.2-25.6,106.2-25.6V0H0v30.3c0,0,72,32.6,158.4,30.5c39.2-0.7,92.8-6.7,134-22.4
										c21.2-8.1,52.2-18.2,79.7-24.2C399.3,7.9,411.6,7.5,421.9,6.5z"></path>
									</svg>
								</div>
							</div>
							{this.renderKindDisplay()}
						</div>
					</div>
				</div>
			</div>
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
