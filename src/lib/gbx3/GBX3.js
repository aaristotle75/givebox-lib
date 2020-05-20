import React from 'react';
import { connect } from 'react-redux';
import Layout from './Layout';
import Admin from './Admin';
import Cart from './payment/Cart';
import Shop from './shop/Shop';
import {
	types,
	util,
	Loader,
	getResource,
	setCustomProp,
	updateInfo,
	updateLayouts,
	updateBlocks,
	updateDefaults,
	updateGlobals,
	updateData,
	updateAdmin,
	ModalRoute
} from '../';
import { defaultBlocks } from './config';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/gbx3.scss';
import '../styles/gbx3modal.scss';

class GBX3 extends React.Component {

	constructor(props) {
		super(props);
		this.loadGBX3 = this.loadGBX3.bind(this);
		this.setStyle = this.setStyle.bind(this);
		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		const {
			orgID,
			articleID,
			kindID,
			kind,
			editable
		} = this.props;

		this.loadGBX3({
			orgID,
			articleID,
			kindID,
			kind,
			editable
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.primaryColor !== this.props.primaryColor) {
			this.setStyle();
		}
	}

	loadGBX3({
		orgID,
		articleID,
		kindID,
		kind,
		editable
	}) {

		const {
			access
		} = this.props;

		const apiName = `org${types.kind(kind).api.item}`;

		if (kindID) {
			this.props.getResource(apiName, {
				id: [kindID],
				orgID: orgID,
				callback: (res, err) => {
					if (!err && !util.isEmpty(res)) {
						const settings = util.getValue(res, 'giveboxSettings', {});
						const primaryColor = util.getValue(settings, 'primaryColor', this.props.defaultPrimaryColor);
						const customTemplate = util.getValue(settings, 'customTemplate', {});

						this.props.updateInfo({
							orgID,
							articleID,
							kindID,
							kind,
							apiName
						});

						const blocks = {
							...util.getValue(defaultBlocks, kind, {}),
							...util.getValue(customTemplate, 'blocks', {})
						};

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

						this.props.updateLayouts(layouts);
						this.props.updateBlocks(blocks);
						this.props.updateGlobals(globals);
						this.props.updateData(res);
						this.props.updateAdmin({
							editable,
							hasAccessToEdit: util.getAuthorizedAccess(access, orgID)
						});
						this.props.updateDefaults({
							layouts,
							blocks,
							data: res
						});
						this.setStyle();
					}
					this.setState({ loading: false });
				}
			});
		} else {
			this.setState({ loading: false });
		}
	}

	setStyle() {
		const color = this.props.primaryColor;

		if (color) {
			const rgb = util.hexToRgb(color);
			const color2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .1)`;
			const color3 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .05)`;
			const styleEl = document.head.appendChild(document.createElement('style'));
			styleEl.innerHTML = `
				.radio:checked + label:after {
					border: 1px solid ${color} !important;
					background: ${color};
				}

				.dropdown .dropdown-content.customColor::-webkit-scrollbar-thumb {
					background-color: ${color};
				}

				.amountsSection ::-webkit-scrollbar-thumb {
					background-color: ${color2};
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

			`;
		}
	}

	render() {

		if (this.state.loading) return <Loader msg='Initiating GBX3' />;

		return (
			<div className='gbx3'>
				<Admin
					loadGBX3={this.loadGBX3}
				/>
				<Layout
					loadGBX3={this.loadGBX3}
				/>
				<ModalRoute
					id='cart'
					className='gbx3 givebox-paymentform'
					effect='3DFlipVert'
					style={{ width: '70%' }}
					disallowBgClose={true}
					component={(props) => <Cart {...props} />}
				/>
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
	breakpointWidth: 768,
	defaultPrimaryColor: '#4775f8',
	editable: false
}

function mapStateToProps(state, props) {

	const gbx3 = util.getValue(state, 'gbx3', {});
	const globals = util.getValue(gbx3, 'globals', {});
	const gbxStyle = util.getValue(globals, 'gbxStyle', {});
	const primaryColor = util.getValue(gbxStyle, 'primaryColor');

	return {
		access: util.getValue(state.resource, 'access', {}),
		globals,
		primaryColor
	}
}

export default connect(mapStateToProps, {
	getResource,
	setCustomProp,
	updateInfo,
	updateLayouts,
	updateBlocks,
	updateDefaults,
	updateGlobals,
	updateData,
	updateAdmin
})(GBX3);
