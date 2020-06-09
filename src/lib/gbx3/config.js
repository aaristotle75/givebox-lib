import blockTemplates from './blocks/blockTemplates';

const logo = blockTemplates.logo;
const title = blockTemplates.title;
const orgName = blockTemplates.orgName;
const amounts = blockTemplates.amounts;
const media = blockTemplates.media;
const content = blockTemplates.content;
const paymentForm = blockTemplates.paymentForm;

const fundraiserBlocks = {
	logo,
	title,
	orgName,
	amounts,
	media,
	content,
	paymentForm
};

const invoiceBlocks = fundraiserBlocks;

const eventBlocks = {
	logo,
	title,
	orgName,
	amounts: { ...amounts, ...{
		options: {
			...amounts.options,
			button: {
				...amounts.options.button,
				embedAllowed: false,
				enabled: true,
				text: 'Select Tickets'
			}
		}
	}},
	media,
	content,
	paymentForm
};
const sweepstakesBlocks = fundraiserBlocks;
const membershipBlocks = fundraiserBlocks;

export const defaultBlocks = {
	fundraiser: fundraiserBlocks,
	invoice: invoiceBlocks,
	event: eventBlocks,
	sweepstakes: sweepstakesBlocks,
	membership: membershipBlocks
};
