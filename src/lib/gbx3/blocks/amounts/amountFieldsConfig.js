const enabledWidth = 8;
const priceWidth = 10;
const nameWidth = 40;

const fundraiser = {
	fields: {
		enabled: { label: '', width: enabledWidth, className: 'left action' },
		price: { label: 'Amount', placeholder: '0.00', width: priceWidth },
		name: { label: 'Amount Name', placeholder: 'Add an Amount Short Description', width: 50, customFieldDefault: 'Enter any amount.' }
	},
	buttonGroup: { width: 20 },
	hasDefaultField: true,
	hasCustomField: true
};

const invoice = {
	...fundraiser
}

const event = {
	fields: {
		enabled: { label: '', width: enabledWidth, className: 'left action' },
		thumbnail: { label: '', width: 12 },
		price: { label: 'Price', placeholder: '0.00', width: priceWidth },
		name: { label: 'Ticket Name', placeholder: 'Add a Ticket Short Description', width: nameWidth, customFieldDefault: '' },
		max: { label: 'In Stock', placeholder: '0', width: 10 }
	},
	buttonGroup: { width: 10 },
	hasDefaultField: false,
	hasCustomField: false,
	hasStock: true
};

const membership = {
	fields: {
		enabled: { label: '', width: enabledWidth, className: 'left action' },
		thumbnail: { label: '', width: 12 },
		price: { label: 'Price', placeholder: '0.00', width: priceWidth },
		name: { label: 'Subscription Name', placeholder: 'Add a Subscription Short Description', width: nameWidth, customFieldDefault: '' },
		max: { label: 'Subscriptions Available', placeholder: '0', width: 10 }
	},
	buttonGroup: { width: 10 },
	hasDefaultField: false,
	hasCustomField: false,
	hasStock: true
};

const sweepstake = {
	fields: {
		enabled: { label: '', width: enabledWidth, className: 'left action' },
		thumbnail: { label: '', width: 12 },
		price: { label: 'Price', placeholder: '0.00', width: priceWidth },
		name: { label: 'Ticket Name', placeholder: 'Add a Ticket Short Description', width: nameWidth, customFieldDefault: '' },
		entries: { label: 'Entries Per Ticket', placeholder: 0, width: 10 }
	},
	buttonGroup: { width: 10 },
	hasDefaultField: false,
	hasCustomField: false,
	skipFreeEntry: true
};

export const amountFieldsConfig = {
	fundraiser,
	invoice,
	event,
	membership,
	sweepstake
};
