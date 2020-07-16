import React from 'react';
import { connect } from 'react-redux';
import Layout from './Layout';
import Admin from './admin/Admin';
import {
	util,
	Loader,
	setCustomProp,
	setLoading,
	clearGBX3,
	updateInfo,
	updateAdmin,
	loadGBX3,
	setStyle
} from '../';
import { sendResource } from '../api/helpers';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx3.scss';
import '../styles/gbx3modal.scss';
import reactReferer from 'react-referer';
import { loadRecaptcha } from 'react-recaptcha-v3';
import has from 'has';

const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY;
const ENV = process.env.REACT_APP_ENV;

class GBX3 extends React.Component {

	constructor(props) {
		super(props);
		this.setInfo = this.setInfo.bind(this);
		this.loadCreateNew = this.loadCreateNew.bind(this);
		this.loadGBX3 = this.loadGBX3.bind(this);
		this.reloadGBX3 = this.reloadGBX3.bind(this);
		this.setTracking = this.setTracking.bind(this);
		this.setRecaptcha = this.setRecaptcha.bind(this);
		this.state = {
		};
	}

	async componentDidMount() {
		const {
			articleID,
			editable,
			hasAccessToEdit
		} = this.props;

		this.props.setLoading(true);
		if ((editable && (hasAccessToEdit) || hasAccessToEdit)) {
			this.props.updateAdmin({ editable, open: true });
		} else {
			this.props.updateAdmin({ editable: false });
		}

		const setInfo = await this.setInfo();

		if (setInfo) {
			if (articleID) {
				this.loadGBX3(articleID);
			} else {
				this.loadCreateNew();
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

	loadCreateNew() {
		const {
			access,
			kind
		} = this.props;

		const orgID = util.getValue(access, 'orgID');
		this.props.updateAdmin({
			step: 'create',
			hasAccessToEdit: util.getAuthorizedAccess(access, orgID)
		});
		this.props.updateInfo({ kind });
		this.props.setLoading(false);
	}

	async setInfo() {
		const {
			queryParams,
			info,
			orgID,
			articleID,
			kind
		} = this.props;

		info.articleID = articleID;
		info.orgID = orgID;
		if (kind) info.kind = kind;
		info.preview = has(queryParams, 'preview') ? true : false;
		info.signup = has(queryParams, 'signup') ? true : false;
		info.locked = has(queryParams, 'locked') ? true : false;
		info.noFocus = has(queryParams, 'noFocus') ? true : false;
		info.receipt = has(queryParams, 'receipt') ? true : false;
		info.noloaderbg = has(queryParams, 'noloaderbg') ? true : false;
		info.deactivated = has(queryParams, 'deactivated') ? true : false;
		info.ebToken = util.getValue(queryParams, 'eb', null);
		info.ebEmail = util.getValue(queryParams, 'm', null);

		const sourceLocation = reactReferer.referer();
		info.sourceLocation = this.props.sourceLocation || sourceLocation;

		const infoUpdated = await this.props.updateInfo(info);

		if (has(queryParams, 'public')) {
			this.props.updateAdmin({ publicView: true });
		}
		if (infoUpdated) return true;
	}

	setRecaptcha() {
		const {
			preview
		} = this.props.info;

		const bodyEl = document.getElementsByTagName('body')[0];
		if (!preview) {
			bodyEl.classList.add('live');
			loadRecaptcha(RECAPTCHA_KEY);
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

		const {
			primaryColor
		} = this.props;

		this.props.loadGBX3(articleID, (res, err) => {
			if (!err && !util.isEmpty(res)) {
				this.props.setStyle({ primaryColor });
				this.setRecaptcha();
				this.setTracking();
			}
		});
	}

	renderStage() {
		const {
			hasAccessToEdit,
			publicView
		} = this.props;

		const items = [];

		if (hasAccessToEdit && !publicView) {
			items.push(
				<Admin
					key={'admin'}
					loadGBX3={this.loadGBX3}
					reloadGBX3={this.reloadGBX3}
				/>
			)
		} else {
			items.push(
				<Layout
					key={'public'}
					loadGBX3={this.loadGBX3}
					reloadGBX3={this.reloadGBX3}
					primaryColor={this.props.primaryColor}
				/>
			)
		}

		return items;
	}

	render() {

		if (this.props.loading) return <Loader msg='Initiating GBX3' />;

		return (
			<div className='gbx3'>
				{this.renderStage()}
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
	const publicView = util.getValue(admin, 'publicView');

	return {
		globals,
		loading,
		info,
		primaryColor,
		sourceLocation,
		hasAccessToEdit,
		publicView,
		access: util.getValue(state.resource, 'access', {})
	}
}

export default connect(mapStateToProps, {
	loadGBX3,
	setStyle,
	sendResource,
	setCustomProp,
	setLoading,
	clearGBX3,
	updateInfo,
	updateAdmin
})(GBX3);
