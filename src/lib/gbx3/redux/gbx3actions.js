import * as types from './gbx3actionTypes';
import {
	util,
	types as types2,
	getResource,
	sendResource
} from '../../';
import { defaultAmountHeight } from '../blocks/amounts/amountsStyle';
import blockTypeTemplates from '../blocks/blockTypeTemplates';
import { defaultArticleBlocks } from '../config';
import { createData } from '../admin/createTemplates';

export function updateGBX3(name, value) {
	return {
		type: types.UPDATE_GBX3,
		name,
		value
	}
}

export function setLoading(loading) {
	return {
		type: types.SET_LOADING,
		loading
	}
}

export function clearGBX3() {
	return {
		type: types.CLEAR_GBX3
	}
}

export function updateInfo(info) {
	return {
		type: types.UPDATE_INFO,
		info
	}
}

export function updateLayouts(blockType, layouts = {}) {
	return {
		type: types.UPDATE_LAYOUTS,
		layouts,
		blockType
	}
}

export function updateBlocks(blockType, blocks = {}) {
	return {
		type: types.UPDATE_BLOCKS,
		blocks,
		blockType
	}
}

export function updateBlock(blockType, name, block) {
	return {
		type: types.UPDATE_BLOCK,
		name,
		block,
		blockType
	}
}

export function addBlock(type, w = 0, h = 0, ref) {
	return (dispatch, getState) => {
		const current = ref ? ref.current : null;
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const info = util.getValue(gbx3, 'info', {});
		const blockType = util.getValue(info, 'blockType');
		const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
		const admin = util.getValue(gbx3, 'admin', {});
		const availableBlocks = util.getValue(admin, `availableBlocks.${blockType}`, []);
		const blockTemplates = util.getValue(blockTypeTemplates, blockType);
		const newBlock = util.getValue(blockTemplates, type, {});
		if (!util.isEmpty(newBlock)) {
			let blockName = util.getValue(newBlock, 'name', type);
			if (blockName in blocks) {
				const hash = util.uniqueHash();
				blockName = `${blockName}-${hash}`;
				newBlock.name = blockName;
				if (!util.isEmpty(util.getValue(newBlock, 'grid'))) {
					newBlock.grid.desktop.i = blockName;
					newBlock.grid.mobile.i = blockName;
				}
			}
			const y = Math.ceil(parseFloat(h / 10));
			//const positionX = w - current.offsetLeft;
			//const x = +(positionX / current.clientWidth) >= .5 ? 6 : 0;
			const x = 0;

			if (!util.isEmpty(util.getValue(newBlock, 'grid'))) {
				newBlock.grid.desktop.y = y;
				newBlock.grid.desktop.x = x;
			}

			if (!newBlock.multiple) {
				const index = availableBlocks.indexOf(blockName)
				availableBlocks.splice(index, 1);
			}
			dispatch(updateAvailableBlocks(availableBlocks));
			dispatch(updateBlock(blockType, blockName, newBlock));
		}
	}
}

export function removeBlock(name) {
	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const info = util.getValue(gbx3, 'info', {});
		const blockType = util.getValue(info, 'blockType');
		const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
		const admin = util.getValue(gbx3, 'admin', {});
		const availableBlocks = util.getValue(admin, `availableBlocks.${blockType}`, []);
		const block = util.getValue(blocks, name, {});
		if (!util.getValue(block, 'multiple')) {
			if (!(name in availableBlocks)) availableBlocks.push(name);
		}
		dispatch(updateAvailableBlocks(availableBlocks));
		dispatch(updateAdmin({ editBlock: '' }));
		dispatch(deleteBlock(name, blockType));
	}
}

function deleteBlock(name, blockType) {
	return {
		type: types.REMOVE_BLOCK,
		name,
		blockType
	}
}

export function updateGlobals(globals = {}) {
	return {
		type: types.UPDATE_GLOBALS,
		globals
	}
}

export function updateGlobal(name, global) {
	return {
		type: types.UPDATE_GLOBAL,
		name,
		global
	}
}

export function updateData(data) {
	return {
		type: types.UPDATE_DATA,
		data
	}
}

export function updateFees(fees) {
	return {
		type: types.UPDATE_FEES,
		fees
	}
}

export function updateAdmin(admin) {
	return {
		type: types.UPDATE_ADMIN,
		admin
	}
}

export function updateAvailableBlocks(available) {
	return (dispatch, getState) => {
		const blockType = util.getValue(getState(), 'gbx3.info.blockType');
		const availableBlocks = util.getValue(getState(), 'gbx3.admin.availableBlocks', []);
		availableBlocks[blockType] = available;
		dispatch(updateAdmin({ availableBlocks }));
	}
}

export function toggleAdminLeftPanel() {
	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const admin = util.getValue(gbx3, 'admin', {});
		const open = util.getValue(admin, 'open');
		dispatch(updateAdmin({ open: open ? false : true }));
	}
}

export function updateConfirmation(confirmation) {
	return {
		type: types.UPDATE_CONFIRMATION,
		confirmation
	}
}

export function resetConfirmation() {
	return {
		type: types.RESET_CONFIRMATION
	}
}

function saveCart(cart) {
	return {
		type: types.UPDATE_CART,
		cart
	}
}

export function resetCart() {
	return {
		type: types.RESET_CART
	}
}

export function updateCart(cart) {
	return async (dispatch, getState) => {
		const cartUpdated = await dispatch(saveCart(cart));
		if (cartUpdated) dispatch(calcCart());
	}
}

export function updateCartItem(unitID, item = {}) {
	return async (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const fees = util.getValue(gbx3, 'fees', {});
		const info = util.getValue(gbx3, 'info', {});
		const articleID = util.getValue(info, 'articleID');
		const orgID = util.getValue(info, 'orgID');
		const orgName = util.getValue(info, 'orgName');
		const articleKind = util.getValue(info, 'kind');
		const kindID = util.getValue(info, 'kindID');
		const cart = util.getValue(gbx3, 'cart', {});
		const items = util.getValue(cart, 'items', []);
		const numOfItems = items.length;
		const index = items.findIndex(i => i.unitID === unitID);
		const quantity = parseInt(util.getValue(item, 'quantity', 1));
		const amount = parseInt(quantity * util.getValue(item, 'priceper', 0));
		const allowMultiItems = util.getValue(item, 'allowMultiItems', true);

		item.amount = amount;
		item.articleID = articleID;
		item.orgName = orgName;
		item.orgID = orgID;
		item.articleKind = articleKind;
		item.kindID = kindID;
		item.fees = fees;
		item.amountFormatted = amount/100;
		item.sourceType = util.getValue(info, 'sourceType');
		item.sourceLocation = util.getValue(info, 'sourceLocation');

		cart.zeroAmountAllowed = util.getValue(item, 'zeroAmountAllowed', false);
		if (index === -1) {
			if (allowMultiItems && +amount > 0) items.push(item);
			else {
				// If multiItems is false find and remove the previous item per articleID
				const removeIndex = items.findIndex(i => i.articleID === articleID);
				if (removeIndex !== -1) items.splice(removeIndex, 1);
				if (+amount > 0) items.push(item);
			}
		} else {
			if (+amount > 0) items[index] = { ...items[index], ...item };
			else items.splice(index, 1);
		}
		if (!item.orderBy) item.orderBy = numOfItems + 1;
		const cartUpdated = await dispatch(saveCart(cart));
		if (cartUpdated) dispatch(calcCart());
	}
}

function calcFee(amount = 0, fees = {}) {
	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const cart = util.getValue(gbx3, 'cart', {});
		const passFees = util.getValue(cart, 'passFees');
		const paymethod = util.getValue(cart, 'paymethod', {});
		const cardType = util.getValue(cart, 'cardType');
		const feePrefix = cardType === 'amex' && paymethod === 'creditcard' ? 'amexFnd' : 'fnd';
		const pctFee = util.getValue(fees, `${feePrefix}PctFee`, 290);
		const fixFee = amount !== 0 ? util.getValue(fees, `${feePrefix}FixFee`, 29) : 0;
		const percent = +((pctFee/10000).toFixed(4)*parseFloat(amount/100));
		const fixed = +((fixFee/100).toFixed(2));
		const fee = passFees ? +((percent + fixed).toFixed(2)) : 0;
		return fee;
	}
}

export function calcCart() {
	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const cart = util.getValue(gbx3, 'cart', {});
		const passFees = util.getValue(cart, 'passFees');
		const items = util.getValue(cart, 'items', []);
		cart.subTotal = 0;
		cart.fee = 0;
		cart.total = 0;
		if (!util.isEmpty(items)) {
			Object.entries(items).forEach(([key, value]) => {
				value.passFees = passFees;
				cart.subTotal = cart.subTotal + value.amountFormatted;
				cart.fee = cart.fee + dispatch(calcFee(value.amount, value.fees));
			});
		}
		cart.total = (cart.subTotal + cart.fee).toFixed(2);
		dispatch(saveCart(cart));
	}
}

export function saveGBX3(options = {}) {

	const opts = {
		obj: {},
		isSending: false,
		callback: null,
		updateLayout: false,
		...options
	};

	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const gbxData = util.getValue(gbx3, 'data', {});
		const settings = util.getValue(gbxData, 'giveboxSettings', {});
		const info = util.getValue(gbx3, 'info', {});
		const blockType = util.getValue(info, 'blockType');
		const blocks = util.getValue(gbx3, `blocks.${blockType}`, {});
		const globals = util.getValue(gbx3, 'globals', {});
		const data = {
			...gbxData,
			giveboxSettings: {
				...settings,
				customTemplate: {
					blocks,
					globals
				}
			},
			...opts.obj
		};

		if (opts.updateLayout) {
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

			dispatch(updateLayouts(blockType, layouts));
		}
		dispatch(updateGBX3('saveStatus', 'saving'));
		dispatch(sendResource(util.getValue(info, 'apiName'), {
			id: [util.getValue(info, 'kindID')],
			orgID: util.getValue(info, 'orgID'),
			data,
			method: 'patch',
			callback: (res, err) => {
				dispatch(updateGBX3('saveStatus', 'done'));
				if (opts.callback) opts.callback(res, err);
			},
			isSending: opts.isSending
		}));
	}
}

export function resetGBX3(callback) {
	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const info = util.getValue(gbx3, 'info', {});
		const blockType = util.getValue(info, 'blockType');
		const data = {
			...util.getValue(gbx3, 'data', {}),
			giveboxSettings: {
				customTemplate: {
					blocks: {},
					globals: {}
				}
			}
		};

		dispatch(sendResource(util.getValue(info, 'apiName'), {
			id: [util.getValue(info, 'kindID')],
			orgID: util.getValue(info, 'orgID'),
			data,
			method: 'patch',
			callback: (res, err) => {
				dispatch(updateBlocks(blockType, {}));
				dispatch(updateGlobals({}));
				dispatch(updateData(res));
				window.location.reload();
			},
			isSending: true
		}));
	}
}

export function processTransaction(data, callback) {
	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const articleData = util.getValue(gbx3, 'data', {});
		const receiptHTML = util.getValue(articleData, 'receiptHTML');
		const version = !util.isEmpty(receiptHTML) ? `&version=3&primary=${util.getValue(data, 'articleID')}` : '';

		const grecaptcha = window.grecaptcha;
		grecaptcha.ready(function() {
			grecaptcha.execute(process.env.REACT_APP_RECAPTCHA_KEY, {action: 'payment'})
			.then(function(token) {
				dispatch(sendResource('purchaseOrder', {
					data,
					callback,
					query: `rc=${token}${version}`
				}));
			})
		});
	}
}

export function createFundraiser(createKind, callback) {

	return (dispatch, getState) => {
		dispatch(setLoading(true));
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const info = util.getValue(gbx3, 'info', {});
		const kind = createKind || util.getValue(info, 'kind', 'fundraiser');
		const orgID = util.getValue(info, 'orgID');
		const resourceName = `org${types2.kind(kind).api.list}`;
		const data = createData[kind];
		dispatch(sendResource(resourceName, {
			orgID,
			data,
			callback: (res, err) => {
				if (!err && !util.isEmpty(res)) {
					dispatch(loadGBX3(res.articleID, () => {
						dispatch(updateInfo({ display: 'article', kind }));
						dispatch(updateAdmin({ step: 'design', editable: true }));
						if (callback) callback(res, err);
					}));
				} else {
					if (callback) callback(res, err);
				}
			}
		}));
	}
}

export function loadGBX3(articleID, callback) {

	return async (dispatch, getState) => {

		dispatch(setLoading(true));
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const resource = util.getValue(getState(), 'resource', {});
		const access = util.getValue(resource, 'access', {});
		const globalsState = util.getValue(gbx3, 'globals', {});
		const admin = util.getValue(gbx3, 'admin', {});
		const info = util.getValue(gbx3, 'info', {});
		const blockType = util.getValue(info, 'blockType');
		const availableBlocks = util.getValue(admin, `availableBlocks.${blockType}`, [], true);

		dispatch(getResource('article', {
			id: [articleID],
			reload: true,
			callback: (res, err) => {
				if (!util.isEmpty(res) && !err) {
					const kind = util.getValue(res, 'kind');
					const kindID = util.getValue(res, 'kindID');
					const orgID = util.getValue(res, 'orgID');
					const orgName = util.getValue(res, 'orgName');
					const hasAccessToEdit = util.getAuthorizedAccess(access, orgID);

					if (kindID) {
						const apiName = `org${types2.kind(kind).api.item}`;
						dispatch(getResource('articleFeeSettings', {
							id: [articleID],
							reload: true,
							callback: (res, err) => {
								if (!err && !util.isEmpty(res)) {
									dispatch(updateFees(res));
								}
							}
						}));

						dispatch(getResource(apiName, {
							id: [kindID],
							reload: true,
							orgID: orgID,
							callback: (res, err) => {
								if (!err && !util.isEmpty(res)) {
									const settings = util.getValue(res, 'giveboxSettings', {});
									const primaryColor = util.getValue(settings, 'primaryColor', '#4775f8');
									const customTemplate = util.getValue(settings, 'customTemplate', {});
									const passFees = util.getValue(res, 'passFees');

									dispatch(updateCart({ passFees }));
									dispatch(updateInfo({
										orgID,
										orgName,
										articleID,
										kindID,
										kind,
										apiName,
										display: 'article',
										orgImage: util.getValue(access, 'orgImage')
									}));

									const blocksDefault = util.getValue(defaultArticleBlocks, kind, {});
									const globalsCustom = util.getValue(customTemplate, 'globals', {});
									const gbxStyleCustom = util.getValue(globalsCustom, 'gbxStyle', {});
									const blocksCustom = util.getValue(customTemplate, 'blocks', {});
									const blocks = !util.isEmpty(blocksCustom) ? blocksCustom : blocksDefault;

									const globals = {
										...globalsState,
										...{
											gbxStyle: {
												...util.getValue(globalsState, 'gbxStyle', {}),
												...gbxStyleCustom,
												primaryColor
											},
											button: {
												...util.getValue(globalsState, 'button', {}),
												style: {
													...util.getValue(util.getValue(globalsState, 'button', {}), 'style', {}),
													bgColor: primaryColor
												}
											}
										},
										...util.getValue(customTemplate, 'globals', {})
									};

									if (!util.isEmpty(blocksCustom)) {
										// Check if not all default blocks are present
										// If not, add them to the availableBlocks array
										// which are blocks available but not used
										Object.keys(blocksDefault).forEach((key) => {
											if (!(key in blocks)) availableBlocks.push(key);
										})
									} else {
										// Check how many amounts and set amounts grid height
										const amountsObj = util.getValue(res, types2.kind(kind).amountField, {});
										const amountsList = util.getValue(amountsObj, 'list', []);
										const amountsListEnabled = amountsList.filter(a => a.enabled === true);
										const amountsSectionHeight = defaultAmountHeight(amountsListEnabled.length);
										blocks.amounts.grid.desktop.h = amountsSectionHeight;
									}

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

									dispatch(updateLayouts(blockType, layouts));
									dispatch(updateBlocks(blockType, blocks));
									dispatch(updateGlobals(globals));
									dispatch(updateData(res));
									dispatch(updateAvailableBlocks(availableBlocks));
									dispatch(updateAdmin({
										hasAccessToEdit,
										editable: hasAccessToEdit ? true : false,
										open: hasAccessToEdit ? true : false,
										step: 'design'
									}));
									callback(res, err)
								}
								dispatch(setLoading(false));
							}
						}));
					} else {
						dispatch(setLoading(false));
					}
				} else {
					dispatch(setLoading(false));
				}
			}
		}));
	}
}

export function setTextStyle(color) {

}

export function setStyle(options = {}) {

	const opts = {
		primaryColor: null,
		textColor: null,
		pageColor: null,
		pageOpacity: null,
		pageRadius: null,
		backgroundColor: null,
		backgroundImage: null,
		backgroundOpacity: null,
		backgroundBlur: null,
		placeholderColor: null,
		...options
	};

	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const globals = util.getValue(gbx3, 'globals', {});
		const gbxStyle = util.getValue(globals, 'gbxStyle', {});
		const info = util.getValue(gbx3, 'info', {});
		const breakpoint = util.getValue(info, 'breakpoint');
		const color = opts.primaryColor || util.getValue(gbxStyle, 'primaryColor');
		const textColor = opts.textColor || util.getValue(gbxStyle, 'textColor', '#253655');
		const pageColor = opts.pageColor || util.getValue(gbxStyle, 'pageColor', '#ffffff');
		const pageOpacity = opts.pageOpacity || util.getValue(gbxStyle, 'pageOpacity', 1);
		const pageRadius = opts.pageRadius || util.getValue(gbxStyle, 'pageRadius', 10);
		const backgroundColor = opts.backgroundColor || util.getValue(gbxStyle, 'backgroundColor', color);
		const backgroundImage = opts.backgroundImage || util.getValue(gbxStyle, 'backgroundImage');
		const backgroundOpacity = opts.backgroundOpacity || util.getValue(gbxStyle, 'backgroundOpacity', 1);
		const backgroundBlur = opts.backgroundBlur || util.getValue(gbxStyle, 'backgroundBlur', 0);
		const placeholderColor = opts.placeholderColor || util.getValue(gbxStyle, 'placeholderColor');

		let textStyleStr = '';
		let colorStyleStr = '';
		let pageColorStyleStr = '';
		let backgroundColorStyleStr = '';
		let styleInnerHTML = '';

		if (textColor) {
			const rgb = util.hexToRgb(placeholderColor || textColor);
			const textColor2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${placeholderColor ? 1 : .5})`;
			textStyleStr = `
				.gbx3Layout,
				.gbx3Layout label,
				.gbx3Layout .label {
					color: ${textColor};
				}
				.gbx3Layout input {
					color: ${textColor};
				}
				.gbx3Layout .amountInput .moneyAmount {
					color: ${textColor};
				}
				.gbx3 .paymentFormTabs .panel button {
					color: ${textColor};
				}
				.gbx3Layout .radio + label {
					border: 1px solid ${textColor};
				}

				.gbx3Layout input::-webkit-input-placeholder {
					color: ${textColor2};
				}
				.gbx3Layout input::-moz-placeholder {
					color: ${textColor2};
				}
				.gbx3Layout input::-ms-input-placeholder {
					color: ${textColor2};
				}

				.gbx3 .givebox-paymentform input {
					border-bottom: 1px solid ${textColor2};
				}

				.gbx3Layout input {
					border-bottom: 1px solid ${textColor2};
				}
				.gbx3Layout .moneyAmount.noValue .symbol {
					color: ${textColor2};
				}

				.gbx3 .givebox-paymentform .dropdown button:not(.link) {
					border-bottom: 1px solid ${textColor2};
				}

				.gbx3 .gbx3Layout .dropdown button .label.idle {
					color: ${textColor2} !important;
				}

				.gbx3 .gbx3Layout .dropdown button .icon {
					 color: ${textColor2};
				}

				.gbx3 .givebox-paymentform .input-bottom.idle {
					 background: ${textColor2};
				}

			`;
		}

		if (pageColor) {
			const rgb = util.hexToRgb(pageColor);
			const pageColor1 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pageOpacity})`;

			pageColorStyleStr = `
				.gbx3 .gbx3Container:not(.gbx3ReceiptContainer) {
					border-radius: ${+(pageRadius)}px;
					background: ${pageColor1};
				}
				.gbx3Layout .radio + label {
					background-color: ${pageColor1};
				}
				.gbx3Layout .radio:checked + label {
					background-color: ${pageColor1};
				}
			`;
		}

		let backgroundImageInnerHTML = '';
		if (backgroundImage && breakpoint === 'desktop') {
			backgroundImageInnerHTML = `
				.gbx3LayoutBackground {
						background-image: url("${backgroundImage}");
						background-position: center;
						background-repeat: no-repeat;
						background-size: cover;
						filter: blur(${backgroundBlur}px);
						-webkit-filter: blur(${backgroundBlur}px);
				}
			`;
		}

		if (backgroundColor || color) {
			const bgColor = backgroundColor || color;
			const rgb = util.hexToRgb(bgColor);
			const bgColor1 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundOpacity})`;
			const bgColor2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundOpacity})`;
			backgroundColorStyleStr = `
				.gbx3Layout:not(.gbx3ReceiptLayout) {
					background: ${bgColor1};
					background: -webkit-linear-gradient(to bottom, ${bgColor1} 0%, ${bgColor2} 100%);
					background: -moz-linear-gradient(to bottom, ${bgColor1} 0%, ${bgColor2} 100%);
					background: linear-gradient(to bottom, ${bgColor1} 0%, ${bgColor2} 100%);
				}
			`;
		}

		if (color) {
			const rgb = util.hexToRgb(color);
			//const color2 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .1)`;
			const color3 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .05)`;
			const color4 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .4)`;
			colorStyleStr = `

				.gbx3Layout .radio:checked + label:after {
					border: 1px solid ${color} !important;
					background: ${color};
				}

				.gbx3Layout .dropdown .dropdown-content.customColor::-webkit-scrollbar-thumb {
					background-color: ${color};
				}

				.gbx3Layout .amountsSection::-webkit-scrollbar-thumb {
					background-color: ${color4};
				}

				.modalContent.gbx3 .ticketAmountRow,
				.modalContent.gbx3 .amountRow {
					border-left: 4px solid ${color} !important;
				}

				.modalContent.gbx3 .amountRow:hover {
					background: ${color3};
				}

				.gbx3Layout button.modalToTop:hover {
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

				.gbx3Shop button.link {
					color: ${color};
				}
			`;
		}

		if (pageColorStyleStr) styleInnerHTML = styleInnerHTML + pageColorStyleStr;
		if (textStyleStr) styleInnerHTML = styleInnerHTML + textStyleStr;
		if (colorStyleStr) styleInnerHTML = styleInnerHTML + colorStyleStr;
		if (backgroundColorStyleStr) styleInnerHTML = styleInnerHTML + backgroundColorStyleStr;
		if (backgroundImageInnerHTML) styleInnerHTML = styleInnerHTML + backgroundImageInnerHTML;

		if (styleInnerHTML) {
			const styleEl = document.head.appendChild(document.createElement('style'));
			styleEl.innerHTML = styleInnerHTML;
		}
	}
}

export function resetGBX3Receipt(callback) {
	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const info = util.getValue(gbx3, 'info', {});
		const data = {
			receiptHTML: '',
			receiptConfig: {}
		};

		dispatch(sendResource(util.getValue(info, 'apiName'), {
			id: [util.getValue(info, 'kindID')],
			orgID: util.getValue(info, 'orgID'),
			data,
			method: 'patch',
			callback: (res, err) => {
				dispatch(updateData(res));
			},
			isSending: true
		}));
	}
}
