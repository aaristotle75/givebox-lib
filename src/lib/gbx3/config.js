import blockTypeTemplates from './blocks/blockTypeTemplates';

const articleLogo = blockTypeTemplates.article.logo;
const articleTitle = blockTypeTemplates.article.title;
const articleOrgName = blockTypeTemplates.article.orgName;
const amounts = blockTypeTemplates.article.amounts;
const articleMedia = blockTypeTemplates.article.media;
const articleDescription = blockTypeTemplates.article.description;
const paymentForm = blockTypeTemplates.article.paymentForm;

const fundraiserBlocks = {
	logo: articleLogo,
	title: articleTitle,
	orgName: articleOrgName,
	amounts,
	media: articleMedia,
	description: articleDescription,
	paymentForm
};

const invoiceBlocks = fundraiserBlocks;

const eventBlocks = {
	logo: articleLogo,
	title: articleTitle,
	orgName: articleOrgName,
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
	media: articleMedia,
	description: articleDescription,
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
}
