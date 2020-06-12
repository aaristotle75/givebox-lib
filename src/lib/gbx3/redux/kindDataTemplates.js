const primaryColor = '#4775f8';

const dataTemplate = {
	'description': '',
	'summary': '',
	'videoURL': '',
	'isEcard': null,
	'volunteer': null,
	'volunteerID': null,
	'receiptDescription': null,
	'recipientMessage': null,
	'receiptHTML': null,
	'receiptConfig': null,
	'SEOKeywords': null,
	'imageURL': null,
	'goal': 5000000,
	'passFees': true,
	'giveboxSettings': {
		'template': 'default',
		'feeOption': true,
		'videoAutoplay': false,
		'allowSelection': false,
		'primaryColor': primaryColor,
		'addressInfo': 0,
		'phoneInfo': 0,
		'workInfo': 0,
		'customData': null,
		'customTemplate': null
	},
}

const fundraiser = {
	...dataTemplate,
	title: 'New Donation Form',
	amountIndexDefault: 0,
	amountIndexCustom: 0,
	amounts: {
		list: [{
			enabled: true,
			orderBy: 0
		}]
	}
};

export const kindData = {
	fundraiser
};
