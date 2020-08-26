export const helperTemplates = {
	article: {
		completed: [],
		helperSidebarShow: false,
		helperOpen: false,
		helperStep: 1,
		lastStep: 5,
		helpersAvailable: [
			{
				step: 1,
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
				defaultCheck: 'image'
			},
			{
				step: 2,
				blockName: 'title',
				title: 'Add a Title',
				text: 'A good title...',
				style: {
					top: 30,
					left: 15
				},
				className: 'helperTop',
				type: 'block',
				field: 'title',
				defaultCheck: 'text'
			},
			{
				step: 3,
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
				defaultCheck: 'image'
			},
			{
				step: 4,
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
				defaultCheck: 'text'
			},
			{
				step: 5,
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
			}
		]
	},
	receipt: {

	},
	org: {

	}
}
