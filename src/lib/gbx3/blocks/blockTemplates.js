const text = {
	name: 'textBlock',
	title: 'Text',
	type: 'Text',
	options: {
		defaultFormat: '<span>Enter Text</span>'
	},
	grid: {
		desktop: { i: 'textBlock', x: 1, y: 0, w: 5, h: 2, enabled: true },
		mobile: { i: 'textBlock', x: 1, y: 0, w: 5, h: 2, enabled: true }
	}
};

const content = {
	name: 'contentBlock',
	title: 'Content',
	type: 'Text',
	subType: 'content',
	overflow: 'visible',
	options: {
		defaultFormat: '<span>Enter Content</span>'
	},
	grid: {
		desktop: { i: 'contentBlock', x: 0, y: 24, w: 12, h: 10, enabled: true },
		mobile: { i: 'contentBlock', x: 0, y: 109, w: 6, h: 10, enabled: true }
	}
};

const media = {
	name: 'mediaBlock',
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
		desktop: { i: 'mediaBlock', x: 6, y: 0, w: 6, h: 24, enabled: true },
		mobile: { i: 'mediaBlock', x: 0, y: 2, w: 6, h: 24, enabled: true }
	}
};

const blockTemplates = {
	text,
	content,
	media
};

export default blockTemplates;
