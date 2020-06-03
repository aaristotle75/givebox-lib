import  * as types  from './gbx3actionTypes';

export function gbx3(state = {
	saveStatus: 'done',
	info: {
		preview: false,
		breakpoint: 'desktop',
		sourceType: 'embed',
		sourceLocation: null
	},
	blocks: {},
	globals: {
		gbxStyle: {
			maxWidth: 850,
			primaryColor: ''
		},
		button: {
			embedAllowed: false,
			enabled: false,
			type: 'button',
			text: 'Button Example',
			style: {
				bgColor: '',
				fontSize: 16,
				borderRadius: 10,
				width: 200
			}
		}
	},
	admin: {
		hasAccessToEdit: false,
		editable: false,
		preventCollision: true,
		verticalCompact: true,
		outline: false
	},
	data: {},
	fees: {},
	cart: {
		open: true,
		zeroAmountAllowed: false,
		confirmation: {
			display: false,
			email: 'me@buddyteal.com',
			fullName: 'Buddy Teal',
			bankName: 'US Bank',
			cardType: 'VISA'
		},
		paymethod: 'creditcard',
		cardType: 'default',
		subTotal: 0,
		total: 0,
		fee: 0,
		passFees: false,
		acceptedTerms: true,
		items: []
	},
	order: {
		customer: {},
		paymethod: {}
	},
	defaults: {}
}, action) {
	switch (action.type) {
		case types.UPDATE_GBX3:
			return Object.assign({}, state, {
				[action.name]: action.value
			});
		case types.UPDATE_INFO:
			return Object.assign({}, state, {
				info: {
					...state.info,
					...action.info,
				}
			});
		case types.UPDATE_LAYOUTS:
			return Object.assign({}, state, {
				layouts: {
					...state.layouts,
					...action.layouts,
				}
			});
		case types.UPDATE_BLOCKS:
			return Object.assign({}, state, {
				blocks: {
					...state.blocks,
					...action.blocks,
				}
			});
		case types.UPDATE_BLOCK:
			return Object.assign({}, state, {
				blocks: {
					...state.blocks,
					[action.name]: {
						...state.blocks[action.name],
						...action.block
					}
				}
			});
		case types.UPDATE_GLOBALS:
			return Object.assign({}, state, {
				globals: {
					...state.globals,
					...action.globals,
				}
			});
		case types.UPDATE_GLOBAL:
			return Object.assign({}, state, {
				globals: {
					...state.globals,
					[action.name]: {
						...state.globals[action.name],
						...action.global
					}
				}
			});
		case types.UPDATE_DATA:
			return Object.assign({}, state, {
				data: {
					...state.data,
					...action.data,
				}
			});
		case types.UPDATE_FEES:
			return Object.assign({}, state, {
				fees: {
					...state.fees,
					...action.fees,
				}
			});
		case types.UPDATE_ADMIN:
			return Object.assign({}, state, {
				admin: {
					...state.admin,
					...action.admin,
				}
			});
		case types.UPDATE_CART:
			return Object.assign({}, state, {
				cart: {
					...state.cart,
					...action.cart
				}
			});
		case types.UPDATE_DEFAULTS:
			return Object.assign({}, state, {
				defaults: {
					...state.defaults,
					...action.defaults,
				}
			});
		case types.UPDATE_DEFAULT:
			return Object.assign({}, state, {
				defaults: {
					...state.defaults,
					[action.name]: {
						...state.defaults[action.name],
						...action.defaults
					}
				}
			});
		default:
			return state;
	}
}
