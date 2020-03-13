 const fundraiserBlocks = [
  {
		name: 'logo',
		type: 'Media',
		field: 'orgImageURL',
		grid: {
	    desktop: { i: 'logo', x: 0, y: 0, w: 1, h: 4, enabled: true },
	    mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 4, enabled: true }
  	}
	},
	{
		name: 'title',
		type: 'Text',
		field: 'title',
		defaultFormat: '<h2>{{TOKEN}}</h2>',
		grid: {
	    desktop: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: true },
	    mobile: { i: 'title', x: 1, y: 0, w: 5, h: 2, enabled: true }
  	}
	},
	{
		name: 'orgName',
		type: 'Text',
		field: 'orgName',
		defaultFormat: '<span style="color:hsl(204,4%,58%);font-size:12px">{{TOKEN}}</span>',
		grid: {
	    desktop: { i: 'orgName', x: 1, y: 1, w: 5, h: 2, enabled: true },
	    mobile: { i: 'orgName', x: 1, y: 1, w: 5, h: 2, enabled: true }
  	}
	},
	{
		name: 'media',
		type: 'Media',
		field: 'imageURL',
		grid: {
	    desktop: { i: 'media', x: 6, y: 0, w: 6, h: 20, enabled: true },
	    mobile: { i: 'media', x: 0, y: 2, w: 6, h: 20, enabled: true }
  	}
	},
	{
		name: 'summary',
		type: 'Text',
		field: 'summary',
		grid: {
	    desktop: { i: 'summary', x: 0, y: 2, w: 6, h: 6, enabled: true },
	    mobile: { i: 'summary', x: 0, y: 2, w: 6, h: 6, enabled: true }
  	}
	},
	{
		name: 'paymentForm',
		type: 'Form',
		remove: false,
		grid: {
	    desktop: { i: 'form', x: 0, y: 3, w: 12, h: 40, minW: 10, enabled: true },
	    mobile: { i: 'form', x: 0, y: 3, w: 6, h: 60, minW: 4, enabled: true }
  	}
	},
	{
		name: 'content',
		type: 'Content',
		field: 'description',
		overflow: 'visible',
		grid: {
	    desktop: { i: 'content', x: 0, y: 4, w: 6, h: 6, enabled: true },
	    mobile: { i: 'content', x: 0, y: 4, w: 6, h: 6, enabled: true }
  	}
	},
];

export const initBlocks = {
	fundraiser: fundraiserBlocks
};
