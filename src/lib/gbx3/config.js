import blockTemplates from './blocks/blockTemplates';

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
			}
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
	logo,
	orgName,
	title: {
		...title,
		updateOptions: null
	},
	media: {
		...media,
		updateOptions: null,
		...{
		options: {
			...media.options,
			video: null
		}}
	},
	description: {
		...description,
		updateOptions: null
	}
}
