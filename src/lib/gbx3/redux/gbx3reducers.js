import  * as types  from './gbx3actionTypes';
import { util } from '../../';

const defaultCart = {
	processing: false,
	open: false,
	zeroAmountAllowed: false,
	paymethod: 'creditcard',
	cardType: 'default',
	subTotal: 0,
	total: 0,
	fee: 0,
	passFees: false,
	acceptedTerms: true,
	items: [],
	customer: {}
};

const defaultConfirmation = {
	email: 'jane_smitht@test.com',
	firstname: 'Jane',
	lastname: 'Smith',
	paymethod: 'creditCard',
	bankName: 'US Bank',
	cardType: 'VISA',
	cartTotal: 100
}

const defaultStyle = {
	maxWidth: 850,
	primaryColor: '',
	bgColor: '',
	textColor: '#253655',
	pageColor: '#ffffff',
	pageRadius: 10,
	pageOpacity: 1,
	backgroundColor: '',
	placeholderColor: ''
}

const defaultButton = {
	embedAllowed: false,
	enabled: false,
	type: 'button',
	text: 'Button Example',
	style: {
		textColor: '#ffffff',
		bgColor: '',
		fontSize: 16,
		borderRadius: 10,
		width: 200
	}
}

const availableBlocks = [
	'textBlock',
	'contentBlock',
	'mediaBlock'
];

export function gbx3(state = {
	loading: true,
	saveStatus: 'done',
	info: {
		stage: 'public',
		display: 'shop',
		preview: false,
		breakpoint: 'desktop',
		sourceType: 'embed',
		sourceLocation: null
	},
	blocks: {
		org: {},
		article: {},
		receipt: {}
	},
	layouts: {
		org: {},
		article: {},
		receipt: {}
	},
	globals: {
		gbxStyle: {
			...defaultStyle
		},
		orgStyle: {
			...defaultStyle
		},
		button: {
			...defaultButton
		}
	},
	data: {},
	admin: {
		editBlock: '',
		open: false,
		step: 'create',
		createType: 'receipt',
		previewDevice: 'desktop',
		previewMode: false,
		publicView: false,
		editable: false,
		hasAccessToEdit: false,
		preventCollision: true,
		verticalCompact: false,
		outline: false,
		availableBlocks: {
			article: availableBlocks,
			org: availableBlocks,
			receipt: availableBlocks
		}
	},
	fees: {},
	cart: defaultCart,
	confirmation: defaultConfirmation,
	defaults: {}
}, action) {
	switch (action.type) {
		case types.UPDATE_GBX3:
			return Object.assign({}, state, {
				[action.name]: action.value
			});
		case types.SET_LOADING:
			return Object.assign({}, state, {
				loading: action.loading
			});
		case types.CLEAR_GBX3:
			return Object.assign({}, state, {
				blocks: {},
				defaults: {},
				data: {},
				fees: {},
				globals: {},
				layouts: {}
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
					[action.blockType]: {
						...state.layouts[action.blockType],
						...action.layouts,
					}
				}
			});
		case types.UPDATE_BLOCKS:
			return Object.assign({}, state, {
				blocks: {
					...state.blocks,
					[action.blockType]: {
						...state.blocks[action.blockType],
					...action.blocks
					}
				}
			});
		case types.UPDATE_BLOCK:
			return Object.assign({}, state, {
				blocks: {
					...state.blocks,
					[action.blockType]: {
						...state.blocks[action.blockType],
						[action.name]: {
							...state.blocks[action.name],
							...action.block
						}
					}
				}
			});
		case types.REMOVE_BLOCK:
			const blocks = util.getValue(state, `blocks.${action.blockType}`, {});
			delete blocks[action.name];
			return Object.assign({}, state, {
				blocks: {
					...state.blocks,
					[action.blockType]: {
						...blocks
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
		case types.RESET_CART:
			return Object.assign({}, state, {
				cart: {
					...defaultCart,
					customer: {},
					items: []
				}
			});
		case types.UPDATE_CONFIRMATION:
			return Object.assign({}, state, {
				confirmation: {
					...state.confirmation,
					...action.confirmation
				}
			});
		case types.RESET_CONFIRMATION:
			return Object.assign({}, state, {
				confirmation: defaultConfirmation
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
