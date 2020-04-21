
export const defaultOptions = {
	gbxStyle: {
		maxWidth: 1000
	},
	primaryColor: '',
	button: {
		bgColor: '',
		fontSize: 16,
		borderRadius: 10,
		width: 200
	}
};

const fundraiserBlocks = [
	{
		name: 'logo',
		title: 'Logo',
		type: 'Media',
		field: 'orgImageURL',
		options: {
			maxSize: '55px',
			size: 'small',
			borderRadius: 20
		},
		grid: {
	    desktop: { i: 'logo', x: 0, y: 0, w: 1, h: 4, enabled: true },
	    mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 4, enabled: true }
  	}
	},
	{
		name: 'title',
		title: 'Title',
		type: 'Text',
		field: 'title',
		options: {
			defaultFormat: '<span style="font-size:16px;">{{TOKEN}}</span>'
		},
		grid: {
	    desktop: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: true },
	    mobile: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: true }
  	}
	},
	{
		name: 'orgName',
		title: 'Organization Name',
		type: 'Text',
		field: 'orgName',
		options: {
			defaultFormat: '<span style="color:hsl(204,4%,58%);font-size:12px">{{TOKEN}}</span>'
		},
		grid: {
	    desktop: { i: 'orgName', x: 1, y: 1, w: 5, h: 2, enabled: true },
	    mobile: { i: 'orgName', x: 1, y: 1, w: 5, h: 2, enabled: true }
  	}
	},
	{
		name: 'amounts',
		title: 'Amounts',
		type: 'Amounts',
		field: 'amounts',
		options: {
			button: {
				embedAllowed: true,
				enabled: true,
				text: 'Select Amount',
				type: 'button'
			}
		},
		grid: {
	    desktop: { i: 'amounts', x: 0, y: 2, w: 6, h: 22, enabled: true },
	    mobile: { i: 'amounts', x: 0, y: 28, w: 6, h: 20, enabled: true }
  	}
	},
	{
		name: 'media',
		title: 'Media',
		type: 'Media',
		field: 'imageURL',
		options: {
			maxSize: '360px',
			size: 'medium',
			borderRadius: 5
		},
		grid: {
	    desktop: { i: 'media', x: 6, y: 0, w: 6, h: 20, enabled: true },
	    mobile: { i: 'media', x: 0, y: 2, w: 6, h: 20, enabled: true }
  	}
	},
	{
		name: 'summary',
		title: 'Summary',
		type: 'Text',
		field: 'summary',
		options: {},
		grid: {
	    desktop: { i: 'summary', x: 6, y: 21, w: 6, h: 6, enabled: true },
	    mobile: { i: 'summary', x: 0, y: 21, w: 6, h: 6, enabled: true }
  	}
	},
	{
		name: 'paymentForm',
		title: 'Payment Form',
		type: 'Form',
		remove: false,
		grid: {
	    desktop: { i: 'form', x: 0, y: 28, w: 12, h: 40, minW: 10, enabled: true },
	    mobile: { i: 'form', x: 0, y: 48, w: 6, h: 60, minW: 4, enabled: true }
  	}
	},
	{
		name: 'content',
		title: 'Content',
		type: 'Content',
		field: 'description',
		overflow: 'visible',
		options: {},
		grid: {
	    desktop: { i: 'content', x: 0, y: 33, w: 12, h: 6, enabled: true },
	    mobile: { i: 'content', x: 0, y: 109, w: 6, h: 6, enabled: true }
  	}
	},
];

const invoiceBlocks = fundraiserBlocks;
const eventBlocks = [
	...fundraiserBlocks,
	{
		name: 'amounts',
		options: {
			button: {
				text: 'Select Tickets'
			}
		}
	}
];
const sweepstakesBlocks = fundraiserBlocks;
const membershipBlocks = fundraiserBlocks;

export const initBlocks = {
	fundraiser: fundraiserBlocks,
	invoice: invoiceBlocks,
	event: eventBlocks,
	sweepstakes: sweepstakesBlocks,
	membership: membershipBlocks
};
