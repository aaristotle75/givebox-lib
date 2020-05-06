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



export const amountFieldsConfig = {
	fundraiser
};
