import * as blockTemplates from './blocks/blockTemplates';

const logo = blockTemplates.logo;
const title = blockTemplates.title;
const orgName = blockTemplates.orgName;
const amounts = blockTemplates.amounts;
const media = blockTemplates.media;
const description = blockTemplates.description;
const paymentForm = blockTemplates.paymentForm;

const fundraiserBlocks = {
	logo,
	title,
	orgName,
	amounts,
	media,
	description,
	paymentForm
};

const invoiceBlocks = fundraiserBlocks;

const eventBlocks = {
	logo,
	title,
	orgName,
	amounts: {
		...amounts,
		...{
		options: {
			...amounts.options,
			button: {
				...amounts.options.button,
				embedAllowed: false,
				enabled: true,
				text: 'Select Tickets'
			},
			extras: {
				maxQuantity: '',
				showInStock: false
			},
			recurring: {}
		}}
	},
	media,
	description,
	paymentForm
};
const sweepstakesBlocks = fundraiserBlocks;
const membershipBlocks = fundraiserBlocks;

export const defaultArticleBlocks = {
	fundraiser: fundraiserBlocks,
	invoice: invoiceBlocks,
	event: eventBlocks,
	sweepstakes: sweepstakesBlocks,
	membership: membershipBlocks
};

export const defaultReceiptBlocks = {
	orgName: {
		...orgName,
		order: 2,
		options: {
			defaultFormat: '<p style="text-align:center;font-size:12px">{{TOKEN}}</p>'
		},
	},
	title: {
		...title,
		order: 1,
		updateOptions: null,
		options: {
			defaultFormat: '<p style="text-align:center;font-size:16px">{{TOKEN}}</p>'
		},
	},
	media: {
		...media,
		disallowRadius: true,
		updateOptions: null,
		...{
		options: {
			...media.options,
			image: {
				...media.options.image,
				borderRadius: 0
			},
			video: null
		}}
	},
	description: {
		...description,
		updateOptions: null,
		options: {
			button: {}
		},
	}
};
