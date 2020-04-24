const fundraiser = {
	fields: {
		enabled: { label: '', width: 10, className: 'left action' },
		price: { label: 'Amount', Placeholder: '0.00', width: 15 },
		name: { label: '', Placeholder: 'Add an Amount Description', width: 55 },
		default: { label: '', width: 10 }
	},
	delete: true,
	disableSort: true,
	defaultField: true,
	customField: true
};



export const amountFieldsConfig = {
	fundraiser
};
