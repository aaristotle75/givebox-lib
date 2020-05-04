import * as types from './gbx3actionTypes';

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
