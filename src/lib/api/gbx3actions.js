import * as types from './gbx3actionTypes';
import {
	util,
	sendResource
} from '../';

export function updateInfo(info) {
	return {
		type: types.UPDATE_INFO,
		info
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

export function updateAdmin(admin) {
	return {
		type: types.UPDATE_ADMIN,
		admin
	}
}

export function updateCart(cart) {
	return {
		type: types.UPDATE_CART,
		cart
	}
}

export function updateOrder(order) {
	return {
		type: types.UPDATE_ORDER,
		order
	}
}

export function saveGBX3(obj = {}, isSending = false, callback) {

	return (dispatch, getState) => {
		const gbx3 = util.getValue(getState(), 'gbx3', {});
		const info = util.getValue(gbx3, 'info', {});
		const blocks = util.getValue(gbx3, 'blocks', {});
		const globals = util.getValue(gbx3, 'globals', {});
		const data = {
			...util.getValue(gbx3, 'data', {}),
			giveboxSettings: {
				customTemplate: {
					blocks,
					globals
				}
			},
			...obj
		};

		dispatch(sendResource(util.getValue(info, 'apiName'), {
			id: [util.getValue(info, 'kindID')],
			orgID: util.getValue(info, 'orgID'),
			data,
			method: 'patch',
			callback,
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
