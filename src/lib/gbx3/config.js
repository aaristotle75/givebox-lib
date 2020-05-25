const logo = {
	name: 'logo',
	title: 'Logo',
	type: 'Media',
	field: 'orgImageURL',
	options: {
		mediaType: 'image',
		image: {
			maxSize: '55px',
			size: 'small',
			borderRadius: 20
		}
	},
	grid: {
		desktop: { i: 'logo', x: 0, y: 0, w: 1, h: 7, enabled: true },
		mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 7, enabled: true }
	}
};

const title = {
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
};

const orgName = {
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
};

const amounts = {
	name: 'amounts',
	title: 'Amounts',
	type: 'Amounts',
	field: 'amounts',
	options: {
		button: {
			embedAllowed: true,
			enabled: false,
			text: 'Select Amount',
			style: {

			}
		},
		recurring: {
			allowed: true,
			enabled: true
		}
	},
	grid: {
		desktop: { i: 'amounts', x: 0, y: 2, w: 6, h: 17, enabled: true },
		mobile: { i: 'amounts', x: 0, y: 28, w: 6, h: 17, enabled: true }
	}
};

const media = {
	name: 'media',
	title: 'Media',
	type: 'Media',
	field: 'imageURL',
	options: {
		mediaType: 'image',
		image: {
			size: 'medium',
			borderRadius: 5
		},
		video: {
			auto: true
		}
	},
	grid: {
		desktop: { i: 'media', x: 6, y: 0, w: 6, h: 24, enabled: true },
		mobile: { i: 'media', x: 0, y: 2, w: 6, h: 24, enabled: true }
	}
};

const summary = {
	name: 'summary',
	title: 'Summary',
	type: 'Text',
	field: 'summary',
	options: {},
	grid: {
		desktop: { i: 'summary', x: 6, y: 21, w: 6, h: 10, enabled: true },
		mobile: { i: 'summary', x: 0, y: 21, w: 6, h: 10, enabled: true }
	}
};

const content = {
	name: 'content',
	title: 'Content',
	type: 'Text',
	subType: 'content',
	field: 'description',
	overflow: 'visible',
	options: {
		defaultFormat: '<span>About Your Fundraiser</span>'
	},
	grid: {
		desktop: { i: 'content', x: 0, y: 24, w: 12, h: 10, enabled: true },
		mobile: { i: 'content', x: 0, y: 109, w: 6, h: 10, enabled: true }
	}
};

const paymentForm = {
	name: 'paymentForm',
	title: 'Payment Form',
	type: 'Form',
	remove: false,
	options: {
		button: {
			enabled: true,
			text: 'GIVE NOW',
			style: {}
		},
		form: {
			echeck: true,
			feeOption: false,
			passFees: true,
			addressInfo: 0,
			phoneInfo: 0,
			workInfo: 0,
			noteInfo: 0,
			notePlaceholder: '',
			allowSelection: true,
			sendEmail: {
				enabled: true,
				linkText: 'Send an Email Message to Your Friends'
			},
		}
	}
};

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
	summary,
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
