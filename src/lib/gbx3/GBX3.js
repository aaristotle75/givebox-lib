import React from 'react';
import { connect } from 'react-redux';
import Layout from './Layout';
import Admin from './Admin';
import Shop from './shop/Shop';
import {
	types,
	util,
	Loader,
	getResource,
	sendResource,
	setCustomProp,
	clearGBX3,
	updateInfo,
	updateLayouts,
	updateBlocks,
	updateDefaults,
	updateGlobals,
	updateData,
	updateCart,
	updateFees,
	updateAdmin,
	ModalRoute
} from '../';
import { defaultBlocks } from './config';
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
		this.loadGBX3 = this.loadGBX3.bind(this);
		this.reloadGBX3 = this.reloadGBX3.bind(this);
		this.setLoading = this.setLoading.bind(this);
		this.setStyle = this.setStyle.bind(this);
		this.setTracking = this.setTracking.bind(this);
		this.setRecaptcha = this.setRecaptcha.bind(this);
		this.state = {
			loading: true
		};
	}

	async componentDidMount() {
		const {
			articleID,
			editable
		} = this.props;

		const setInfo = await this.setInfo();

		if (setInfo) {
			this.loadGBX3({
				articleID,
				editable,
				display: 'layout'
			});
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
			editable
		} = this.props;

		if (prevProps.primaryColor !== this.props.primaryColor) {
			this.setStyle();
		}

		const articleIDChanged = prevProps.articleID !== this.props.articleID ? true : false;
		if (articleIDChanged) {
			const setInfo = await this.setInfo();
			if (setInfo) {
				this.loadGBX3({
					articleID,
					editable
				});
			}
		}
	}

	setLoading(loading) {
		this.setState({ loading });
	}

	async setInfo() {
		const {
			queryParams,
			info,
			orgID,
			articleID
		} = this.props;

		info.articleID = articleID;
		info.orgID = orgID;
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
		const {
			editable
		} = this.props;
		this.setLoading(true);
		const gbx3Cleared = await this.props.clearGBX3();
		if (gbx3Cleared) this.loadGBX3({ articleID, editable });
	}

	async loadGBX3({
		articleID,
		editable,
		display
	}) {

		const {
			access,
			availableBlocks
		} = this.props;

		this.setLoading(true);

		this.props.getResource('article', {
			id: [articleID],
			reload: true,
			callback: (res, err) => {
				if (!util.isEmpty(res) && !err) {
					const kind = util.getValue(res, 'kind');
					const kindID = util.getValue(res, 'kindID');
					const orgID = util.getValue(res, 'orgID');
					const orgName = util.getValue(res, 'orgName');

					if (kindID) {
						const apiName = `org${types.kind(kind).api.item}`;

						this.props.getResource('articleFeeSettings', {
							id: [articleID],
							reload: true,
							callback: (res, err) => {
								if (!err && !util.isEmpty(res)) {
									this.props.updateFees(res);
								}
							}
						});

						this.props.getResource(apiName, {
							id: [kindID],
							orgID: orgID,
							callback: (res, err) => {
								if (!err && !util.isEmpty(res)) {
									const settings = util.getValue(res, 'giveboxSettings', {});
									const primaryColor = util.getValue(settings, 'primaryColor', this.props.defaultPrimaryColor);
									const customTemplate = util.getValue(settings, 'customTemplate', {});
									const passFees = util.getValue(res, 'passFees');

									this.props.updateCart({ passFees });
									this.props.updateInfo({
										orgID,
										orgName,
										articleID,
										kindID,
										kind,
										apiName,
										display: display || 'layout'
									});

									const blocksDefault = util.getValue(defaultBlocks, kind, {});
									const blocksCustom = util.getValue(customTemplate, 'blocks', {});

									const blocks = !util.isEmpty(blocksCustom) ? blocksCustom : blocksDefault;

									const globals = {
										...this.props.globals,
										...{
											gbxStyle: {
												...this.props.globals.gbxStyle,
												primaryColor
											},
											button: {
												...this.props.globals.button,
												style: {
													...util.getValue(this.props.globals.button, 'style', {}),
													bgColor: primaryColor
												}
											}
										},
										...util.getValue(customTemplate, 'globals', {})
									};

									const layouts = {
										desktop: [],
										mobile: []
									};

									Object.entries(blocks).forEach(([key, value]) => {
										if (!util.isEmpty(value.grid)) {
											layouts.desktop.push(value.grid.desktop);
											layouts.mobile.push(value.grid.mobile);
										}
									});

									if (!util.isEmpty(blocksCustom)) {

										// Check if not all default blocks are present
										// If not, add them to the availableBlocks array
										// which are blocks available but not used
										Object.keys(blocksDefault).forEach((key) => {
											if (!(key in blocks)) availableBlocks.push(key);
										})
									}

									this.props.updateLayouts(layouts);
									this.props.updateBlocks(blocks);
									this.props.updateGlobals(globals);
									this.props.updateData(res);
									this.props.updateAdmin({
										availableBlocks,
										editable,
										hasAccessToEdit: util.getAuthorizedAccess(access, orgID)
									});
									this.props.updateDefaults({
										layouts,
										blocks,
										data: res
									});

									this.setStyle();
									this.setRecaptcha();
									this.setTracking();
								}
								this.setLoading(false);
							}
						});
					} else {
						this.setLoading(false);
					}
				} else {
					this.setLoading(false);
				}
			}
		});
	}

	setStyle() {
		const color = this.props.primaryColor;

		/*
		.gbx3Layout {
			background: #ffffff;
			background: -webkit-linear-gradient(to bottom, ${color2} 0%, #ffffff 100%);
			background: -moz-linear-gradient(to bottom, ${color2} 0%, #ffffff 100%);
			background: linear-gradient(to bottom, ${color2} 0%, #ffffff 100%);
		}
		*/

		if (color) {
			const rgb = util.hexToRgb(color);
			//const color2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .1)`;
			const color3 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .05)`;
			const color4 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .4)`;
			const styleEl = document.head.appendChild(document.createElement('style'));
			styleEl.innerHTML = `

				.radio:checked + label:after {
					border: 1px solid ${color} !important;
					background: ${color};
				}

				.dropdown .dropdown-content.customColor::-webkit-scrollbar-thumb {
					background-color: ${color};
				}

				.amountsSection::-webkit-scrollbar-thumb {
					background-color: ${color4};
				}

				.modalContent.gbx3 .ticketAmountRow,
				.modalContent.gbx3 .amountRow {
					border-left: 4px solid ${color} !important;
				}

				.modalContent.gbx3 .amountRow:hover {
					background: ${color3};
				}

				.gbx3 button.modalToTop:hover {
					background: ${color};
				}

				.modal .givebox-paymentform button.modalCloseBtn:hover .icon {
					color: ${color};
				}

				.gbx3Cart .paymentFormHeaderTitle {
					background: ${color};
					background: -webkit-linear-gradient(to bottom, ${color} 30%, ${color4} 100%);
					background: -moz-linear-gradient(to bottom, ${color} 30%, ${color4} 100%);
					background: linear-gradient(to bottom, ${color} 30%, ${color4} 100%);
				}
			`;
		}
	}

	renderDisplay() {
		const {
			info
		} = this.props;

		switch (info.display) {
			case 'shop': {
				return (
					<Shop
						reloadGBX3={this.reloadGBX3}
						{...this.props}
					/>
				)
			}

			case 'layout':
			default: {
				return (
					<Layout
						loadGBX3={this.loadGBX3}
						primaryColor={this.props.primaryColor}
					/>
				)
			}
		}
	}

	render() {

		if (this.state.loading) return <Loader msg='Initiating GBX3' />;

		return (
			<div id='gbx3' className='gbx3 gbx3Layout'>
				<Admin
					reloadGBX3={this.reloadGBX3}
				/>
				{this.renderDisplay()}
				<ModalRoute
					id='shop'
					className='gbx3 givebox-paymentform'
					effect='3DFlipVert'
					style={{ width: '70%' }}
					disallowBgClose={true}
					component={(props) => <Shop {...props} />}
				/>
			</div>
		)
	}

}

GBX3.defaultProps = {
	defaultPrimaryColor: '#4775f8',
	editable: true
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const info = util.getValue(gbx3, 'info', {});
	const admin = util.getValue(gbx3, 'admin', {});
	const availableBlocks = util.getValue(admin, 'availableBlocks', []);
	const sourceLocation = util.getValue(info, 'sourceLocation');
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const primaryColor = util.getValue(gbxStyle, 'primaryColor');

	return {
		info,
		globals,
		primaryColor,
		sourceLocation,
		availableBlocks,
		access: util.getValue(state.resource, 'access', {})
	}
}

export default connect(mapStateToProps, {
	getResource,
	sendResource,
	setCustomProp,
	clearGBX3,
	updateInfo,
	updateLayouts,
	updateBlocks,
	updateDefaults,
	updateGlobals,
	updateData,
	updateCart,
	updateFees,
	updateAdmin
})(GBX3);
