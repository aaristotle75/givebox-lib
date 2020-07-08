export const logo = {
	order: 1,
	name: 'logo',
	title: 'Logo',
	type: 'Media',
	field: 'orgImageURL',
	updateOptions: 'once',
	mobileRelativeBlock: false,
	mobileClassName: 'mobileRelativeBlockTop',
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
		mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 7, static: true, enabled: false }
	}
};

export const orgName = {
	order: 2,
	name: 'orgName',
	title: 'Organization Name',
	type: 'Text',
	field: 'orgName',
	mobileRelativeBlock: 2,
	mobileClassName: 'mobileRelativeBlockTop',
	options: {
		defaultFormat: '<span style="font-size:12px">{{TOKEN}}</span>'
	},
	grid: {
		desktop: { i: 'orgName', x: 1, y: 1, w: 5, h: 2, enabled: true },
		mobile: { i: 'orgName', x: 1, y: 2, w: 5, h: 2, static: true, enabled: false }
	}
};


export const title = {
	order: 3,
	name: 'title',
	title: 'Title',
	type: 'Text',
	nonremovable: true,
	field: 'title',
	updateOptions: 'string',
	mobileRelativeBlock: 1,
	mobileClassName: 'mobileRelativeBlockTop',
	options: {
		defaultFormat: '<span style="font-size:16px;">{{TOKEN}}</span>'
	},
	grid: {
		desktop: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: true },
		mobile: { i: 'title', x: 1, y: 0, w: 5, h: 2, static: true, enabled: false }
	}
};

export const media = {
	order: 4,
	name: 'media',
	title: 'Media',
	type: 'Media',
	nonremovable: true,
	field: 'imageURL',
	updateOptions: 'replace',
	mobileRelativeBlock: 3,
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
		mobile: { i: 'media', x: 0, y: 8, w: 6, h: 24, enabled: false }
	}
};

export const amounts = {
	order: 5,
	name: 'amounts',
	title: 'Amounts',
	type: 'Amounts',
	nonremovable: true,
	field: 'amounts',
	mobileRelativeBlock: 4,
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
		desktop: { i: 'amounts', x: 0, y: 2, w: 6, h: 22, enabled: true },
		mobile: { i: 'amounts', x: 0, y: 32, w: 6, h: 22, static: true, enabled: false }
	}
};

export const paymentForm = {
	order: 7,
	name: 'paymentForm',
	title: 'Payment Form',
	type: 'Form',
	nonremovable: true,
	noGrid: true,
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
				linkText: 'Send an Email Message'
			},
			hasCustomGoal: false,
			goal: 50000
		}
	}
};

export const description = {
	order: 6,
	name: 'description',
	title: 'Description',
	type: 'Text',
	subType: 'content',
	field: 'description',
	updateOptions: 'html',
	mobileRelativeBlock: 5,
	mobileNoUpdateDesktopGrid: true,
	scrollable: true,
	options: {},
	grid: {
		desktop: { i: 'description', x: 6, y: 25, w: 6, h: 4, enabled: true },
		mobile: { i: 'description', x: 0, y: 48, w: 6, h: 4, enabled: false }
	}
};

export const textBlock = {
	order: 6,
	name: 'textBlock',
	title: 'Short Text',
	type: 'Text',
	multiple: true,
	mobileRelativeBlock: 10,
	options: {
		defaultFormat: '<span>Enter Text</span>'
	},
	grid: {
		desktop: { i: 'textBlock', x: 1, y: 0, w: 12, h: 2, enabled: true },
		mobile: { i: 'textBlock', x: 1, y: 0, w: 6, h: 2, enabled: true }
	}
};

export const contentBlock = {
	order: 6,
	name: 'contentBlock',
	title: 'Text',
	type: 'Text',
	subType: 'content',
	multiple: true,
	overflow: 'visible',
	mobileRelativeBlock: 10,
	mobileNoUpdateDesktopGrid: true,
	scrollable: true,
	options: {
		defaultFormat: '<span>Enter Content</span>'
	},
	grid: {
		desktop: { i: 'contentBlock', x: 0, y: 0, w: 12, h: 4, enabled: true },
		mobile: { i: 'contentBlock', x: 0, y: 0, w: 6, h: 4, enabled: false }
	}
};

export const imageBlock = {
	order: 6,
	name: 'imageBlock',
	title: 'Image',
	type: 'Media',
	multiple: true,
	mobileRelativeBlock: 10,
	options: {
		mediaType: 'image',
		image: {
			size: 'medium',
			borderRadius: 0
		},
		video: {
			auto: true
		}
	},
	grid: {
		desktop: { i: 'imageBlock', x: 6, y: 0, w: 12, h: 24, enabled: true },
		mobile: { i: 'imageBlock', x: 0, y: 2, w: 6, h: 24, enabled: false }
	}
};

export const videoBlock = {
	order: 6,
	name: 'videoBlock',
	title: 'Video',
	type: 'Media',
	multiple: true,
	mobileRelativeBlock: 10,
	options: {
		mediaType: 'video',
		image: {
			size: 'medium',
			borderRadius: 0
		},
		video: {
			auto: true
		}
	},
	grid: {
		desktop: { i: 'videoBlock', x: 6, y: 0, w: 12, h: 24, enabled: true },
		mobile: { i: 'videoBlock', x: 0, y: 2, w: 6, h: 24, enabled: false }
	}
};

export const templates = {
	logo,
	title,
	orgName,
	amounts,
	media,
	description,
	paymentForm,
	contentBlock,
	imageBlock,
	videoBlock
};

export const blockTemplates = {
	article: {
		...templates
	},
	receipt: {
		...templates,
		imageBlock: {
			...imageBlock,
			disallowRadius: true,
			updateOptions: null,
			...{
			options: {
				...media.options,
				image: {
					...media.options.image,
					borderRadius: 0
				},
				video: null
			}}
		}
	},
	org: {
		...templates
	}
};

export default blockTemplates;
