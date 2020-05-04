import * as types from './gbx3actionTypes';

export function updateGBX3(key, value) {
	return {
		type: types.UPDATE_GBX3,
		key: key,
		value: value
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

export function updateOptions(options = {}) {
	return {
		type: types.UPDATE_OPTIONS,
		options
	}
}

export function updateOption(name, option) {
	return {
		type: types.UPDATE_OPTION,
		name,
		option
	}
}

export function updateData(data) {
	return {
		type: types.UPDATE_DATA,
		data
	}
}
