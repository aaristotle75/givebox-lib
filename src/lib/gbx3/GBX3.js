import React from 'react';
import { connect } from 'react-redux';
import Layout from './Layout';
import Admin from './admin/Admin';
import {
	util,
	Loader,
	ModalRoute
} from '../';
import { getResource, sendResource } from '../api/helpers';
import { setAccess } from '../api/actions';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx3.scss';
import '../styles/gbx3modal.scss';
import reactReferer from 'react-referer';
import { loadReCaptcha } from 'react-recaptcha-v3';
import has from 'has';
import {
	setLoading,
	clearGBX3,
	updateInfo,
	updateAdmin,
	loadGBX3,
	setStyle
} from './redux/gbx3actions';
import {
	setCustomProp
} from '../api/actions';
import GBXEntry from '../common/GBXEntry';
import AvatarMenu from './admin/AvatarMenu';
import Share from './admin/article/Share';

const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY;
const ENV = process.env.REACT_APP_ENV;
const ENTRY_URL = process.env.REACT_APP_ENTRY_URL;

class GBX3 extends React.Component {

	constructor(props) {
		super(props);
		this.setInfo = this.setInfo.bind(this);
		this.loadCreateNew = this.loadCreateNew.bind(this);
		this.loadGBX3 = this.loadGBX3.bind(this);
		this.reloadGBX3 = this.reloadGBX3.bind(this);
		this.setTracking = this.setTracking.bind(this);
		this.setRecaptcha = this.setRecaptcha.bind(this);
		this.renderStage = this.renderStage.bind(this);
		this.onClickVolunteerFundraiser = this.onClickVolunteerFundraiser.bind(this);
		this.signupCallback = this.signupCallback.bind(this);
		this.authenticateVolunteer = this.authenticateVolunteer.bind(this);
		this.determineWhatToLoad = this.determineWhatToLoad.bind(this);
		this.state = {
		};
	}

	async componentDidMount() {
		const {
			articleID,
			editable,
			hasAccessToEdit,
			isVolunteer,
			orgID,
			orgName
		} = this.props;

		this.props.setLoading(true);
		if ((editable && hasAccessToEdit) || hasAccessToEdit) {
			this.props.updateAdmin({ editable });
		} else {
			this.props.updateAdmin({ editable: false });
		}

		const setInfo = await this.setInfo();

		if (setInfo) {
			if (articleID && !isVolunteer) {
				this.loadGBX3(articleID);
			} else {
				if (isVolunteer) {
					const infoUpdated = await this.props.updateInfo({
						orgID: orgID || ENV === 'production' ? 585 : 185,
						orgName: orgName || ENV === 'production' ? 'Givebox' : 'Service Dogs of America'
					});
					if (infoUpdated) this.onClickVolunteerFundraiser();
				} else {
				this.loadCreateNew();
				}
			}
		}
		window.addEventListener('scroll',() => {
			window.scrollTop = Math.max(1, Math.min(window.scrollTop,
			window.scrollHeight - window.clientHeight - 1));
			}
		);
	}

	async componentDidUpdate(prevProps) {
		const {
			articleID,
			primaryColor
		} = this.props;

		if (prevProps.primaryColor !== this.props.primaryColor) {
			this.props.setStyle({ primaryColor });
		}

		const articleIDChanged = prevProps.articleID !== this.props.articleID ? true : false;
		if (articleIDChanged) {
			const setInfo = await this.setInfo();
			if (setInfo) {
				this.loadGBX3(articleID);
			}
		}
	}

	determineWhatToLoad() {

	}

	authenticateVolunteer(res, err) {
		if (err) {
			window.location.href = ENTRY_URL;
		} else {
			this.props.setAccess(res, () => {
				this.loadCreateNew(true);
			});
		}
	}

	signupCallback(e) {
		if (e.data === 'signupCallback') {
			this.props.getResource('session', {
				reload: true,
				callback: (res, err) => {
					this.authenticateVolunteer(res, err);
				}
			});
		}
	}

	onClickVolunteerFundraiser() {
		const {
			access
		} = this.props;

		if (util.isEmpty(access)) {
			// open signup
			window.addEventListener('message', this.signupCallback, false);
			GBXEntry.init([{ env: ENV, url: `${ENTRY_URL}/signup/wallet?modal=true&callback=true`, auto: true }]);
		} else {
			// proceed to create fundraiser
			this.loadCreateNew(true);
		}
	}

	loadCreateNew(isVolunteer) {
		const {
			access,
			kind
		} = this.props;

		const orgID = util.getValue(access, 'orgID');
		const obj = {
			step: 'create',
			publicView: false,
			hasAccessToCreate: isVolunteer ? true : util.getAuthorizedAccess(access, orgID),
			hasAccessToEdit: util.getAuthorizedAccess(access, orgID)
		};

		if (isVolunteer) {
			obj.isVolunteer = true;
			obj.volunteerID = util.getValue(access, 'userID', null);
		}
		this.props.updateAdmin(obj);
		this.props.updateInfo({ kind, stage: 'admin' });
		this.props.setLoading(false);
	}

	async setInfo() {
		const {
			queryParams,
			info,
			orgID,
			articleID,
			template,
			modal
		} = this.props;

		info.template = template;
		info.articleID = articleID;
		info.orgID = orgID;
		info.modal = has(queryParams, 'modal') || modal ? true : false;
		info.preview = has(queryParams, 'preview') ? true : false;
		info.signup = has(queryParams, 'signup') ? true : false;
		info.locked = has(queryParams, 'locked') ? true : false;
		info.noFocus = has(queryParams, 'noFocus') ? true : false;
		info.receipt = has(queryParams, 'receipt') ? true : false;
		info.noloaderbg = has(queryParams, 'noloaderbg') ? true : false;
		info.deactivated = has(queryParams, 'deactivated') ? true : false;
		info.ebToken = util.getValue(queryParams, 'eb', null);
		info.ebEmail = util.getValue(queryParams, 'm', null);
		info.autoCreate = util.getValue(queryParams, 'autoCreate');

		const sourceLocation = reactReferer.referer();
		info.sourceLocation = this.props.sourceLocation || sourceLocation;
		info.project = util.getValue(queryParams, 'project', this.props.project || null);

		if (this.props.exitURL) info.exitURL = this.props.exitURL;

		if (has(queryParams, 'public') || this.props.public) {
			this.props.updateAdmin({ publicView: true });
		}

		const infoUpdated = await this.props.updateInfo(info);
		if (infoUpdated) return true;
	}

	setRecaptcha() {
		const {
			preview
		} = this.props.info;

		const bodyEl = document.getElementsByTagName('body')[0];
		if (!preview) {
			bodyEl.classList.add('live');
			loadReCaptcha(RECAPTCHA_KEY);
		} else {
			bodyEl.classList.add('preview');
		}
	}

	setTracking() {
		const {
			info,
			articleID
		} = this.props;

		const {
			preview,
			ebToken,
			ebEmail
		} = info;

		if (!preview && ENV === 'production') {
			const data = {
				type: 'details',
				articleID,
				ebToken,
				ebEmail
			};
			this.props.sendResource('articleView', {
				data,
				id: [articleID],
				isSending: false
			});
		}
	}

	async reloadGBX3(articleID) {
		this.props.setLoading(true);
		const gbx3Cleared = await this.props.clearGBX3();
		if (gbx3Cleared) this.loadGBX3(articleID);
	}

	loadGBX3(articleID) {

		this.props.loadGBX3(articleID, (res, err) => {
			if (!err && !util.isEmpty(res)) {
				this.props.setStyle();
				this.setRecaptcha();
				this.setTracking();
			}
		});
	}

	renderStage() {
		const {
			hasAccessToCreate,
			hasAccessToEdit,
			publicView
		} = this.props;

		const items = [];

		if ((hasAccessToCreate || hasAccessToEdit) && !publicView) {
			items.push(
				<Admin
					key={'admin'}
					loadGBX3={this.loadGBX3}
					reloadGBX3={this.reloadGBX3}
					exitCallback={this.props.exitCallback}
					loadCreateNew={this.loadCreateNew}
				/>
			)
		} else {
			items.push(
				<Layout
					key={'public'}
					loadGBX3={this.loadGBX3}
					reloadGBX3={this.reloadGBX3}
					primaryColor={this.props.primaryColor}
					onClickVolunteerFundraiser={this.onClickVolunteerFundraiser}
				/>
			)
		}

		return items;
	}

	render() {

		if (this.props.loading) return <Loader msg='Initiating GBX3' />;

		return (
			<div id='gbx3MainWrapper' className='gbx3'>
				{this.renderStage()}
				<ModalRoute
					className='gbx3'
					id='avatarMenu'
					effect='3DFlipVert'
					style={{ width: '40%' }}
					disallowBgClose={false}
					component={(props) => <AvatarMenu />}
				/>
				<ModalRoute
					className='gbx3'
					id='share'
					effect='3DFlipVert'
					style={{ width: '80%' }}
					disallowBgClose={false}
					draggable={false}
					draggableTitle={``}
					component={(props) => <Share />}
				/>
			</div>
		)
	}
}

GBX3.defaultProps = {
	kind: 'fundraiser'
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const loading = util.getValue(gbx3, 'loading');
	const globals = util.getValue(gbx3, 'globals', {});
	const info = util.getValue(gbx3, 'info', {});
	const sourceLocation = util.getValue(info, 'sourceLocation');
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const primaryColor = util.getValue(gbxStyle, 'primaryColor');
	const admin = util.getValue(gbx3, 'admin', {});
	const hasAccessToEdit = util.getValue(admin, 'hasAccessToEdit');
	const hasAccessToCreate = util.getValue(admin, 'hasAccessToCreate');
	const publicView = util.getValue(admin, 'publicView');

	return {
		globals,
		loading,
		info,
		primaryColor,
		sourceLocation,
		hasAccessToEdit,
		hasAccessToCreate,
		publicView,
		access: util.getValue(state.resource, 'access', {})
	}
}

export default connect(mapStateToProps, {
	loadGBX3,
	setStyle,
	setAccess,
	getResource,
	sendResource,
	setCustomProp,
	setLoading,
	clearGBX3,
	updateInfo,
	updateAdmin
})(GBX3);
