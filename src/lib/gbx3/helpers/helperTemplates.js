const logo = {
	blockName: 'logo',
	volunteerRestricted: false,
	title: 'Add Your Logo',
	text: 'A logo adds branded trust to your payment form.',
	style: {
		top: -10,
		left: 75
	},
	className: 'helperLeft',
	type: 'block',
	field: 'orgImageURL',
	defaultCheck: 'logo'
};

const title = {
	blockName: 'title',
	title: 'Add a Title',
	text: 'A good title...',
	style: {
		top: 50,
		left: 15
	},
	className: 'helperTop',
	type: 'block',
	field: 'title',
	defaultCheck: 'text-no-check'
};

const media = {
	blockName: 'media',
	title: 'Add an Image or Video',
	text: 'A good image or video...',
	style: {
		top: 100,
		left: -175
	},
	className: 'helperRight',
	type: 'block',
	field: 'imageURL',
	defaultCheck: 'image-no-check'
};

const themeColor = {
	blockName: 'themeColor',
	title: 'Change the Theme Color',
	text: 'Your color...',
	style: {
		top: 75,
		left: 0
	},
	className: 'helperTop',
	type: 'color',
	targetID: 'topPanelContainer',
	field: 'giveboxSettings.primaryColor',
	defaultCheck: 'color-no-check',
	skipText: 'Next'
};

const description = {
	blockName: 'description',
	title: 'Add a Description',
	text: 'A good desc...',
	style: {
		top: -20,
		left: -150
	},
	className: 'helperRight',
	type: 'block',
	field: 'description',
	defaultCheck: 'text-no-check'
};

const share = {
	blockName: 'share',
	title: 'Share Your Form',
	text: 'When you are done designing your form it is time to share it.',
	style: {
		top: 40,
		left: -100
	},
	className: 'helperTop',
	type: 'share',
	defaultCheck: 'share'
};

const amounts = {
	blockName: 'amounts',
	title: 'Add Amounts',
	text: 'Please add amounts for users to select.',
	style: {
		top: 65,
		left: 30
	},
	className: 'helperTop',
	type: 'block',
	field: 'amounts',
	defaultCheck: 'text-no-check'
};

const when = {
	blockName: 'when',
	title: 'When is Your Event',
	text: 'Let people know when the event starts and ends.',
	style: {
		top: 50,
		left: 15
	},
	className: 'helperTop',
	type: 'block',
	field: 'when',
	defaultCheck: 'text-no-check'
};

const where = {
	blockName: 'where',
	title: 'Where is Your Event',
	text: 'Let people know the location of your event.',
	style: {
		top: 50,
		left: 15
	},
	className: 'helperTop',
	type: 'block',
	field: 'where',
	defaultCheck: 'text-no-check'
};

const countdown = {
	blockName: 'countdown',
	title: 'When Does the Sweepstakes End',
	text: 'Please set an end date for your sweepstakes.',
	style: {
		top: 80,
		left: 15
	},
	className: 'helperTop',
	type: 'block',
	field: 'countdown',
	defaultCheck: 'text-no-check'
}

const helperTemplatesDefault = {
	completed: [],
	helperSidebarShow: false,
	helperOpen: false,
	helperStep: 0,
	helpersAvailable: [
		logo,
		title,
		media,
		themeColor,
		description,
		share
	]
}

export const helperTemplates = {
	article: {
		fundraiser: {
			...helperTemplatesDefault
		},
		invoice: {
			...helperTemplatesDefault
		},
		event: {
			...helperTemplatesDefault,
			helpersAvailable: [
				logo,
				title,
				when,
				where,
				{
					...amounts,
					title: 'Add Event Tickets',
					texte: 'Please add the event tickets.'
				},
				media,
				themeColor,
				description,
				share
			]
		},
		sweepstake: {
			...helperTemplatesDefault,
			helpersAvailable: [
				logo,
				title,
				countdown,
				{
					...amounts,
					title: 'Add Sweepstakes Tickets',
					texte: 'Please add the tickets users can purchase to win.'
				},
				media,
				themeColor,
				description,
				share
			]
		},
		membership: {
			...helperTemplatesDefault
		}
	},
	receipt: {

	},
	org: {

	}
}
