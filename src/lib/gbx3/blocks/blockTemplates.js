const logo = {
	name: 'logo',
	title: 'Logo',
	type: 'Media',
	field: 'orgImageURL',
	updateField: 'once',
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
		mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 7, static: true, enabled: true }
	}
};

const title = {
	name: 'title',
	title: 'Title',
	type: 'Text',
	nonremovable: true,
	field: 'title',
	updateField: 'string',
	options: {
		defaultFormat: '<span style="font-size:16px;">{{TOKEN}}</span>'
	},
	grid: {
		desktop: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: true },
		mobile: { i: 'title', x: 1, y: 0, w: 5, h: 2, static: true, enabled: true }
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
		mobile: { i: 'orgName', x: 1, y: 2, w: 5, h: 2, static: true, enabled: true }
	}
};

const media = {
	name: 'media',
	title: 'Media',
	type: 'Media',
	nonremovable: true,
	field: 'imageURL',
	updateField: 'multi',
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
		mobile: { i: 'media', x: 0, y: 8, w: 6, h: 24, static: true, enabled: true }
	}
};

const amounts = {
	name: 'amounts',
	title: 'Amounts',
	type: 'Amounts',
	nonremovable: true,
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
		mobile: { i: 'amounts', x: 0, y: 32, w: 6, h: 17, static: true, enabled: true }
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
			allowSharing: true,
			sendEmail: {
				enabled: true,
				linkText: 'Send an Email Message to Your Friends'
			},
		}
	}
};

const description = {
	name: 'description',
	title: 'Description',
	type: 'Text',
	subType: 'content',
	field: 'description',
	updateField: 'html',
	mobileRelativeBlock: true,
	options: {},
	grid: {
		desktop: { i: 'description', x: 6, y: 24, w: 6, h: 10, enabled: true },
		mobile: { i: 'description', x: 0, y: 48, w: 6, h: 10, enabled: false }
	}
};

const textBlock = {
	name: 'textBlock',
	title: 'Text',
	type: 'Text',
	multiple: true,
	mobileRelativeBlock: true,
	options: {
		defaultFormat: '<span>Enter Text</span>'
	},
	grid: {
		desktop: { i: 'textBlock', x: 1, y: 0, w: 6, h: 2, enabled: true },
		mobile: { i: 'textBlock', x: 1, y: 0, w: 6, h: 2, enabled: false }
	}
};

const contentBlock = {
	name: 'contentBlock',
	title: 'Content',
	type: 'Text',
	subType: 'content',
	multiple: true,
	overflow: 'visible',
	mobileRelativeBlock: true,
	options: {
		defaultFormat: '<span>Enter Content</span>'
	},
	grid: {
		desktop: { i: 'contentBlock', x: 0, y: 24, w: 6, h: 10, enabled: true },
		mobile: { i: 'contentBlock', x: 0, y: 48, w: 6, h: 10, enabled: false }
	}
};

const mediaBlock = {
	name: 'mediaBlock',
	title: 'Media',
	type: 'Media',
	multiple: true,
	field: 'imageURL',
	mobileRelativeBlock: true,
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
		desktop: { i: 'mediaBlock', x: 6, y: 0, w: 6, h: 24, enabled: true },
		mobile: { i: 'mediaBlock', x: 0, y: 2, w: 6, h: 24, enabled: false }
	}
};

const blockTemplates = {
	logo,
	title,
	orgName,
	amounts,
	media,
	description,
	paymentForm,
	textBlock,
	contentBlock,
	mediaBlock
};

export default blockTemplates;
