import  * as types  from './gbx3actionTypes';

export function gbx3(state = {
	kind: null,
	blocks: {},
	options: {},
	data: {}
}, action) {
	switch (action.type) {
		case types.UPDATE_GBX3:
			return Object.assign({}, state, {
				...state,
				[action.key]: action.value
			});
		case types.UPDATE_BLOCKS:
			return Object.assign({}, state, {
				...state,
				blocks: {
					...state.blocks,
					...action.blocks,
				}
			});
		case types.UPDATE_BLOCK:
			return Object.assign({}, state, {
				...state,
				blocks: {
					...state.blocks,
					[action.name]: {
						...state.blocks[action.name],
						...action.block
					}
				}
			});
		case types.UPDATE_OPTIONS:
			return Object.assign({}, state, {
				...state,
				options: {
					...state.options,
					...action.options,
				}
			});
		case types.UPDATE_OPTION:
			return Object.assign({}, state, {
				...state,
				options: {
					...state.options,
					[action.name]: {
						...state.options[action.name],
						...action.option
					}
				}
			});
		case types.UPDATE_DATA:
			return Object.assign({}, state, {
				...state,
				data: {
					...state.data,
					...action.data,
				}
			});
		default:
			return state;
	}
}
