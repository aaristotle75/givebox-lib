import * as types from './gbx3actionTypes';
import {
	util,
	sendResource
} from '../';

export function updateGBX3(name, value) {
	return {
		type: types.UPDATE_GBX3,
		name,
		value
	}
}

export function updateInfo(info) {
	return {
		type: types.UPDATE_INFO,
		info
	}
}

export function updateLayouts(layouts = {}) {
	return {
		type: types.UPDATE_LAYOUTS,
		layouts
	}
}

export function updateBlocks(blocks = {}) {
	return {
		type: types.UPDATE_BLOCKS,
		blocks
	}
}

export function updateBlock(name, block) {
	return {
		type: types.UPDATE_BLOCK,
		name,
		block
	}
}

export function updateDefaults(defaults = {}) {
	return {
		type: types.UPDATE_DEFAULTS,
		defaults
	}
}

export function updateDefault(name, defaults) {
	return {
		type: types.UPDATE_DEFAULT,
		name,
		defaults
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

function saveCart(cart) {
	return {
		type: types.UPDATE_CART,
		cart
	}
}

export function updateCart(cart) {
	return async (dispatch, getState) => {
		const cartUpdated = await dispatch(saveCart(cart));
		if (cartUpdated) dispatch(calcCart());
	}
}

export function updateCartItem(unitID, item = {}, multiItems = true) {
	return async (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const fees = util.getValue(gbx3, 'fees', {});
		const info = util.getValue(gbx3, 'info', {});
		const articleID = util.getValue(info, 'articleID');
		const cart = util.getValue(gbx3, 'cart', {});
		const items = util.getValue(cart, 'items', []);
		const index = items.findIndex(i => i.unitID === unitID);
		item.articleID = articleID;
		item.fees = fees;
		item.amountFormatted = item.amount/100;
		cart.zeroAmountAllowed = util.getValue(item, 'zeroAmountAllowed', false);
		if (index === -1) {
			if (item.quantity > 0) {
				if (multiItems) items.push(item);
				else {
					// If multiItems is false find and remove the previous item per articleID
					const removeIndex = items.findIndex(i => i.articleID === articleID);
					if (removeIndex !== -1) items.splice(removeIndex, 1);
					items.push(item);
				}
			}
		} else {
			if (item.quantity > 0) items[index] = { ...items[index], ...item };
			else items.splice(index, 1);
		}
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
		const items = util.getValue(cart, 'items', []);
		cart.subTotal = 0;
		cart.fee = 0;
		cart.total = 0;
		if (!util.isEmpty(items)) {
			Object.entries(items).forEach(([key, value]) => {
				cart.subTotal = cart.subTotal + value.amountFormatted;
				cart.fee = cart.fee + dispatch(calcFee(value.amount, value.fees));
			});
		}
		cart.total = (cart.subTotal + cart.fee).toFixed(2);
		dispatch(saveCart(cart));
	}
}

export function saveGBX3(obj = {}, isSending = false, callback, updateLayout) {

	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const gbxData = util.getValue(gbx3, 'data', {});
		const settings = util.getValue(gbxData, 'giveboxSettings', {});
		const info = util.getValue(gbx3, 'info', {});
		const blocks = util.getValue(gbx3, 'blocks', {});
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
			...obj
		};

		if (updateLayout) {
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

			dispatch(updateLayouts(layouts));
		}
		dispatch(updateGBX3('saveStatus', 'saving'));
		dispatch(sendResource(util.getValue(info, 'apiName'), {
			id: [util.getValue(info, 'kindID')],
			orgID: util.getValue(info, 'orgID'),
			data,
			method: 'patch',
			callback: (res, err) => {
				dispatch(updateGBX3('saveStatus', 'done'));
				if (callback) callback(res, err);
			},
			isSending
		}));
	}
}

export function resetGBX3() {
	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const info = util.getValue(gbx3, 'info', {});
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
				dispatch(updateBlocks({}));
				dispatch(updateGlobals({}));
				dispatch(updateData(res));
			},
			isSending: true
		}));
	}
}
