import React from 'react';
import { connect } from 'react-redux';
import Layout from './Layout';
import Shop from './Shop';
import Admin from './admin/Admin';
import CreateNew from './admin/CreateNew';
import {
	loadGBX3,
	setStyle,
	types,
	util,
	Loader,
	getResource,
	sendResource,
	setCustomProp,
	setLoading,
	clearGBX3,
	updateInfo,
	updateAdmin,
	ModalRoute
} from '../';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx3.scss';
import '../styles/gbx3modal.scss';
import reactReferer from 'react-referer';
import { loadReCaptcha } from 'react-recaptcha-v3';
import has from 'has';

const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY;

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
			editable
		} = this.props;

		this.props.setLoading(true);
		if (editable) this.props.updateAdmin({ editable, open: true });
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
			articleID
		} = this.props;

		if (prevProps.primaryColor !== this.props.primaryColor) {
			this.props.setStyle(this.props.primaryColor);
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
			hasAccessToEdit: util.getAuthorizedAccess(access, orgID)
		});
		this.props.updateInfo({ kind, orgID, display: 'createNew' });
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

		if (!preview) {
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
				this.props.setStyle(this.props.primaryColor);
				this.setRecaptcha();
				this.setTracking();
			}
		});
	}

	renderDisplay() {
		const {
			info
		} = this.props;

		const items = [];

		switch (info.display) {
			case 'shop': {
				items.push(
					<Shop
						reloadGBX3={this.reloadGBX3}
						{...this.props}
					/>
				)
				break;
			}

			case 'createNew': {
				items.push(
					<CreateNew

					/>
				)
				break;
			}

			case 'layout':
			default: {
				items.push(
					<Layout
						loadGBX3={this.loadGBX3}
						primaryColor={this.props.primaryColor}
					/>
				)
				break;
			}
		}
		return (
			<div id='gbx3Layout' className='gbx3Layout'>
				{items}
			</div>
		)
	}

	render() {

		const {
			hasAccessToEdit
		} = this.props;

		if (this.props.loading) return <Loader msg='Initiating GBX3' />;

		return (
			<div className='gbx3'>
				{hasAccessToEdit ?
					<Admin
						reloadGBX3={this.reloadGBX3}
					>
						{this.renderDisplay()}
					</Admin>
				:
					this.renderDisplay()
				}
				<ModalRoute
					id='shop'
					className='gbx3 givebox-paymentform'
					effect='3DFlipVert'
					style={{ width: '70%' }}
					disallowBgClose={true}
					component={(props) => <Shop {...props} reloadGBX3={this.reloadGBX3} />}
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

	return {
		loading,
		info,
		primaryColor,
		sourceLocation,
		hasAccessToEdit,
		access: util.getValue(state.resource, 'access', {})
	}
}

export default connect(mapStateToProps, {
	loadGBX3,
	setStyle,
	getResource,
	sendResource,
	setCustomProp,
	setLoading,
	clearGBX3,
	updateInfo,
	updateAdmin
})(GBX3);
