const fundraiser = {
	fields: {
		enabled: { label: '', width: 10, className: 'left action' },
		price: { label: 'Amount', placeholder: '0.00', width: 15 },
		name: { label: '', placeholder: 'Add an Amount Short Description', width: 55, customFieldDefault: 'Enter any amount.' }
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
		enabled: { label: '', width: 10, className: 'left action' },
		price: { label: 'Price', placeholder: '0.00', width: 15 },
		name: { label: '', placeholder: 'Add a Ticket Short Description', width: 55, customFieldDefault: '' },
		max: { label: 'In Stock', placeholder: '0', width: 10 }
	},
	buttonGroup: { width: 10 },
	hasDefaultField: false,
	hasCustomField: false
};

const membership = {
	fields: {
		enabled: { label: '', width: 10, className: 'left action' },
		price: { label: 'Price', placeholder: '0.00', width: 15 },
		name: { label: '', placeholder: 'Add a Subscription Short Description', width: 55, customFieldDefault: '' }
	},
	buttonGroup: { width: 20 },
	hasDefaultField: false,
	hasCustomField: false
};

const sweepstake = {
	fields: {
		enabled: { label: '', width: 10, className: 'left action' },
		price: { label: 'Price', placeholder: '0.00', width: 15 },
		name: { label: '', placeholder: 'Add a Ticket Short Description', width: 55, customFieldDefault: '' },
		entries: { label: 'Entries Per Ticket', placeholder: '0', width: 10 }
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
